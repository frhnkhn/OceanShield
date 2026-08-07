import ReportForm from "@/components/report/ReportForm";
import Navbar from "@/components/layout/Navbar";

export default function ReportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <ReportForm />
      </main>
    </>
  );
}
