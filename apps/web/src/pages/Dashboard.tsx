import Feed from "../components/Feed";
import Title from "../components/Title";

export default function Dashboard() {
  return (
    <div>
      <Title title="Recent activity" description="See what happened lately" />
      <Feed />
    </div>
  )
}
