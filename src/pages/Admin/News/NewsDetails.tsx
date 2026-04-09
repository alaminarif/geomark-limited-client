/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, cubicBezier } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Pencil, CalendarDays, CircleUserRound, IdCard, Newspaper, FileText, Image as ImageIcon, BadgeInfo } from "lucide-react";

import { useGetSingleNewsQuery } from "@/redux/features/news/news.api";

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

const formatDateValue = (value?: string | Date) => {
  if (!value) return "N/A";

  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return format(parsed, "PPP");
};

const extractNews = (payload: any) => {
  return payload?.data?.data || payload?.data?.news || payload?.news || payload?.data || {};
};

const getImageUrl = (news: any) => {
  return (
    news?.picture ||
    news?.image ||
    news?.photo ||
    news?.avatar ||
    news?.thumbnail ||
    news?.banner ||
    news?.file?.url ||
    news?.file?.secure_url ||
    news?.file?.path ||
    (typeof news?.file === "string" ? news.file : "") ||
    ""
  );
};

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleNewsQuery(id as string);

  const news = useMemo(() => extractNews(data), [data]);

  const { _id, name, description, createdAt, updatedAt, publishedAt } = news;

  const coverImage = useMemo(() => {
    const rawImage = getImageUrl(news);
    return rawImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "News")}&background=0f172a&color=ffffff&size=256`;
  }, [news, name]);

  const publishedDate = useMemo(() => formatDateValue(publishedAt || createdAt), [publishedAt, createdAt]);
  const updatedDate = useMemo(() => formatDateValue(updatedAt), [updatedAt]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-8 md:py-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="h-11 w-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-11 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
            <div className="h-48 bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 md:h-60" />

            <div className="relative px-5 pb-6 md:px-8 md:pb-8">
              <div className="-mt-16 rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:-mt-20 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="h-28 w-28 rounded-[24px] bg-slate-200 dark:bg-slate-800 md:h-32 md:w-32" />
                    <div className="space-y-3">
                      <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                    <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                  <div className="h-72 rounded-[24px] bg-white dark:bg-slate-900" />
                  <div className="h-80 rounded-[24px] bg-white dark:bg-slate-900" />
                </div>

                <div className="space-y-5">
                  <div className="h-72 rounded-[24px] bg-white dark:bg-slate-900" />
                  <div className="h-40 rounded-[24px] bg-white dark:bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            to={`/admin/news/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
          >
            <Pencil className="h-4 w-4" />
            Edit News
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.08}
          className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative h-48 overflow-hidden bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 md:h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.12),transparent_22%)]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="relative flex h-full items-start justify-between p-6 md:p-8"
            >
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">News Article</p>
                <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">News Details</h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                  A complete overview of the news title, description, image and publication details.
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
                      src={coverImage}
                      alt={name || "News"}
                      className="h-28 w-28 rounded-[24px] border-4 border-white object-cover shadow-lg dark:border-slate-800 md:h-32 md:w-32"
                    />
                  </motion.div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{name || "Untitled News"}</h2>

                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-400">
                        <Newspaper className="mr-1.5 h-3.5 w-3.5" />
                        News Item
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <CalendarDays className="h-4 w-4" />
                        Published {publishedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <StatCard label="Published" value={publishedDate} />
                  <StatCard label="Updated" value={updatedDate} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.15} initial="hidden" animate="visible" className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <CircleUserRound className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">News Information</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Basic news identity and summary details.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={<Newspaper className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="News Title" value={name || "N/A"} />
                    <InfoCard
                      icon={<CalendarDays className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Published Date"
                      value={publishedDate}
                    />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <FileText className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Description</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Detailed summary or body text for this news item.</p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {description?.trim() || "No description available."}
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <ImageIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">News Image</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Featured image or fallback visual for this news item.</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
                    <img src={coverImage} alt={name || "News"} className="h-72 w-full object-cover" />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <IdCard className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Identity</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unique news reference details.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">News ID</p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">{_id || id || "N/A"}</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <BadgeInfo className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Publication Summary</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Quick status overview for this news entry.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SummaryRow label="Title Status" value={name ? "Available" : "Not Provided"} />
                    <SummaryRow label="Description Status" value={description ? "Available" : "Not Provided"} />
                    <SummaryRow label="Image Status" value={getImageUrl(news) ? "Uploaded" : "Fallback Used"} />
                    <SummaryRow label="Last Updated" value={updatedDate} />
                  </div>
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
  icon: ReactNode;
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

const SummaryRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
};

export default NewsDetails;
