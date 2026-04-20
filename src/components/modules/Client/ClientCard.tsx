import { motion } from "framer-motion";

interface ClientItem {
  _id?: string;
  name: string;
  picture: string;
  link?: string;
}

type Props = {
  item: ClientItem;
};

const ClientCard = ({ item }: Props) => {
  const cardContent = (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex min-h-65 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-muted/30 p-5">
          <img
            src={item.picture}
            alt={item.name}
            className="max-h-35 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h3 className="text-xl font-semibold text-foreground/90 sm:text-2xl">{item.name}</h3>

        {item.link && <p className="mt-2 text-sm text-muted-foreground">Visit client profile</p>}
      </div>
    </motion.div>
  );

  if (item.link) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return <div className="h-full">{cardContent}</div>;
};

export default ClientCard;
