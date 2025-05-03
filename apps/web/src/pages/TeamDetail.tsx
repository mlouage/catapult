import { useParams } from 'react-router-dom'
import { useMsal } from "@azure/msal-react"
import { InteractionStatus } from "@azure/msal-browser"
import Title from '../components/Title'
import { useProtectedApi } from '../hooks/useProtectedApi'
import { useEffect } from "react";

export default function TeamDetail() {
  const { teamSlug } = useParams()
  const name =
    teamSlug
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || ''
  
  const { accounts, inProgress } = useMsal()
  const { data: teamData, error, loading, fetchData } = useProtectedApi()
  
  const loadTeamData = async () => {
    await fetchData(`/api/releases/3`)
  }
  
  useEffect(() => {
    if (accounts.length > 0) {
      loadTeamData()
    }
  }, [accounts, teamSlug])
  
  return (
    <div>
      <Title title={name} />

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

        {teamData && (
          <div className="mt-4 border border-gray-200 rounded-md p-4">
            <h3 className="font-medium mb-2">Data:</h3>
            <pre className="bg-gray-50 p-3 rounded overflow-x-auto text-sm">
              {JSON.stringify(teamData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
