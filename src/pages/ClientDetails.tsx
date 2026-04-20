import Loading from "@/components/layout/Loading";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, truncateText } from "@/lib/seo";
import { useGetSingleClientQuery } from "@/redux/features/client/client.api";
import { useParams } from "react-router";

const ClientDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleClientQuery(id as string);
  const client = data?.data?.data;
  const clientName = client?.name || "Client Details";
  const canonical = `/client/${id ?? ""}`;

  if (isLoading) {
    return (
      <>
        <SEO title="Client Details" description="Loading Geomark Limited client details." canonical={canonical} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <SEO
        title={clientName}
        description={truncateText(`Geomark Limited client profile for ${clientName}.`)}
        image={client?.picture}
        canonical={canonical}
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Clients", path: "/client" },
          { name: clientName, path: canonical },
        ])}
      />

      <div>
        <h1>Client Details for ID: {id}</h1>
      </div>
    </>
  );
};

export default ClientDetails;
