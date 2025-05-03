import Title from "../components/Title";
import ReleasesList from "../components/ReleasesList.tsx";

export default function ReleasesDetail() {
  return (
    <div>
      <Title title="Release detail" description="See what will be released with the next deployment" />
      <ReleasesList />
    </div>
  )
}
