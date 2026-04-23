import { motion } from "framer-motion";

export type AchievementItem = {
  label: string;
  value: number;
  suffix: string;
};

type AchievementsSectionProps = {
  achievements: AchievementItem[];
};

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <section className="relative mt-14 overflow-hidden rounded-3xl border border-blue-200/20 bg-linear-to-r from-[#082f49] via-[#0f3f72] to-[#0a2540] px-6 py-10 shadow-2xl">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />
      </motion.div>

      <div className="relative mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-100/80">Achievements</p>
        <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">A track record built in Geomark colors</h2>
      </div>

      <div className="relative grid grid-cols-2 gap-4 gap-y-8 text-center md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.03 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-cyan-100/15 bg-white/8 px-4 py-6 backdrop-blur-md"
          >
            <span className="bg-linear-to-r from-cyan-100 via-white to-blue-200 bg-clip-text text-4xl font-semibold text-transparent md:text-5xl">
              {item.value}
              <span>{item.suffix}</span>
            </span>
            <p className="mt-2 text-sm text-blue-50/85 md:text-base">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
