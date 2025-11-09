"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // ✅ أضفنا الاستيراد هنا
import teacherSchedules from "../teacher_schedules.json";

const DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7] as const;
type Day = typeof DAYS[number];

const TEACHERS = Object.keys(teacherSchedules);
const teacherSchedulesTyped = teacherSchedules as Record<string, any>;

const makeKey = (
  field: "title" | "goals" | "homework",
  day: Day,
  period: number,
  classId: string
) => `${field}_${day}_${period}_${classId}`;

const STORAGE_KEY = "nassabi_weekly_lessons_v4";

const loadFromLS = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};
const saveToLS = (data: any) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export default function App() {
  const router = useRouter(); // ✅ مضاف هنا

  const [teacher, setTeacher] = useState(TEACHERS[0]);
  const [store, setStore] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<
    { day: Day; period: number; classId: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [editCell, setEditCell] = useState<{
    day: Day;
    period: number;
    classId: string;
  } | null>(null);
  const [inputs, setInputs] = useState({ title: "", goals: "", homework: "" });

  useEffect(() => setStore(loadFromLS()), []);
  useEffect(() => saveToLS(store), [store]);

  const schedule = useMemo(
    () => teacherSchedulesTyped?.[teacher] ?? {},
    [teacher]
  );

  const toggleSelect = (day: Day, period: number, classId: string) => {
    if (!classId || classId === "—" || classId === "" || classId === null) return;
    setSelected((prev) =>
      prev.some(
        (x) => x.day === day && x.period === period && x.classId === classId
      )
        ? prev.filter(
            (x) => !(x.day === day && x.period === period && x.classId === classId)
          )
        : [...prev, { day, period, classId }]
    );
  };

  const openEdit = (day: Day, period: number, classId: string) => {
    const title = store[makeKey("title", day, period, classId)] || "";
    const goals = store[makeKey("goals", day, period, classId)] || "";
    const homework = store[makeKey("homework", day, period, classId)] || "";
    setInputs({ title, goals, homework });
    setEditCell({ day, period, classId });
    setShowModal(true);
  };

  const applyBulk = () => {
    const next = { ...store };
    for (const cell of selected) {
      next[makeKey("title", cell.day, cell.period, cell.classId)] = inputs.title;
      next[makeKey("goals", cell.day, cell.period, cell.classId)] = inputs.goals;
      next[makeKey("homework", cell.day, cell.period, cell.classId)] =
        inputs.homework;
    }
    setStore(next);
    setSelected([]);
    setShowModal(false);
    setInputs({ title: "", goals: "", homework: "" });
  };

  const applyEdit = () => {
    if (!editCell) return;
    const next = { ...store };
    next[makeKey("title", editCell.day, editCell.period, editCell.classId)] =
      inputs.title;
    next[makeKey("goals", editCell.day, editCell.period, editCell.classId)] =
      inputs.goals;
    next[makeKey("homework", editCell.day, editCell.period, editCell.classId)] =
      inputs.homework;
    setStore(next);
    setEditCell(null);
    setShowModal(false);
    setInputs({ title: "", goals: "", homework: "" });
  };

  const handleSend = () => {
    const data = JSON.stringify(store, null, 2);
    alert("📤 تم إرسال البيانات بنجاح (محلياً)\n\n" + data);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 font-[Tajawal]"
      dir="rtl"
    >
      {/* ✅ الترويسة */}
      <header className="relative text-center py-6 bg-white/80 shadow-sm backdrop-blur rounded-b-3xl border-b border-gray-200">
        {/* ✅ زر التنقل */}
        <button
          onClick={() => router.push("/supervisor")}
          className="absolute top-4 left-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm shadow hover:opacity-90 transition"
        >
          🧑‍💼 إلى واجهة المشرف
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 flex justify-center items-center gap-2">
          🏫 مدرسة سمرة بن عمرو الابتدائية
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          📘 واجهة المعلم — الخطة الأسبوعية
        </p>
      </header>

      {/* ✅ الأدوات */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center bg-white/90 rounded-3xl shadow p-4 mb-6 border border-gray-100">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              اختر اسم المعلم:
            </label>
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="rounded-2xl border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-sky-500"
            >
              {TEACHERS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStore({});
                saveToLS({});
              }}
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              🗑️ مسح البيانات
            </button>

            <button
              onClick={handleSend}
              className="rounded-2xl bg-green-600 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-green-700 transition"
            >
              📤 إرسال البيانات
            </button>

            <button
              disabled={!selected.length}
              onClick={() => setShowModal(true)}
              className={`rounded-2xl px-5 py-2 text-sm font-semibold shadow transition ${
                selected.length
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:opacity-90"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              ✏️ تعبئة ({selected.length})
            </button>
          </div>
        </div>

        {/* ✅ الجدول */}
        <div className="overflow-x-auto bg-white/80 rounded-3xl shadow p-4 border border-gray-100">
          <table className="w-full text-center border-separate border-spacing-2">
            <thead>
              <tr className="text-gray-600">
                <th className="w-24">اليوم</th>
                {PERIODS.map((p) => (
                  <th key={p}>{p} حصة</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d, di) => (
                <tr key={d} className={di % 2 === 0 ? "bg-sky-50/60" : "bg-white"}>
                  <td className="font-extrabold text-gray-800 text-lg px-3">{d}</td>
                  {PERIODS.map((p) => {
                    const classId = schedule?.[d]?.[p] ?? "—";
                    const isEmpty =
                      !classId || classId === "—" || classId === "" || classId === null;
                    const selectedCell = selected.some(
                      (x) => x.day === d && x.period === p && x.classId === classId
                    );
                    const title = store[makeKey("title", d, p, classId)] || "";

                    return (
                      <td key={`${d}-${p}`}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`relative h-24 w-full rounded-2xl p-2 border transition-all ${
                            isEmpty
                              ? "bg-gray-100 border-gray-200 opacity-50"
                              : selectedCell
                              ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                              : "bg-white hover:bg-sky-50 border-gray-200"
                          }`}
                        >
                          <div
                            onClick={() => toggleSelect(d, p, classId)}
                            className="cursor-pointer h-full flex flex-col justify-center"
                          >
                            <div className="text-base font-bold text-blue-700">
                              {classId || "—"}
                            </div>
                            <div className="font-medium text-gray-700 line-clamp-2 text-sm">
                              {title || "—"}
                            </div>
                          </div>

                          {!isEmpty && title && (
                            <button
                              onClick={() => openEdit(d, p, classId)}
                              className="absolute bottom-1 left-1 text-xs bg-yellow-400 text-white px-2 py-1 rounded-full hover:bg-yellow-500 transition"
                            >
                              ✏️ تعديل
                            </button>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 text-center mt-5">
          🔑 صيغة المفاتيح في ملفات Word: {"{field_day_period_class}"} مثل{" "}
          {"{title_الأحد_1_رابع_أ}"}
        </p>
      </main>

      {/* ✅ المودال */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                ✏️ {editCell ? "تعديل بيانات الحصة" : "تعبئة بيانات الحصة"}
              </h2>
              <div className="grid gap-4">
                <input
                  placeholder="عنوان الدرس"
                  value={inputs.title}
                  onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
                  className="border p-2 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
                <textarea
                  placeholder="أهداف الدرس"
                  value={inputs.goals}
                  onChange={(e) => setInputs({ ...inputs, goals: e.target.value })}
                  className="border p-2 rounded-xl focus:ring-2 focus:ring-sky-500"
                  rows={3}
                />
                <textarea
                  placeholder="الواجب"
                  value={inputs.homework}
                  onChange={(e) =>
                    setInputs({ ...inputs, homework: e.target.value })
                  }
                  className="border p-2 rounded-xl focus:ring-2 focus:ring-sky-500"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditCell(null);
                    setInputs({ title: "", goals: "", homework: "" });
                  }}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={editCell ? applyEdit : applyBulk}
                  className="px-5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:opacity-90"
                >
                  {editCell ? "حفظ التعديل" : "تطبيق"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
