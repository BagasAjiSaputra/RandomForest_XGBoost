"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type FormType = {
  gender: string;
  age: number;
  hypertension: number;
  heartDisease: number;
  everMarried: string;
  workType: string;
  residenceType: string;
  avgGlucose: number;
  bmi: number;
  smokingStatus: string;
};

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);


  const [form, setForm] = useState<FormType>({
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
      method: "random_forest",
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
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchAccuracy = async () => {
    try {
      const res = await fetch("http://localhost:5000/accuracy/random-forest");
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <header>
          <h1 className="text-3xl font-semibold">Stroke Prediction</h1>
          <p className="text-neutral-500 text-sm">
            Random Forest based prediction
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female"]} />
              <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
              <Field label="Hypertension" name="hypertension" value={form.hypertension} onChange={handleChange} options={[0, 1]} />
              <Field label="Heart Disease" name="heartDisease" value={form.heartDisease} onChange={handleChange} options={[0, 1]} />
              <Field label="Ever Married" name="everMarried" value={form.everMarried} onChange={handleChange} options={["Yes", "No"]} />
              <Field label="Work Type" name="workType" value={form.workType} onChange={handleChange} options={["Private", "Self-employed", "Govt_job"]} />
              <Field label="Residence" name="residenceType" value={form.residenceType} onChange={handleChange} options={["Urban", "Rural"]} />
              <Field label="Avg Glucose" name="avgGlucose" type="number" value={form.avgGlucose} onChange={handleChange} />
              <Field label="BMI" name="bmi" type="number" value={form.bmi} onChange={handleChange} />
              <Field
                label="Smoking Status"
                name="smokingStatus"
                value={form.smokingStatus}
                onChange={handleChange}
                options={["never smoked", "formerly smoked", "smokes"]}
                className="col-span-2"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-xl bg-neutral-900 text-white disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>

          {/* RESULT */}
          <div className="bg-white rounded-2xl p-6 shadow">
            {!result ? (
              <p className="text-neutral-400 text-sm">No result yet.</p>
            ) : (
              <>
                <div className="flex justify-between mb-4">
                  <span>Result</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      result.hasil_prediksi === 1
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {result.hasil_prediksi === 1 ? "Stroke Risk" : "Low Risk"}
                  </span>
                </div>

                <pre className="text-xs bg-neutral-100 p-4 rounded-xl overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </>
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

/* ----- reusable field ----- */
function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  className = "",
}: any) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-neutral-500">{label}</label>

      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-xl px-3 py-2 text-sm"
        >
          {options.map((o: any) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-xl px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
