import Title from "../components/Title.tsx";
import ProfileSettings from "../components/ProfileSettings.tsx";

export default function Settings() {
  return (
    <div>
        <Title title="Settings" description="Modify your settings" />
        <ProfileSettings />
    </div>
  )
}