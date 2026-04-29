import { FormStyles } from "@/components/ui/FormStyles";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Building2, ChevronDown, CircleDot } from "lucide-react";
import type { ChangeEventHandler, Ref } from "react";

export type ProjectSelectOption = {
  value: string;
  label: string;
};

type ProjectSelectControlProps = {
  name: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  onBlur: () => void;
  inputRef: Ref<HTMLSelectElement>;
  disabled?: boolean;
  options: ProjectSelectOption[];
  placeholder: string;
  variant: "service" | "status" | "client";
};

const iconClassName =
  "pointer-events-none absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg border";

const variantStyles = {
  service: {
    icon: BriefcaseBusiness,
    className: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
  },
  status: {
    icon: CircleDot,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  client: {
    icon: Building2,
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  },
};

const optionClassName = "bg-white w-30! border border-red-500! text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white";

export const ProjectSelectControl = ({
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  disabled,
  options,
  placeholder,
  variant,
}: ProjectSelectControlProps) => {
  const Icon = variantStyles[variant].icon;

  return (
    <div className="relative min-w-0">
      <span className={cn(iconClassName, variantStyles[variant].className)}>
        <Icon className="size-4" />
      </span>

      <select
        ref={inputRef}
        name={name}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          FormStyles.selectTrigger,
          "h-12 appearance-none truncate pl-12 pr-11 font-medium shadow-sm transition-colors hover:border-violet-400 focus:border-violet-400 disabled:opacity-70 ",
        )}
      >
        <option value="" disabled className={optionClassName}>
          {placeholder}
        </option>
        {options.map((item) => (
          <option key={item.value} value={item.value} className={optionClassName}>
            {item.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
    </div>
  );
};
