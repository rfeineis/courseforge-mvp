import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './lib/trpc';

function AppContent() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CourseForge</h1>
          <p className="text-gray-600 mt-1">Transform videos into interactive courses</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          
          {isLoading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : projects && projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id} className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium text-lg">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {project.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No projects yet</p>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                Create Your First Project
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
