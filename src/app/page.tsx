"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import teacherSchedules from "./teacher_schedules.json";

// 🏫 واجهة المعلم - مدرسة سمرة بن عمرو الابتدائية
// تصميم فخم وعصري بأسلوب Notion / Google Classroom

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7];
type Day = typeof DAYS[number];

const STORAGE_KEY = "nassabi_weekly_lessons_v4";

const makeKey = (
  field: "title" | "goals" | "homework",
  day: Day,
  period: number,
  classId: string
) => `${field}_${day}_${period}_${classId}`;

const loadFromLS = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const saveToLS = (data: Record<string, string>) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

type CellData = { title?: string; goals?: string; homework?: string };

function BulkEditor({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (data: CellData) => void;
}) {
  const [title, setTitle] = useState("");
  const [goals, setGoals] = useState("");
  const [homework, setHomework] = useState("");

  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          ✏️ تعبئة بيانات الحصة
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              عنوان الدرس
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 p-2 focus:ring-2 focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              أهداف الدرس
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 p-2 focus:ring-2 focus:ring-black"
              rows={3}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              الواجب
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 p-2 focus:ring-2 focus:ring-black"
              rows={2}
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="rounded-xl border px-4 py-2 hover:bg-gray-100"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              className="rounded-xl bg-black px-5 py-2 text-white shadow hover:bg-gray-800"
              onClick={() => onApply({ title, goals, homework })}
            >
              تطبيق
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [teacher, setTeacher] = useState(Object.keys(teacherSchedules)[0]);
  const [store, setStore] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<
    { day: Day; period: number; classId: string }[]
  >([]);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => setStore(loadFromLS()), []);
  useEffect(() => saveToLS(store), [store]);

  // ✅ إصلاح TypeScript indexing
  const schedule = useMemo(
    () => (teacherSchedules as Record<string, any>)[teacher],
    [teacher]
  );

  const toggleSelect = (day: Day, period: number, classId: string) => {
    const isEmpty =
      !classId || classId === "—" || classId === "-" || classId === "";
    if (isEmpty) return; // 🚫 تجاهل الحصص الفارغة

    setSelected((prev) => {
      const exists = prev.find(
        (x) => x.day === day && x.period === period && x.classId === classId
      );
      if (exists)
        return prev.filter(
          (x) => !(x.day === day && x.period === period && x.classId === classId)
        );
      return [...prev, { day, period, classId }];
    });
  };

  const applyBulk = (payload: CellData) => {
    const next = { ...store };
    for (const cell of selected) {
      next[makeKey("title", cell.day, cell.period, cell.classId)] =
        payload.title || "";
      next[makeKey("goals", cell.day, cell.period, cell.classId)] =
        payload.goals || "";
      next[makeKey("homework", cell.day, cell.period, cell.classId)] =
        payload.homework || "";
    }
    setStore(next);
    setSelected([]);
    setEditorOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 font-[Tajawal]"
      dir="rtl"
    >
      {/* 🏫 شريط علوي */}
      <header className="mb-6 rounded-3xl bg-white/80 p-5 text-center shadow-sm backdrop-blur">
        <h1 className="text-2xl font-extrabold text-gray-900">
          🏫 مدرسة سمرة بن عمرو الابتدائية
        </h1>
        <p className="text-gray-600">📘 واجهة المعلم — الخطة الأسبوعية</p>
      </header>

      <div className="mx-auto max-w-7xl">
        {/* 🔹 شريط التحكم */}
        <div className="mb-5 flex flex-col justify-between gap-3 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur md:flex-row md:items-center">
          <h2 className="text-lg font-bold text-gray-700">اختر اسم المعلم:</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            >
              {Object.keys(teacherSchedules).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setStore({});
                saveToLS({});
              }}
            >
              🗑️ مسح البيانات
            </button>
            <button
              disabled={!selected.length}
              onClick={() => setEditorOpen(true)}
              className={`rounded-2xl px-5 py-2 text-sm font-semibold shadow transition ${
                selected.length
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              ✏️ تعبئة ({selected.length})
            </button>
          </div>
        </div>

        {/* 📅 الجدول */}
        <div className="overflow-x-auto rounded-3xl bg-white p-3 shadow-sm">
          <table className="w-full border-separate border-spacing-2 text-sm">
            <thead>
              <tr>
                <th className="w-24 text-right text-gray-600">اليوم</th>
                {PERIODS.map((p) => (
                  <th
                    key={p}
                    className="min-w-[120px] text-center text-gray-600"
                  >
                    حصة {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d, di) => (
                <tr
                  key={d}
                  className={di % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="whitespace-nowrap text-right font-medium text-gray-800">
                    {d}
                  </td>
                  {PERIODS.map((p) => {
                    const classId = schedule?.[d]?.[p];
                    const isEmpty =
                      !classId ||
                      classId === "—" ||
                      classId === "-" ||
                      classId === "";
                    const selectedCell = selected.some(
                      (x) =>
                        x.day === d &&
                        x.period === p &&
                        x.classId === classId
                    );
                    const title =
                      store[makeKey("title", d, p, classId || "")] || "";

                    return (
                      <td key={`${d}-${p}`}>
                        {isEmpty ? (
                          <div className="h-24 w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 opacity-50"></div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleSelect(d, p, classId)}
                            className={`h-24 w-full rounded-2xl border p-2 text-right transition-all ${
                              selectedCell
                                ? "border-black ring-2 ring-black"
                                : "border-gray-200 hover:border-gray-400"
                            } ${title ? "bg-blue-50" : "bg-gray-100"}`}
                          >
                            <div className="text-xs text-gray-500">
                              {classId}
                            </div>
                            <div className="mt-1 line-clamp-2 text-sm font-semibold text-gray-800">
                              {title || "—"}
                            </div>
                          </motion.button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mx-auto mt-6 max-w-3xl text-center text-xs text-gray-500">
          صيغة المفاتيح في ملفات Word: {"{field_day_period_class}"} مثل{" "}
          {"{title_الأحد_1_رابع_أ}"}
        </footer>
      </div>

      {/* ✏️ نافذة التحرير */}
      <BulkEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onApply={applyBulk}
      />

      {/* 📌 الشريط العائم */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 flex items-center gap-3 rounded-3xl bg-black/90 px-5 py-3 text-white shadow-lg backdrop-blur"
          dir="rtl"
        >
          <span className="text-sm">📌 محدد: {selected.length} خلية</span>
          <button
            className="rounded-xl bg-white px-3 py-1 text-sm font-semibold text-black hover:bg-gray-200"
            onClick={() => setSelected([])}
          >
            إلغاء
          </button>
        </motion.div>
      )}
    </div>
  );
}
