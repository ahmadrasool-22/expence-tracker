import "./globals.css";

export const metadata = {
  title: "CampusCare | Maintenance Portal",
  description: "Campus Maintenance Complaint Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}