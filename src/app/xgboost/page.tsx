"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PredictXGBoostPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [form, setForm] = useState({
    gender: "Male",
    age: 67,
    hypertension: 0,
    heartDisease: 1,
    everMarried: "Yes",
    workType: "Private",
    residenceType: "Urban",
    avgGlucose: 228.69,
    bmi: 36.6,
    smokingStatus: "formerly smoked",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      method: "xgboost",
      fitur: [
        form.gender,
        Number(form.age),
        Number(form.hypertension),
        Number(form.heartDisease),
        form.everMarried,
        form.workType,
        form.residenceType,
        Number(form.avgGlucose),
        Number(form.bmi),
        form.smokingStatus,
      ],
    };

    try {
      const res = await fetch("http://localhost:5000/xgboost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setResult(await res.json());
    } catch {
      alert("Gagal connect ke backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchAccuracy = async () => {
    try {
      const res = await fetch("http://localhost:5000/accuracy/xgboost");
      const data = await res.json();

      if (data.status) {
        setAccuracy(data.accuracy);
      }
    } catch (err) {
      console.error("Failed to load accuracy");
    }
  };

  fetchAccuracy();
}, []);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            Stroke Prediction
          </h1>
          <p className="text-neutral-500 mt-2">
            Machine learning prediction using{" "}
            <span className="font-medium">XGBoost</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
          >
            <h2 className="font-medium text-neutral-800 mb-5">
              Patient Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {select("Gender", "gender", form.gender, handleChange, ["Male", "Female"])}
              {number("Age", "age", form.age, handleChange)}
              {select("Hypertension", "hypertension", form.hypertension, handleChange, [0, 1], ["No", "Yes"])}
              {select("Heart Disease", "heartDisease", form.heartDisease, handleChange, [0, 1], ["No", "Yes"])}
              {select("Ever Married", "everMarried", form.everMarried, handleChange, ["Yes", "No"])}
              {select("Work Type", "workType", form.workType, handleChange, ["Private", "Self-employed", "Govt_job"])}
              {select("Residence", "residenceType", form.residenceType, handleChange, ["Urban", "Rural"])}
              {number("Avg Glucose", "avgGlucose", form.avgGlucose, handleChange)}
              {number("BMI", "bmi", form.bmi, handleChange)}
              {select(
                "Smoking Status",
                "smokingStatus",
                form.smokingStatus,
                handleChange,
                ["never smoked", "formerly smoked", "smokes"],
                "col-span-2"
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict with XGBoost"}
            </button>
          </motion.div>

          {/* RESULT */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <h2 className="font-medium text-neutral-800 mb-4">
              Prediction Result
            </h2>

            {!result ? (
              <p className="text-neutral-400 text-sm">
                Result will appear here after prediction.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Prediction</span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      result.hasil_prediksi === 1
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {result.hasil_prediksi === 1 ? "Stroke Risk" : "Low Risk"}
                  </span>
                </div>

                <div className="bg-neutral-100 rounded-xl p-4 text-xs overflow-auto">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

            <h1 className="text-3xl font-semibold">Stroke Prediction</h1>

  <div className="flex items-center gap-3 text-sm text-neutral-500">
    <span>Model: Random Forest</span>

    {accuracy !== null && (
      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
        Accuracy {(accuracy * 100).toFixed(2)}%
      </span>
    )}
  </div>
  
    </div>
  );
}

/* ===== helpers ===== */

function number(label: string, name: string, value: any, onChange: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-neutral-500">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
      />
    </div>
  );
}

function select(
  label: string,
  name: string,
  value: any,
  onChange: any,
  options: any[],
  labels?: string[],
  extraClass = ""
) {
  return (
    <div className={`flex flex-col gap-1 ${extraClass}`}>
      <label className="text-xs text-neutral-500">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
      >
        {options.map((o, i) => (
          <option key={o} value={o}>
            {labels ? labels[i] : o}
          </option>
        ))}
      </select>
    </div>
  );
}
