'use client'

import { CheckCircleIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'
import { useProtectedApi } from '../hooks/useProtectedApi'

// Define interface for event data
interface Event {
  id: number;
  receivedAt: string;
  eventName: string;
  model: string;
  uid: string;
  documentId?: string;
  locale?: string;
  eventCreatedAt: string;
  eventUpdatedAt: string;
  eventPublishedAt?: string;
  entryId: number;
  entryTitle?: string;
  createdByFirstname?: string;
  updatedByFirstname?: string;
  createdByLastname?: string;
  updatedByLastname?: string;
  releaseId?: number;
}

// Helper function to format relative time (e.g., "7 days ago")
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'yesterday';
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
}

// Helper function to get action verb based on event name
function getActionVerb(eventName: string): string {
  if (eventName === 'entry.publish') return 'published';
  if (eventName === 'entry.unpublish') return 'unpublished';
  if (eventName === 'entry.delete') return 'deleted';
  return 'updated'; // Default fallback
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Feed() {
  const { data: entries, error, loading, fetchData } = useProtectedApi<Event[]>();

  useEffect(() => {
    // Fetch entries when component mounts
    fetchData('/api/entries');
  }, []);

  // Get icon based on event type
  const getEventIcon = (eventName: string) => {
    if (eventName === 'entry.publish') {
      return <CheckCircleIcon aria-hidden="true" className="size-6 text-green-600" />;
    } else if (eventName === 'entry.unpublish') {
      return <DocumentTextIcon aria-hidden="true" className="size-6 text-yellow-600" />;
    } else if (eventName === 'entry.delete') {
      return <TrashIcon aria-hidden="true" className="size-6 text-red-600" />;
    } else {
      return <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />;
    }
  };

  // Get person's full name
  const getPersonName = (entry: Event): string => {
    const firstName = entry.updatedByFirstname || entry.createdByFirstname || '';
    const lastName = entry.updatedByLastname || entry.createdByLastname || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown user';
  };

  if (loading) {
    return <div className="text-center py-4">Loading activity feed...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading feed: {error}</div>;
  }

  if (!entries || entries.length === 0) {
    return <div className="text-center py-4">No recent activity found.</div>;
  }

  return (
    <>
      <ul role="list" className="space-y-6 mt-4">
        {entries.map((entry, entryIdx) => (
          <li key={entry.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                entryIdx === entries.length - 1 ? 'h-6' : '-bottom-6',
                'absolute top-0 left-0 flex w-6 justify-center',
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
            <>
              <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                {getEventIcon(entry.eventName)}
              </div>
              <p className="flex-auto py-0.5 text-xs/5 text-gray-500">
                {entry.eventName === 'entry.unpublish' ? (
                  <>
                    <span className="font-medium">{entry.model}</span>
                    {entry.entryTitle && <span> {entry.entryTitle}</span>} has been unpublished
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-900">{getPersonName(entry)}</span> {getActionVerb(entry.eventName)} a{' '}
                    <span className="font-medium">{entry.model}</span>
                    {entry.entryTitle && <span>: {entry.entryTitle}</span>}
                  </>
                )}
              </p>
              <time dateTime={entry.receivedAt} className="flex-none py-0.5 text-xs/5 text-gray-500">
                {formatRelativeTime(entry.receivedAt)}
              </time>
            </>
          </li>
        ))}
      </ul>
    </>
  )
}
