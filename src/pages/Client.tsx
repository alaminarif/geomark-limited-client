import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Loading from "@/components/layout/Loading";
import ClientCard from "@/components/modules/Client/ClientCard";
import DashboardPagination from "@/components/ui/dashboard-pagination";
import { useGetClientsQuery } from "@/redux/features/client/client.api";

interface ClientItem {
  _id?: string;
  name: string;
  picture?: string | null;
  link?: string;
}

const PAGE_SIZE = 12;
const EMPTY_CLIENTS: ClientItem[] = [];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const ClientPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetClientsQuery({
    sort: "createdAt",
    limit: 1000,
  });

  const allClients = (data?.data ?? EMPTY_CLIENTS) as ClientItem[];
  const totalPage = Math.max(1, Math.ceil(allClients.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPage);
  const clients = allClients.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  if (isLoading) return <Loading />;

  return (
    <section className="container mx-auto py-12 sm:py-16 lg:py-20">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Trusted Network</p>
          <h1 className="text-2xl font-bold uppercase text-blue-800 dark:text-foreground sm:text-3xl md:text-4xl">Our Clients</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Organizations and partners who have trusted Geomark Limited for GIS, surveying, digital mapping, planning, and IT-enabled consultancy.
          </p>
        </motion.div>

        {allClients.length === 0 ? (
          <div className="flex min-h-75 items-center justify-center rounded-3xl border border-dashed border-border bg-background/60 p-8 text-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">No client found</h2>
              <p className="mt-2 text-sm text-muted-foreground">There are no clients available right now.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-background/50 backdrop-blur-[1px]">
                <p className="text-sm text-muted-foreground">Refreshing clients...</p>
              </div>
            )}

            <motion.div
              key={safeCurrentPage}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {clients.map((item, index) => (
                <motion.div key={item._id || `${item.name}-${index}`} variants={cardVariants}>
                  <ClientCard item={item} />
                </motion.div>
              ))}
            </motion.div>

            <DashboardPagination currentPage={safeCurrentPage} totalPage={totalPage} onPageChange={setCurrentPage} layoutId="activeClientPageBubble" />
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientPage;
