import { useParams } from 'react-router-dom'
import Title from '../components/Title'
import TeamMembers from '../components/TeamMembers'
import ProtectedDataFetcher from '../components/ProtectedDataFetcher'

export default function TeamDetail() {
  const { teamSlug } = useParams()
  const name =
    teamSlug
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || ''
  return (
    <div>
      <Title title={name} />
      <TeamMembers />
      <ProtectedDataFetcher />
    </div>
  )
}
