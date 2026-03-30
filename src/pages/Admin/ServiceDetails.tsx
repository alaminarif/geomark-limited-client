import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, cubicBezier } from "framer-motion";
import { ArrowLeft, Pencil, Image as ImageIcon, FileText, BadgeInfo, Hash } from "lucide-react";

import { useGetSingleServiceQuery } from "@/redux/features/service/service.api";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
    },
  }),
};

const fallbackImage = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleServiceQuery(id as string, {
    skip: !id,
  });

  const service = data?.data?.data || data?.data || data;

  const { _id, picture, name, description } = service || {};

  const serviceName = name || "Unnamed Service";
  const serviceDescription = description || "No description is available for this service right now.";
  const displayImage = picture || fallbackImage;

  const descriptionStats = useMemo(() => {
    const words = serviceDescription.trim() ? serviceDescription.trim().split(/\s+/).length : 0;

    const chars = serviceDescription.trim().length;

    return {
      words,
      chars,
    };
  }, [serviceDescription]);

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (!service) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-white/60 bg-white p-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Service not found</h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400">The service you are trying to view does not exist or could not be loaded.</p>

            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:shadow-slate-700/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-8 md:py-10">
      <motion.div initial="hidden" animate="visible" className="mx-auto max-w-6xl">
        <motion.div variants={fadeUp} custom={0} className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:shadow-slate-700/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Link
            to={`/admin/service/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
          >
            <Pencil className="h-4 w-4" />
            Edit Service
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.08}
          className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative h-48 overflow-hidden bg-linear-to-r from-purple-500 to-blue-500 md:h-60">
            <img
              src={displayImage}
              alt={serviceName}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-slate-950/55" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.12),transparent_22%)]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="relative flex h-full items-start justify-between p-6 md:p-8"
            >
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">Service Profile</p>
                <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">Service Details</h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                  A complete overview of the service image, title, description, and identity details.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="-mt-16 rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:-mt-20 md:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <motion.div whileHover={{ scale: 1.03 }} className="shrink-0">
                    <img
                      src={displayImage}
                      alt={serviceName}
                      className="h-28 w-28 rounded-[24px] border-4 border-white object-cover shadow-lg dark:border-slate-800 md:h-32 md:w-32"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </motion.div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{serviceName}</h2>

                      <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-500/15 dark:text-violet-300">
                        <BadgeInfo className="mr-1.5 h-3.5 w-3.5" />
                        service
                      </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 line-clamp-2">{serviceDescription}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <StatCard label="Description Words" value={String(descriptionStats.words)} />
                  <StatCard label="Description Length" value={`${descriptionStats.chars} chars`} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.15} initial="hidden" animate="visible" className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <FileText className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Service Information</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Basic service content and media details.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={<BadgeInfo className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="Service Name" value={serviceName} />

                    <InfoCard
                      icon={<ImageIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Image Status"
                      value={picture ? "Custom image added" : "Using fallback image"}
                    />
                  </div>

                  <div className="mt-4">
                    <DescriptionCard description={serviceDescription} />
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <Hash className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Service Identity</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unique service reference details.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Service ID</p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">{_id || id || "N/A"}</p>
                  </div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-md"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Service Summary</p>
                    <h4 className="mt-2 text-lg font-semibold">{serviceName}</h4>
                    <p className="mt-1 text-sm text-white/75">
                      This service includes a dedicated image, a highlighted title, and a detailed description section for a clean viewing experience.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">{icon}</div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 break-all text-base font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const DescriptionCard = ({ description }: { description: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
          <FileText className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</p>
          <p className="mt-2 whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-200">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">{value || "N/A"}</p>
    </motion.div>
  );
};

const SkeletonBlock = ({ className = "" }: { className?: string }) => {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800 ${className}`} />;
};

const ServiceDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SkeletonBlock className="h-11 w-28 rounded-2xl" />
          <SkeletonBlock className="h-11 w-36 rounded-2xl" />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
          <div className="h-48 bg-slate-300/70 dark:bg-slate-800 md:h-60" />

          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-16 rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:-mt-20 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <SkeletonBlock className="h-28 w-28 rounded-[24px] md:h-32 md:w-32" />

                  <div className="space-y-3">
                    <SkeletonBlock className="h-8 w-56" />
                    <SkeletonBlock className="h-5 w-24 rounded-full" />
                    <SkeletonBlock className="h-4 w-80" />
                    <SkeletonBlock className="h-4 w-72" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <SkeletonBlock className="h-24 w-full" />
                  <SkeletonBlock className="h-24 w-full" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-40" />
                      <SkeletonBlock className="h-4 w-56" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                  </div>

                  <SkeletonBlock className="mt-4 h-44 w-full" />
                </div>
              </div>

              <div>
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-36" />
                      <SkeletonBlock className="h-4 w-48" />
                    </div>
                  </div>

                  <SkeletonBlock className="h-20 w-full" />
                  <SkeletonBlock className="mt-4 h-28 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
