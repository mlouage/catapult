import { HomeIcon } from '@heroicons/react/20/solid'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProtectedApi } from '../hooks/useProtectedApi'
import { useMsal } from '@azure/msal-react'

export default function Breadcrumbs() {
    const location = useLocation();
    const params = useParams();
    const { accounts } = useMsal();
    const { data: entryData, fetchData } = useProtectedApi();
    const [releaseId, setReleaseId] = useState<number | null>(null);

    // Fetch entry data to get the releaseId if we're on an entry page
    useEffect(() => {
        const fetchEntryData = async () => {
            const pathSegments = location.pathname.split('/').filter(segment => segment);
            if (pathSegments[0] === 'entry' && !isNaN(Number(pathSegments[1])) && accounts.length > 0) {
                await fetchData(`/api/entries/${pathSegments[1]}`);
            }
        };

        fetchEntryData();
    }, [location.pathname, accounts, fetchData]);

    // Set releaseId when entryData is loaded
    useEffect(() => {
        if (entryData && entryData.releaseId) {
            setReleaseId(entryData.releaseId);
        }
    }, [entryData]);

    // Generate breadcrumbs based on current path
    const getBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);
        const breadcrumbs = [];
        let currentPath = '';

        // Handle special cases for dynamic routes
        const isReleasesDetail = pathSegments.length === 2 && pathSegments[0] === 'releases' && !isNaN(Number(pathSegments[1]));
        const isTeamDetail = pathSegments.length === 2 && pathSegments[0] === 'teams';
        const isEntry = pathSegments.length === 2 && pathSegments[0] === 'entry';

        // Special case for release detail pages
        if (isReleasesDetail) {
            // Add Releases
            breadcrumbs.push({
                name: 'Releases',
                path: '/releases',
                current: false
            });

            // Add specific Release
            const releaseId = pathSegments[1];
            breadcrumbs.push({
                name: `Release ${releaseId}`,
                path: `/releases/${releaseId}`,
                current: true
            });

            return breadcrumbs;
        }

        // Special case for entry pages: if we have a releaseId, show the full hierarchy
        if (isEntry && releaseId) {
            // Add Releases
            breadcrumbs.push({
                name: 'Releases',
                path: '/releases',
                current: false
            });

            // Add specific Release
            breadcrumbs.push({
                name: `Release ${releaseId}`,
                path: `/releases/${releaseId}`,
                current: false
            });

            // Add Entry
            const entryId = pathSegments[1];
            breadcrumbs.push({
                name: `Entry ${entryId}`,
                path: `/entry/${entryId}`,
                current: true
            });

            return breadcrumbs;
        }

        // Standard breadcrumb generation for other pages
        for (let i = 0; i < pathSegments.length; i++) {
            const segment = pathSegments[i];
            currentPath += `/${segment}`;

            // Skip numeric IDs in the breadcrumb path but keep them in the label
            let path = currentPath;
            let name = '';
            const current = i === pathSegments.length - 1;

            // Handle different route segments
            if (segment === 'dashboard') {
                // Skip dashboard segment as it's represented by the Home icon
                continue;
            } else if (segment === 'releases') {
                name = 'Releases';
            } else if (segment === 'deployments') {
                name = 'Deployments';
            } else if (segment === 'settings') {
                name = 'Settings';
            } else if (segment === 'profile') {
                name = 'Profile';
            } else if (segment === 'team') {
                name = 'Team';
            } else if (segment === 'reports') {
                name = 'Reports';
            } else if (segment === 'logout') {
                name = 'Logout';
            } else if (segment === 'teams') {
                name = 'Teams';
                // If this is part of a team detail route
                if (i < pathSegments.length - 1) {
                    continue; // Skip this segment as we'll handle it in the next iteration
                }
            } else if (isReleasesDetail && i === 1) {
                // For release detail pages
                name = `Release ${segment}`;
                path = `/releases/${segment}`;
            } else if (isTeamDetail && i === 1) {
                // For team detail pages, format the team name
                name = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                path = `/teams/${segment}`;
            } else if (isEntry && i === 1) {
                // For entry detail pages (fallback if no releaseId is available)
                name = `Entry ${segment}`;
                path = `/entry/${segment}`;
            } else {
                // Default case: capitalize the segment name
                name = segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            breadcrumbs.push({
                name,
                path,
                current
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    // Hide breadcrumbs on root or dashboard path
    if (location.pathname === '/' || location.pathname === '/dashboard') {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="flex border-b border-gray-200 bg-white mb-8">
            <ol role="list" className="mx-auto flex w-full max-w-(--breakpoint-xl) space-x-4 px-4 sm:px-6 lg:px-8">
                <li className="flex">
                    <div className="flex items-center">
                        <NavLink to="/dashboard" className="text-primary-700 hover:text-primary-300">
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                            <span className="sr-only">Home</span>
                        </NavLink>
                    </div>
                </li>
                {breadcrumbs.map((crumb) => (
                    <li key={crumb.name} className="flex">
                        <div className="flex items-center">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 44"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                                className="h-full w-6 shrink-0 text-gray-200"
                            >
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                            </svg>
                            <NavLink
                                to={crumb.path}
                                aria-current={crumb.current ? 'page' : undefined}
                                className="ml-4 text-sm font-medium text-primary-700 hover:text-primary-300"
                            >
                                {crumb.name}
                            </NavLink>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
