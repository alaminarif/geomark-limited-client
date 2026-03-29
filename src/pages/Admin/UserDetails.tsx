import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { motion, cubicBezier } from 'framer-motion';
// If you upgraded to the latest Motion package, use this instead:
// import { motion, cubicBezier } from 'motion/react';

import { useGetSingleUserQuery } from '@/redux/features/user/user.api';
import {
  Mail,
  ShieldCheck,
  CircleUserRound,
  BadgeCheck,
  Activity,
  IdCard,
  ArrowLeft,
  Pencil,
} from 'lucide-react';

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

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleUserQuery(id as string);

  const user = data?.data || data;

  const { _id, picture, name, email, role, isActive } = user || {};

  const displayStatus = String(isActive || 'unknown').toLowerCase();

  const statusStyles = useMemo(() => {
    return displayStatus === 'active'
      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-900'
      : displayStatus === 'blocked'
      ? 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-900'
      : 'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-900';
  }, [displayStatus]);

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-8 md:py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="mb-5 flex flex-wrap items-center justify-between gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Link
            to={`/admin/user/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Pencil className="h-4 w-4" />
            Edit User
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={0.08}
          className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Top Banner */}
          <div className="relative h-48 overflow-hidden bg-linear-to-br from-slate-950 via-blue-900 to-sky-500 md:h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.12),transparent_22%)]" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="relative flex h-full items-start justify-between p-6 md:p-8"
            >
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">
                  User Profile
                </p>
                <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">
                  User Details
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                  A complete overview of the user profile, account role, and current status.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="-mt-16 rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:-mt-20 md:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="shrink-0"
                  >
                    <img
                      src={
                        picture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          name || 'User'
                        )}&background=0f172a&color=ffffff&size=256`
                      }
                      alt={name || 'User'}
                      className="h-28 w-28 rounded-[24px] border-4 border-white object-cover shadow-lg dark:border-slate-800 md:h-32 md:w-32"
                    />
                  </motion.div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                        {name || 'Unnamed User'}
                      </h2>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles}`}
                      >
                        <Activity className="mr-1.5 h-3.5 w-3.5" />
                        {displayStatus}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {email || 'No email available'}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <ShieldCheck className="h-4 w-4" />
                        {role || 'No role assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <StatCard label="Account Role" value={role || 'N/A'} />
                  <StatCard label="Current Status" value={displayStatus} />
                </div>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate="visible"
              className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3"
            >
              <div className="lg:col-span-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <CircleUserRound className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Personal Information
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Basic account and profile information.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                      icon={<BadgeCheck className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Full Name"
                      value={name || 'N/A'}
                    />
                    <InfoCard
                      icon={<Mail className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Email Address"
                      value={email || 'N/A'}
                    />
                    <InfoCard
                      icon={<ShieldCheck className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Role"
                      value={role || 'N/A'}
                      capitalize
                    />
                    <InfoCard
                      icon={<Activity className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Status"
                      value={displayStatus || 'N/A'}
                      capitalize
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <IdCard className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Account Identity
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Unique account reference details.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      User ID
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {_id || id || 'N/A'}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-md"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Profile Summary
                    </p>
                    <h4 className="mt-2 text-lg font-semibold">
                      {name || 'Unnamed User'}
                    </h4>
                    <p className="mt-1 text-sm text-white/75">
                      This account currently holds the{' '}
                      <span className="font-semibold capitalize text-white">
                        {role || 'unknown'}
                      </span>{' '}
                      role and is marked as{' '}
                      <span className="font-semibold capitalize text-white">
                        {displayStatus}
                      </span>.
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
  capitalize?: boolean;
};

const InfoCard = ({ icon, label, value, capitalize = false }: InfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p
            className={`mt-2 break-all text-base font-semibold text-slate-900 dark:text-white ${
              capitalize ? 'capitalize' : ''
            }`}
          >
            {value}
          </p>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-base font-bold capitalize text-slate-900 dark:text-white">
        {value || 'N/A'}
      </p>
    </motion.div>
  );
};

const SkeletonBlock = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800 ${className}`}
    />
  );
};

const UserDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SkeletonBlock className="h-11 w-28 rounded-2xl" />
          <SkeletonBlock className="h-11 w-32 rounded-2xl" />
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
                    <SkeletonBlock className="h-5 w-32 rounded-full" />
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
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                  </div>
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

export default UserDetails;