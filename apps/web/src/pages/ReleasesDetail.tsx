import {Navigate, useParams} from 'react-router-dom'
import { useMsal } from "@azure/msal-react"
import { InteractionStatus } from "@azure/msal-browser"
import Title from '../components/Title'
import { useProtectedApi } from '../hooks/useProtectedApi'
import { useEffect } from "react";
import EntryList from '../components/EntryList'

export default function ReleasesDetail() {
    const { releaseId: releaseIdStr } = useParams();
    const releaseId = parseInt(releaseIdStr ?? '', 10);
    const { accounts, inProgress } = useMsal()
    const { data, error, loading, fetchData } = useProtectedApi()
    const isValidId = !isNaN(releaseId);

    // All hooks must be called before any conditional returns
    useEffect(() => {
        // Only fetch if we have a valid ID and accounts
        if (isValidId && accounts.length > 0) {
            fetchData(`/api/releases/${releaseId}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Using empty dependency array like Feed.tsx

    // After all hooks are called, we can have conditional rendering
    if (!isValidId) {
        console.error("Invalid release ID:", releaseIdStr);
        return <Navigate to="/releases" replace />;
    }

    return (
        <div>
            <Title title="Release detail" description="See what entries from the CMS will be included in the next deployment" />

            <div className="mt-6">
                {loading && (
                    <p className="mt-2 text-gray-600"><i>Loading data...</i></p>
                )}

                {inProgress !== InteractionStatus.None && (
                    <p className="mt-2 text-gray-600"><i>(Authentication in progress...)</i></p>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {data && <EntryList events={data.webhooks} />}
            </div>
        </div>
    )
}
