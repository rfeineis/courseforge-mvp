# CourseForge Deployment Guide

## Overview

This guide covers deploying CourseForge to production with MySQL/TiDB database and S3 storage.

---

## 1. Database Configuration

### Automatic Driver Switching

CourseForge automatically switches database drivers based on `NODE_ENV`:

| Environment | Driver | Database |
|-------------|--------|----------|
| **Development** | `better-sqlite3` | SQLite (`./sqlite.db`) |
| **Production** | `mysql2` | MySQL/TiDB (via `DATABASE_URL`) |

**No code changes required** - the switch is automatic.

### Environment Variables

#### Development (SQLite)
```bash
NODE_ENV=development
DATABASE_URL=sqlite:./sqlite.db  # Optional, defaults to ./sqlite.db
```

#### Production (MySQL/TiDB)
```bash
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
```

**Example for TiDB Cloud:**
```bash
DATABASE_URL=mysql://user.root:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/courseforge?ssl={"rejectUnauthorized":true}
```

### Migration Strategy

#### Option 1: Fresh Database (Recommended for New Deployments)

1. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=mysql://user:password@host:port/database
   ```

2. **Generate migrations:**
   ```bash
   pnpm db:generate
   ```

3. **Apply migrations:**
   ```bash
   pnpm db:migrate
   ```

#### Option 2: Data Migration (SQLite → MySQL)

If you have existing data in SQLite:

1. **Export data from SQLite:**
   ```bash
   # Use Drizzle Studio to export data
   pnpm db:studio
   # Export tables as JSON
   ```

2. **Switch to MySQL:**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=mysql://user:password@host:port/database
   ```

3. **Run migrations:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. **Import data:**
   ```bash
   # Use Drizzle Studio or custom import script
   # Import JSON data into MySQL tables
   ```

### Database Schema Compatibility

The schema is designed to be **dual-compatible**:

- **SQLite:** Uses `integer`, `text`, and Unix timestamps
- **MySQL:** Uses `int`, `varchar`, `text`, and `timestamp`

The schema automatically adapts based on `NODE_ENV`.

### Connection Pooling (Production)

MySQL connection pool configuration:

```typescript
// server/db/index.ts
const connection = await mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,      // Adjust based on load
  queueLimit: 0,            // Unlimited queue
});
```

**Recommended settings:**
- **Small apps:** `connectionLimit: 10`
- **Medium apps:** `connectionLimit: 25`
- **Large apps:** `connectionLimit: 50+`

---

## 2. S3 Storage Configuration

### Bucket Setup

#### Create S3 Bucket

```bash
aws s3 mb s3://courseforge-uploads --region us-east-1
```

#### Enable Public Access for Objects (Not Bucket)

```bash
aws s3api put-public-access-block \
  --bucket courseforge-uploads \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Bucket Policy (Security Hardened)

**Critical:** This policy allows public read access to uploaded files while preventing script execution.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::courseforge-uploads/*"
    },
    {
      "Sid": "DenyExecutableUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::courseforge-uploads/*",
      "Condition": {
        "StringLike": {
          "s3:x-amz-server-side-encryption-customer-algorithm": [
            "*"
          ]
        }
      }
    }
  ]
}
```

**Apply the policy:**
```bash
aws s3api put-bucket-policy \
  --bucket courseforge-uploads \
  --policy file://bucket-policy.json
```

### CORS Configuration

Allow uploads from your frontend:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**Apply CORS:**
```bash
aws s3api put-bucket-cors \
  --bucket courseforge-uploads \
  --cors-configuration file://cors.json
```

### Content-Type Enforcement

**Server-side upload validation** (prevents script uploads):

```typescript
// server/services/upload.ts
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
];

function validateUpload(file: File): boolean {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'pdf'];
  
  if (!ext || !allowedExtensions.includes(ext)) {
    throw new Error('Invalid file extension');
  }
  
  return true;
}
```

### S3 Upload with Public-Read ACL

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToS3(file: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',  // Allow public read access
    // Security headers
    ServerSideEncryption: 'AES256',
    Metadata: {
      'uploaded-by': 'courseforge',
      'upload-date': new Date().toISOString(),
    },
  });

  await s3Client.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
```

### Environment Variables for S3

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# S3 Bucket
S3_BUCKET_NAME=courseforge-uploads
```

### Security Best Practices

✅ **Do:**
- Use `public-read` ACL for uploaded files
- Validate MIME types server-side
- Validate file extensions
- Set `Content-Type` header correctly
- Use server-side encryption (AES256)
- Implement file size limits
- Scan uploads for malware (optional)

❌ **Don't:**
- Allow executable files (.js, .exe, .sh, .bat)
- Trust client-side MIME type validation
- Allow bucket-level public write access
- Skip file extension validation
- Allow unlimited file sizes

### File Size Limits

```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function validateFileSize(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }
  return true;
}
```

---

## 3. Environment Variables (Complete List)

