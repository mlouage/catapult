import { useEffect, useState } from 'react';
import { useProtectedApi } from '../hooks/useProtectedApi';

// Define the Deployment interface based on the API response
interface Deployment {
  id: number;
  name: string;
  status: 'completed' | 'failed' | 'in_progress';
  environment: 'preview' | 'production';
  githubActionUrl: string;
  triggeredBy: string;
  deployedAt: string;
  releaseId: number | null;
}

const statuses = {
  completed: 'text-green-700 bg-green-50 ring-green-600/20',
  failed: 'text-red-800 bg-red-50 ring-red-600/20',
  in_progress: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DeploymentList() {
  const { data: deployments, error, loading, fetchData } = useProtectedApi<Deployment[]>();
  const [deployingToProduction, setDeployingToProduction] = useState<number | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  useEffect(() => {
    fetchData('/api/deployments');
  }, [fetchData]);

  // Check if a release is already deployed to production
  const isReleaseDeployedToProduction = (releaseId: number | null): boolean => {
    if (!releaseId || !deployments) return false;

    return deployments.some(
      deployment => 
        deployment.releaseId === releaseId && 
        deployment.environment === 'production' && 
        deployment.status === 'completed'
    );
  };

  const handleDeployToProduction = async (deploymentId: number) => {
    setDeployingToProduction(deploymentId);
    setDeploymentError(null);

    try {
      await fetchData(`/api/deployments/${deploymentId}/deploy-to-production`, {
        method: 'POST',
        body: { triggeredBy: 'Editor' }, // In a real app, this would be the current user's name
      });

      // Refresh the deployments list
      await fetchData('/api/deployments');
    } catch (error: any) {
      setDeploymentError(`Failed to deploy to production: ${error.message}`);
    } finally {
      setDeployingToProduction(null);
    }
  };

  if (loading && !deployments) {
    return <div className="py-4 text-center">Loading deployments...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-600">Error: {error}</div>;
  }

  if (!deployments || deployments.length === 0) {
    return <div className="py-4 text-center">No deployments found.</div>;
  }

  return (
    <>
      {deploymentError && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {deploymentError}
        </div>
      )}

      <ul role="list" className="divide-y divide-gray-100">
        {deployments.map((deployment) => (
          <li key={deployment.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900">{deployment.name}</p>
                <p
                  className={classNames(
                    statuses[deployment.status],
                    'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset capitalize',
                  )}
                >
                  {deployment.status.replace('_', ' ')}
                </p>
                <p
                  className="mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20 capitalize"
                >
                  {deployment.environment}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <p className="whitespace-nowrap">
                  Deployed on <time dateTime={deployment.deployedAt}>{formatDate(deployment.deployedAt)}</time>
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">{deployment.triggeredBy}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              {/* Show deploy to production button for completed preview deployments */}
              {deployment.environment === 'preview' && deployment.status === 'completed' && (
                <button
                  onClick={() => handleDeployToProduction(deployment.id)}
                  disabled={deployingToProduction !== null || isReleaseDeployedToProduction(deployment.releaseId)}
                  title={isReleaseDeployedToProduction(deployment.releaseId) 
                    ? "This release is already deployed to production" 
                    : "Deploy this preview to production"}
                  className={classNames(
                    "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-xs ring-1 ring-inset",
                    deployingToProduction === deployment.id || isReleaseDeployedToProduction(deployment.releaseId)
                      ? "bg-gray-100 text-gray-500 ring-gray-200 cursor-not-allowed"
                      : "bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100"
                  )}
                >
                  {deployingToProduction === deployment.id 
                    ? 'Deploying...' 
                    : isReleaseDeployedToProduction(deployment.releaseId)
                      ? 'Already on Production'
                      : 'Deploy to Production'}
                </button>
              )}

              <a
                href={deployment.githubActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
              >
                View deployment<span className="sr-only">, {deployment.name}</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
