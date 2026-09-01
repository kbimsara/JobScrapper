import { JobFeed } from "@/components/jobs/JobFeed";
import { Suspense } from "react";
import { SkeletonJobRow } from "@/components/jobs/SkeletonJobRow";

export default function Home() {
  return (
    <div className="flex flex-col h-full gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Job Feed</h1>
        <p className="text-secondary text-sm mt-1">
          Browse and search recently scraped job listings.
        </p>
      </header>
      
      {/* SWR inside JobFeed handles data fetching, but it needs Suspense if we want to use search params hook in client component.
          Actually, useSearchParams inside JobFeed will suspend the route on the server unless wrapped in a Suspense boundary.
      */}
      <Suspense fallback={<div className="flex flex-col gap-4">{Array.from({length: 5}).map((_, i) => <SkeletonJobRow key={i} />)}</div>}>
        <JobFeed />
      </Suspense>
    </div>
  );
}
