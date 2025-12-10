"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SelectField from "@/app/components/Select";

/* ================= TYPES ================= */

type FormType = {
  id: string;
  gender: string;
  age: number;
  hypertension: number;
  heart_disease: number;
  ever_married: string;
  work_type: string;
  Residence_type: string;
  avg_glucose_level: number;
  bmi: number;
  smoking_status: string;
  stroke?: number;
};

type PredictionResult = {
  hasil_prediksi: number;
  model?: string;
};

/* ================= CONFIG ================= */

const selectFields = [
  {
    label: "Gender",
    name: "gender",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    label: "Hypertension",
    name: "hypertension",
    options: [
      { label: "No", value: 0 },
      { label: "Yes", value: 1 },
    ],
  },
  {
    label: "Heart Disease",
    name: "heart_disease",
    options: [
      { label: "No", value: 0 },
      { label: "Yes", value: 1 },
    ],
  },
  {
    label: "Ever Married",
    name: "ever_married",
    options: [
      { label: "No", value: "No" },
      { label: "Yes", value: "Yes" },
    ],
  },
  {
    label: "Work Type",
    name: "work_type",
    options: [
      { label: "Children", value: "children" },
      { label: "Government", value: "Govt_job" },
      { label: "Never Worked", value: "Never_worked" },
      { label: "Private", value: "Private" },
      { label: "Self-employed", value: "Self-employed" },
    ],
  },
  {
    label: "Residence Type",
    name: "Residence_type",
    options: [
      { label: "Urban", value: "Urban" },
      { label: "Rural", value: "Rural" },
    ],
  },
  {
    label: "Smoking Status",
    name: "smoking_status",
    colSpan: "sm:col-span-2",
    options: [
      { label: "Never smoked", value: "never smoked" },
      { label: "Formerly smoked", value: "formerly smoked" },
      { label: "Smokes", value: "smokes" },
      { label: "Unknown", value: "Unknown" },
    ],
  },
];

/* ================= PAGE ================= */

export default function PredictStrokePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [form, setForm] = useState<FormType>({
    id: "9999",
    gender: "Male",
    age: 30,
    hypertension: 0,
    heart_disease: 0,
    ever_married: "No",
    work_type: "Private",
    Residence_type: "Urban",
    avg_glucose_level: 100,
    bmi: 20.8,
    smoking_status: "never smoked",
  });

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Failed to connect backend");
    } finally {
      setLoading(false);
    }
  };


  // Fetch accuracy for Random Forest
  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const res = await fetch("http://localhost:5000/accuracy/random-forest");
        const data = await res.json();
        if (data.status) setAccuracy(data.accuracy);
      } catch (err) {
        console.error("Failed to load accuracy", err);
      }
    };
    fetchAccuracy();
  }, []);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 md:px-6 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl"
      >
        {/* Header */}
        <div className="mb-10 space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
            Stroke Prediction
          </h1>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>Model: Random Forest</span>
            {accuracy !== null && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
                Accuracy {(accuracy * 100).toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form */}
          <motion.div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <h2 className="mb-5 font-medium text-neutral-800">
              Patient Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {selectFields.map((field) => (
                <div key={field.name} className={field.colSpan ?? ""}>
                  <SelectField
                    label={field.label}
                    name={field.name}
                    value={(form as any)[field.name]}
                    options={field.options}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {[
                { label: "Age", name: "age", step: 1 },
                { label: "Avg Glucose Level", name: "avg_glucose_level", step: 0.01 },
                { label: "BMI", name: "bmi", step: 0.1 },
              ].map((input) => (
                <div key={input.name} className="flex flex-col gap-1">
                  <label className="text-xs text-neutral-500">{input.label}</label>
                  <input
                    type="number"
                    step={input.step}
                    name={input.name}
                    value={(form as any)[input.name]}
                    onChange={handleChange}
                    className="rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-neutral-900 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </motion.div>

          {/* Result */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <h2 className="mb-4 font-medium text-neutral-800">
              Prediction Result
            </h2>

            {result === null ? (
              <p className="text-sm text-neutral-400">
                Result will appear after prediction.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Model</span>
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                    {result.model || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Prediction</span>
                  <span
                    className={`rounded-full px-4 py-1 text-sm font-medium ${result.hasil_prediksi === 1
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                      }`}
                  >
                    {result.hasil_prediksi === 1 ? "Stroke Risk" : "Low Risk"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}