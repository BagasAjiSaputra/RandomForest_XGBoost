"use client";

import { motion } from "framer-motion";

export type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-1.5"
    >
      <label className="text-[11px] uppercase tracking-wide text-neutral-400">
        {label}
      </label>

      <div className="rounded-xl bg-white ring-1 ring-neutral-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-neutral-300">
        <motion.select
          whileTap={{ scale: 0.98 }}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral-800 outline-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={`${name}-${opt.value}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </motion.select>
      </div>
    </motion.div>
  );
}
