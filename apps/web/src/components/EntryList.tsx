// Define the type for the events that will be passed as props
interface Event {
  id: number;
  receivedAt: string;
  eventName: string;
  model: string;
  uid: string;
  documentId: string;
  locale: string | null;
  eventCreatedAt: string;
  eventUpdatedAt: string;
  eventPublishedAt: string;
  entryId: number;
  entryTitle: string | null;
  createdByFirstname: string;
  updatedByFirstname: string;
  createdByLastname: string;
  updatedByLastname: string;
  entryPayload: any;
  releaseId: number;
}

interface EntryListProps {
  events?: Event[];
}

const cmsUrl = import.meta.env.VITE_CMS_URL || 'http://localhost:1337';

const models = {
  page: 'text-green-700 bg-green-50 ring-green-600/20',
  author: 'text-blue-800 bg-blue-50 ring-blue-600/20',
  tag: 'text-orange-800 bg-orange-50 ring-orange-600/20',
  article: 'text-purple-800 bg-purple-50 ring-purple-600/20',
  homepage: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  'global-setting': 'text-pink-800 bg-pink-50 ring-pink-600/20',
}

export default function EntryList({ events = [] }: EntryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
      <ul role="list" className="divide-y divide-gray-100">
        {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">

                  <p
                      className={classNames(
                          models[event.model],
                          'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
                      )}
                  >
                    {event.model}
                  </p>
                  <p className="text-sm/6 font-semibold text-gray-900">{event.entryTitle ?? event.documentId}</p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                  <p className="whitespace-nowrap">
                    Published on <time dateTime={event.eventPublishedAt}>{formatDate(event.eventPublishedAt)}</time>
                  </p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">{event.createdByFirstname + ' ' + event.createdByLastname}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <a
                  href={`${cmsUrl}/admin/content-manager/collection-types/${event.uid}/${event.documentId}?status=published`}
                  className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
                  target="_blank"
                >
                  View in CMS<span className="sr-only">, {event.model} {event.entryTitle ?? event.documentId}</span>
                </a>
              </div>
            </li>
        ))}
      </ul>
  )
}
