import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
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

    useEffect(() => {
        // Fetch releases data when component mounts
        fetchData('/api/releases');
    }, []);

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return <div className="py-10 text-center">Loading releases...</div>;
    }

    if (error) {
        return <div className="py-10 text-center text-red-500">Error: {error}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="py-10 text-center">No releases found.</div>;
    }

    return (
        <ul role="list" className="divide-y divide-gray-100">
            {data.map((release) => (
                <li key={release.id} className="flex items-center justify-between gap-x-6 py-5">
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
                    <div className="flex flex-none items-center gap-x-4">
                        <Link
                            to={`/releases/${release.id}`}
                            className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
                        >
                            View details<span className="sr-only">, {release.title}</span>
                        </Link>
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
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                    >
                                        Move<span className="sr-only">, {release.title}</span>
                                    </a>
                                </MenuItem>
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
    )
}
