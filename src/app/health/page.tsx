import { ScraperDashboard } from "@/components/scraper/ScraperDashboard";

export default function HealthPage() {
  return (
    <div className="flex flex-col h-full gap-6 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary">System Health</h1>
        <p className="text-secondary text-sm mt-1">
          Monitor the background scraper and notification system.
        </p>
      </header>
      
      <ScraperDashboard />
    </div>
  );
}
