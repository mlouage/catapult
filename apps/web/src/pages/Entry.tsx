import Title from "../components/Title.tsx";
import {Navigate, useParams} from "react-router-dom";
import {useMsal} from "@azure/msal-react";
import {useProtectedApi} from "../hooks/useProtectedApi.ts";
import {useEffect} from "react";
import {InteractionStatus} from "@azure/msal-browser";

export default function Entry() {
    const {entryId: entryIdStr} = useParams();
    const entryId = parseInt(entryIdStr ?? '', 10);

    if (isNaN(entryId)) {
        console.error("Invalid entry ID:", entryIdStr);

        return <Navigate to="/" replace/>;
    }

    const {accounts, inProgress} = useMsal()
    const {data, error, loading, fetchData} = useProtectedApi()

    const loadData = async () => {
        await fetchData(`/api/entries/${entryId}`)
    }

    useEffect(() => {
        if (accounts.length > 0) {
            loadData()
        }
    }, [accounts, entryIdStr])

    return (
        <div>
            <Title title={`Entry ${entryId}`} description="Raw event received from strapi"/>
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

                {data &&
                    <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                        {JSON.stringify(data, null, 2)}
                    </pre>}
            </div>

        </div>
    )
}