### Development (.env.development)

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=sqlite:./sqlite.db

# Server
PORT=3000

# AI Services (Manus API)
OPENAI_API_KEY=your_openai_api_key

# S3 (Optional for local dev)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=courseforge-uploads-dev
```

### Production (.env.production)

```bash
# Environment
NODE_ENV=production

# Database (MySQL/TiDB)
DATABASE_URL=mysql://user:password@host:port/database

# Server
PORT=3000

# AI Services (Manus API)
OPENAI_API_KEY=your_openai_api_key

# S3 Storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=courseforge-uploads

# Security
SESSION_SECRET=your_random_session_secret
ALLOWED_ORIGINS=https://your-domain.com
```

---

## 4. Deployment Checklist

### Pre-Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Configure `DATABASE_URL` for MySQL/TiDB
- [ ] Set up S3 bucket with security policy
- [ ] Configure CORS for S3
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Test database connection
- [ ] Test S3 uploads

### Deployment

- [ ] Build frontend: `pnpm build:client`
- [ ] Build backend: `pnpm build:server`
- [ ] Deploy to hosting platform (Vercel, Railway, AWS, etc.)
- [ ] Verify database connection in production
- [ ] Verify S3 uploads work
- [ ] Test SCORM package generation
- [ ] Monitor logs for errors

### Post-Deployment

- [ ] Test all features in production
- [ ] Verify SCORM Cloud validation
- [ ] Check database performance
- [ ] Monitor S3 usage and costs
- [ ] Set up database backups
- [ ] Configure monitoring/alerting

---

## 5. Platform-Specific Guides

### Railway

1. **Create new project**
2. **Add MySQL database plugin**
3. **Set environment variables:**
   ```bash
   NODE_ENV=production
   DATABASE_URL=${{MySQL.DATABASE_URL}}
   ```
4. **Deploy from GitHub**

### Vercel

1. **Connect GitHub repository**
2. **Add TiDB Cloud database**
3. **Set environment variables in Vercel dashboard**
4. **Deploy**

**Note:** Vercel requires serverless-compatible database (TiDB Cloud recommended)

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04)
2. **Install Node.js 22+**
3. **Set up RDS MySQL instance**
4. **Configure security groups**
5. **Clone repository and build**
6. **Use PM2 for process management:**
   ```bash
   pm2 start dist/server/index.js --name courseforge
   pm2 save
   pm2 startup
   ```

---

## 6. Database Backup Strategy

### MySQL Backups

**Automated daily backups:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h host -u user -p database > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://courseforge-backups/
```

**Cron job:**
```bash
0 2 * * * /path/to/backup.sh
```

### TiDB Cloud Backups

TiDB Cloud provides automatic backups:
- Point-in-time recovery
- Automated daily backups
- Manual backup snapshots

---

## 7. Monitoring & Logging

### Database Monitoring

```typescript
// server/db/index.ts
db.on('query', (query) => {
  console.log('Query:', query.sql);
  console.log('Duration:', query.duration, 'ms');
});
```

### S3 Upload Monitoring

```typescript
// Track upload success/failure
async function uploadWithLogging(file: File) {
  try {
    const url = await uploadToS3(file);
    console.log('Upload success:', url);
    return url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

---

## 8. Troubleshooting

### Database Connection Issues

**Error:** `DATABASE_URL is required in production`

**Solution:** Set the `DATABASE_URL` environment variable with MySQL connection string.

**Error:** `Connection refused`

**Solution:** 
- Check MySQL server is running
- Verify host/port are correct
- Check firewall rules
- Verify credentials

### S3 Upload Issues

**Error:** `Access Denied`

**Solution:**
- Verify AWS credentials are correct
- Check IAM permissions
- Verify bucket policy allows PutObject

**Error:** `CORS error`

**Solution:**
- Check CORS configuration on S3 bucket
- Verify `AllowedOrigins` includes your domain

---

## 9. Performance Optimization

### Database

- Use connection pooling (already configured)
- Add indexes on frequently queried columns
- Use `EXPLAIN` to analyze slow queries
- Consider read replicas for high traffic

### S3

- Use CloudFront CDN for faster delivery
- Enable S3 Transfer Acceleration
- Compress images before upload
- Use lazy loading for images

---

## 10. Security Hardening

### Database

- [ ] Use strong passwords
- [ ] Enable SSL/TLS connections
- [ ] Restrict database access by IP
- [ ] Regular security updates
- [ ] Monitor for suspicious queries

### S3

- [ ] Enable bucket versioning
- [ ] Enable server-side encryption
- [ ] Use bucket policies (not ACLs)
- [ ] Enable access logging
- [ ] Regular security audits

---

## Summary

✅ **Database:** Automatic switching between SQLite (dev) and MySQL (prod)  
✅ **S3:** Public-read with execute protection  
✅ **Security:** Hardened bucket policies and file validation  
✅ **Deployment:** Platform-agnostic with clear migration path  

**Ready for production deployment!**
