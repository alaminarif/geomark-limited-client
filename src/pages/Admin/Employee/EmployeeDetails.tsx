import { useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, cubicBezier } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CalendarDays,
  CircleUserRound,
  IdCard,
  Link as LinkIcon,
  Facebook,
  Linkedin,
  Twitter,
  UserRound,
} from "lucide-react";

import { useGetSingleEmployeeQuery } from "@/redux/features/employee/employee.api";
import { SkeletonEmployeeDetails } from "@/components/modules/Admin/Employee/SkeletonEmployeeDetails";

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

const getSafeUrl = (url?: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const formatDateValue = (value?: string | Date) => {
  if (!value) return "N/A";

  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return format(parsed, "PPP");
};

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleEmployeeQuery(id as string);

  const employee = data?.data?.data || {};

  const { _id, picture, name, email, phone, designation, rank, address, institute, education, facebook, linkedin, twitter, joinDate } = employee;

  const profileImage = useMemo(() => {
    return picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Employee")}&background=0f172a&color=ffffff&size=256`;
  }, [picture, name]);

  const formattedJoinDate = useMemo(() => formatDateValue(joinDate), [joinDate]);

  const socialLinks = useMemo(() => {
    return [
      {
        label: "Facebook",
        value: facebook,
        url: getSafeUrl(facebook),
        icon: <Facebook className="h-4 w-4" />,
      },
      {
        label: "LinkedIn",
        value: linkedin,
        url: getSafeUrl(linkedin),
        icon: <Linkedin className="h-4 w-4" />,
      },
      {
        label: "Twitter",
        value: twitter,
        url: getSafeUrl(twitter),
        icon: <Twitter className="h-4 w-4" />,
      },
    ];
  }, [facebook, linkedin, twitter]);

  if (isLoading) {
    return <SkeletonEmployeeDetails />;
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
            to={`/admin/employee/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
          >
            <Pencil className="h-4 w-4" />
            Edit Employee
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
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">Employee Profile</p>
                <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">Employee Details</h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                  A complete overview of employee profile, professional details and social information.
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
                      src={profileImage}
                      alt={name || "Employee"}
                      className="h-28 w-28 rounded-[24px] border-4 border-white object-cover shadow-lg dark:border-slate-800 md:h-32 md:w-32"
                    />
                  </motion.div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{name || "Unnamed Employee"}</h2>

                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-400">
                        <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                        {designation || "No designation"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {email || "No email available"}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <CalendarDays className="h-4 w-4" />
                        Joined {formattedJoinDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <StatCard label="Designation" value={designation || "N/A"} />
                  <StatCard label="Join Date" value={formattedJoinDate} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.15} initial="hidden" animate="visible" className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <CircleUserRound className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Basic employee identity and contact details.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={<UserRound className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="Full Name" value={name || "N/A"} />
                    <InfoCard icon={<Mail className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="Email Address" value={email || "N/A"} />
                    <InfoCard icon={<Phone className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="Phone" value={phone || "N/A"} />
                    <InfoCard icon={<MapPin className="h-5 w-5 text-slate-700 dark:text-slate-200" />} label="Address" value={address || "N/A"} />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Professional Information</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Role, education and joining details.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                      icon={<Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Designation"
                      value={designation || "N/A"}
                    />
                     <InfoCard
                      icon={<Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Designation"
                      value={rank || "N/A"}
                    />
                    <InfoCard
                      icon={<CalendarDays className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Join Date"
                      value={formattedJoinDate}
                    />
                    <InfoCard
                      icon={<GraduationCap className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Institute"
                      value={institute || "N/A"}
                    />
                    <InfoCard
                      icon={<GraduationCap className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                      label="Education"
                      value={education || "N/A"}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <LinkIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Profiles</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Public profile links and social presence.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {socialLinks.map((item) => (
                      <SocialCard key={item.label} icon={item.icon} label={item.label} value={item.value || "N/A"} url={item.url} />
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                      <IdCard className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Identity</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unique employee reference details.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Employee ID</p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-800 dark:text-slate-200">{_id || id || "N/A"}</p>
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

const SocialCard = ({ icon, label, value, url }: { icon: ReactNode; label: string; value: string; url?: string }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">{icon}</div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>

          {url && value !== "N/A" ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block break-all text-sm font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {value}
            </a>
          ) : (
            <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
          )}
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

export default EmployeeDetails;
