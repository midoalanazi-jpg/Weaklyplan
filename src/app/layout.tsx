import "./globals.css";

export const metadata = {
  title: "Nassabi — واجهة المعلم",
  description: "أداة إدارة الخطة الأسبوعية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
