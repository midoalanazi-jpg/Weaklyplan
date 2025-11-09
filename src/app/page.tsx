"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-blue-100 font-[Tajawal]"
      dir="rtl"
    >
      <div className="bg-white shadow-lg rounded-3xl p-8 text-center w-[90%] max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🎓  مرحبا أعضاء سمرة— اختر الواجهة
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/teacher")}
            className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:opacity-90 transition"
          >
            🧑‍🏫 واجهة المعلم
          </button>

          <button
            onClick={() => router.push("/supervisor")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:opacity-90 transition"
          >
            🧑‍💼 واجهة المشرف
          </button>
        </div>
      </div>
    </div>
  );
}
