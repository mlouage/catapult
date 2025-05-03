import Title from "../components/Title.tsx";
import {Navigate, useParams} from "react-router-dom";

export default function Entry() {
    const { entryId: entryIdStr } = useParams();
    const entryId = parseInt(entryIdStr ?? '', 10);

    if (isNaN(entryId)) {
        console.error("Invalid entry ID:", entryIdStr);

        return <Navigate to="/" replace />;
    }

  return (
    <div>
        <Title title={`Entry ${entryId}`} />
    </div>
  )
}