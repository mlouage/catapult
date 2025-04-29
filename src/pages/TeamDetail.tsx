import { useParams } from 'react-router-dom'

export default function TeamDetail() {
  const { teamSlug } = useParams()
  const name =
    teamSlug
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || ''
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{name} Team</h1>
      <p>Welcome to the {name} team page.</p>
    </div>
  )
}