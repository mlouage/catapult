import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useProtectedApi } from '../hooks/useProtectedApi';

// Define the Release interface based on the API response
interface Release {
    id: number;
    title: string;
    description: string | null;
    status: string;
    createdAt: string;
    closedAt: string | null;
}

const statuses = {
    open: 'text-green-700 bg-green-50 ring-green-600/20',
    closed: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ReleasesList() {
    const { data, error, loading, fetchData } = useProtectedApi<Release[]>();
    const [closingReleaseId, setClosingReleaseId] = useState<number | null>(null);
    const [closeError, setCloseError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch releases data when component mounts
        fetchData('/api/releases');
    }, []);

    // Function to close a release
    const handleCloseRelease = async (releaseId: number) => {
        setClosingReleaseId(releaseId);
        setCloseError(null);

        try {
            await fetchData(`/api/releases/${releaseId}/close`, {
                method: 'POST'
            });

            // Refresh the releases list after closing
            await fetchData('/api/releases');
        } catch (error: any) {
            setCloseError(`Failed to close release: ${error.message}`);
        } finally {
            setClosingReleaseId(null);
        }
    };

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading && !data) {
        return <div className="py-10 text-center">Loading releases...</div>;
    }

    if (error) {
        return <div className="py-10 text-center text-red-500">Error: {error}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="py-10 text-center">No releases found.</div>;
    }

    return (
        <>
            {closeError && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {closeError}
                </div>
            )}

            {closingReleaseId !== null && (
                <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
                    Closing release... Please wait.
                </div>
            )}

            <ul role="list" className="divide-y divide-gray-100">
                {data.map((release) => (
                    <li key={release.id} className="flex items-center justify-between gap-x-6 py-5 group">
                        <Link 
                            to={`/releases/${release.id}`}
                            className="flex-grow flex items-center justify-between gap-x-6 cursor-pointer p-4 hover:bg-gray-50 rounded-md group-hover:bg-gray-50"
                        >
                            <div className="min-w-0">
                                <div className="flex items-start gap-x-3">
                                    <p className="text-sm/6 font-semibold text-gray-900">{release.title}</p>
                                    <p
                                        className={classNames(
                                            statuses[release.status],
                                            'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset capitalize',
                                        )}
                                    >
                                        {release.status}
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                                    <p className="whitespace-nowrap">
                                        Created on <time dateTime={release.createdAt}>{formatDate(release.createdAt)}</time>
                                    </p>
                                    {release.description && (
                                        <>
                                            <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                                                <circle r={1} cx={1} cy={1} />
                                            </svg>
                                            <p className="truncate">{release.description}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                        <div className="flex flex-none items-center gap-x-4">
                            <Menu as="div" className="relative flex-none">
                                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                    <span className="sr-only">Open options</span>
                                    <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                        >
                                            Edit<span className="sr-only">, {release.title}</span>
                                        </a>
                                    </MenuItem>
                                    {release.status === 'open' && (
                                        <MenuItem>
                                            <button
                                                onClick={() => handleCloseRelease(release.id)}
                                                disabled={closingReleaseId !== null}
                                                className="block w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                            >
                                                Close<span className="sr-only">, {release.title}</span>
                                            </button>
                                        </MenuItem>
                                    )}
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                        >
                                            Delete<span className="sr-only">, {release.title}</span>
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
