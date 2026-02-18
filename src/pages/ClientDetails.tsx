import Loading from "@/components/layout/Loading";
import { useGetSingleClientQuery } from "@/redux/features/client/client.api";
import { useParams } from "react-router";

const ClientDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleClientQuery(id as string);
  if (isLoading) {
    return <Loading />;
  }

  console.log(data);
  return (
    <div>
      <h1>Client Details for ID: {id}</h1>
    </div>
  );
};

export default ClientDetails;
