import Feed from "../components/Feed";
import Title from "../components/Title";
import Stats from "../components/Stats";

export default function Dashboard() {
  return (
    <div>
      <Title title="Recent activity" description="See what happened lately" />
      <Stats />
      <Feed />
    </div>
  )
}
