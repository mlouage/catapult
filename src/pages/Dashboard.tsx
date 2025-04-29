import Feed from "../components/Feed";
import Title from "../components/Title";

export default function Dashboard() {
  return (
    <div>
      <Title title="Dashboard" description="See what happened lately" />
      <Feed />
    </div>
  )
}
