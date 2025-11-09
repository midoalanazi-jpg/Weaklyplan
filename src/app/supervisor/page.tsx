"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // ✅ أضفنا هذا
import supervisorDataFile from "../supervisor_data.json";
import teacherSchedules from "../teacher_schedules.json";

export default function SupervisorPage() {
  const router = useRouter(); // ✅ لاستخدام التنقل بين الصفحات

  const [data, setData] = useState({
    week_number: "",
    start_date_hijri: "",
    end_date_hijri: "",
    student_activity: "",
    student_guidance: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("supervisor_data");
    if (stored) setData(JSON.parse(stored));
    else setData(supervisorDataFile);
  }, []);

  const handleChange = (key: keyof typeof data, value: string) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    localStorage.setItem("supervisor_data", JSON.stringify(newData));
  };

  const handleExport = () => {
    alert("📄 سيتم لاحقاً تصدير الخطة إلى ملف Word بناءً على القالب الخاص بك");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 font-[Tajawal]"
    >
      {/* ✅ الترويسة */}
      <header className="relative text-center py-6 bg-white/80 shadow-sm backdrop-blur rounded-b-3xl border-b border-gray-200">
        {/* زر التنقل إلى واجهة المعلم */}
        <button
          onClick={() => router.push("/teacher")}
          className="absolute top-4 left-5 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:opacity-90 transition"
        >
          🧑‍🏫 إلى واجهة المعلم
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800">
          🏫 مدرسة سمرة بن عمرو الابتدائية
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          📘 واجهة المشرف — إدارة الخطة الأسبوعية
        </p>
      </header>

      {/* ✅ المحتوى */}
      <main className="max-w-4xl mx-auto p-6">
        {/* بيانات الأسبوع */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 p-6 rounded-3xl shadow mb-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🗓️ بيانات الأسبوع الدراسي
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                رقم الأسبوع
              </label>
              <input
                type="number"
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-sky-500"
                value={data.week_number}
                onChange={(e) => handleChange("week_number", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                تاريخ البداية (هجري)
              </label>
              <input
                type="text"
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-sky-500"
                placeholder="٢ / ٦ / ١٤٤٧هـ"
                value={data.start_date_hijri}
                onChange={(e) =>
                  handleChange("start_date_hijri", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                تاريخ النهاية (هجري)
              </label>
              <input
                type="text"
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-sky-500"
                placeholder="٦ / ٦ / ١٤٤٧هـ"
                value={data.end_date_hijri}
                onChange={(e) =>
                  handleChange("end_date_hijri", e.target.value)
                }
              />
            </div>
          </div>
        </motion.section>

        {/* النشاط والتوجيه */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 p-6 rounded-3xl shadow mb-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🧩 النشاط والتوجيه الطلابي
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                النشاط الطلابي
              </label>
              <textarea
                rows={4}
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-sky-500"
                placeholder="أدخل النشاطات أو الفعاليات المقترحة..."
                value={data.student_activity}
                onChange={(e) =>
                  handleChange("student_activity", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                التوجيه الطلابي
              </label>
              <textarea
                rows={4}
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-sky-500"
                placeholder="أدخل التعليمات أو التوجيهات العامة..."
                value={data.student_guidance}
                onChange={(e) =>
                  handleChange("student_guidance", e.target.value)
                }
              />
            </div>
          </div>
        </motion.section>

        {/* الأزرار */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              localStorage.setItem("supervisor_data", JSON.stringify(data));
              alert("✅ تم حفظ البيانات بنجاح!");
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 shadow"
          >
            💾 حفظ البيانات
          </button>

          <button
            onClick={() =>
              alert(
                "👀 سيتم لاحقاً عرض جميع خطط المعلمين المجمعة للطباعة (من teacher_schedules.json)"
              )
            }
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300"
          >
            👁️ عرض خطط المعلمين
          </button>

          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 shadow"
          >
            🖨️ تصدير إلى Word
          </button>
        </div>
      </main>
    </div>
  );
}
