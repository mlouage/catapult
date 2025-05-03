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

    if (isNaN(releaseId)) {
        console.error("Invalid release ID:", releaseIdStr);

        return <Navigate to="/releases" replace />;
    }

    const { accounts, inProgress } = useMsal()
    const { data, error, loading, fetchData } = useProtectedApi()

    const loadData = async () => {
        await fetchData(`/api/releases/${releaseId}`)
    }

    useEffect(() => {
        if (accounts.length > 0) {
            loadData()
        }
    }, [accounts, releaseIdStr])

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
