import DeploymentList from "../components/DeploymentList";
import Title from "../components/Title";

export default function Deployments() {
  return (
    <>
      <Title title="Deployments" description="See the latest deployment on GitHub" />
      <DeploymentList />
    </>
  )
}
