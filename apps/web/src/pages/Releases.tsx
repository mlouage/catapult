import Title from "../components/Title";
import ReleasesList from "../components/ReleasesList.tsx";

export default function Releases() {
  return (
    <div>
      <Title title="Releases" description="Manage the current open release and see the history of previous releases." />
      <ReleasesList />
    </div>
  )
}
