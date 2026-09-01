import { RolesManager } from "@/components/roles/RolesManager";

export default function RolesPage() {
  return (
    <div className="flex flex-col h-full gap-6 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Saved Roles</h1>
        <p className="text-secondary text-sm mt-1">
          Manage the roles and keywords you want the scraper to monitor.
        </p>
      </header>
      
      <RolesManager />
    </div>
  );
}
