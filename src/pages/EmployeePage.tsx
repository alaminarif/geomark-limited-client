/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import Loading from "@/components/layout/Loading";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import { motion, type Variants } from "framer-motion";
import { Facebook, Linkedin } from "lucide-react";
import { useSearchParams } from "react-router";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const getBaseDesignation = (value: string) => {
  const trimmedValue = value.trim();
  const normalizedDesignation = trimmedValue.replace(/^(senior|junior)\s+/i, "").trim();

  return normalizedDesignation || trimmedValue;
};

const getDesignationKey = (value: string) => normalizeText(getBaseDesignation(value));
const EMPTY_EMPLOYEES: any[] = [];

const EmployeePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDesignation = searchParams.get("designation") || "all";

  const { data, isLoading, isFetching } = useGetAllEmployeesQuery({
    sort: "rank",
    limit: "1000",
  });

  const allEmployees = data?.data ?? EMPTY_EMPLOYEES;

  const designationOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: { label: string; value: string }[] = [];

    for (const employee of allEmployees) {
      const designation = employee?.designation?.trim?.();
      const baseDesignation = designation ? getBaseDesignation(designation) : "";
      const designationKey = designation ? getDesignationKey(designation) : "";

      if (baseDesignation && designationKey && !seen.has(designationKey)) {
        seen.add(designationKey);
        options.push({
          label: baseDesignation,
          value: baseDesignation,
        });
      }
    }

    return [{ label: "All Employees", value: "all" }, ...options];
  }, [allEmployees]);

  const employees = useMemo(() => {
    if (selectedDesignation === "all") return allEmployees;

    return allEmployees.filter((employee: any) => {
      const designation = employee?.designation?.trim?.();
      if (!designation) return false;

      return getDesignationKey(designation) === getDesignationKey(selectedDesignation);
    });
  }, [allEmployees, selectedDesignation]);

  const handleDesignationChange = (designation: string) => {
    const params = new URLSearchParams(searchParams);

    if (designation === "all") {
      params.delete("designation");
    } else {
      params.set("designation", designation);
    }

    setSearchParams(params);
  };

  if (isLoading) return <Loading />;

  return (
    <section className="container mx-auto">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-border/50 bg-accent/30 p-5 shadow-sm backdrop-blur-sm">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground">Filter by Designation</h3>
                <p className="mt-1 text-sm text-muted-foreground">Designations are ordered by employee rank.</p>
              </div>

              <div className="space-y-3">
                {designationOptions.map((item) => {
                  const isActive =
                    item.value === "all" ? selectedDesignation === "all" : getDesignationKey(selectedDesignation) === getDesignationKey(item.value);

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleDesignationChange(item.value)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "border-transparent bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "border-border bg-background text-foreground hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground">
                {isFetching ? "Refreshing employees..." : `${employees.length} member(s) found`}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            {employees.length === 0 ? (
              <div className="flex min-h-75 items-center justify-center rounded-3xl border border-dashed border-border bg-background/60 p-8 text-center">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">No employee found</h4>
                  <p className="mt-2 text-sm text-muted-foreground">There is no employee under this designation right now.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {isFetching && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-background/50 backdrop-blur-[1px]">
                    <p className="text-sm text-muted-foreground">Refreshing...</p>
                  </div>
                )}

                <motion.div
                  key={selectedDesignation}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-8"
                >
                  {employees.map((member: any) => {
                    const hasLinkedin = Boolean(member?.linkedin?.trim?.());
                    const hasFacebook = Boolean(member?.facebook?.trim?.());

                    return (
                      <motion.div
                        key={member?._id || member?.id || member?.email || member?.name}
                        variants={cardVariants}
                        whileHover={{
                          y: -8,
                          scale: 1.02,
                          transition: { duration: 0.25 },
                        }}
                        className="group flex flex-col items-center"
                      >
                        <div className="relative my-4 w-full max-w-75 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                          <div className="aspect-5/6 w-full overflow-hidden">
                            <img
                              src={member?.picture || "/placeholder-user.jpg"}
                              alt={member?.name || "Employee"}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          {(hasLinkedin || hasFacebook) && (
                            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-3">
                              {hasLinkedin && (
                                <motion.a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ y: -4, scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                  className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 p-2 text-white shadow"
                                  aria-label={`${member?.name} LinkedIn`}
                                >
                                  <Linkedin className="size-5" />
                                </motion.a>
                              )}

                              {hasFacebook && (
                                <motion.a
                                  href={member.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ y: -4, scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                  className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 p-2 text-white shadow"
                                  aria-label={`${member?.name} Facebook`}
                                >
                                  <Facebook className="size-5" />
                                </motion.a>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-center text-base font-semibold text-foreground/90">{member?.name}</p>
                        <p className="mb-3 text-center text-sm text-foreground/70">{member?.designation}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeePage;
