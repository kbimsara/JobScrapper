import { getJobById } from "@/lib/api/jobs";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Bookmark, Building, ExternalLink, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let job;
  try {
    const { id } = await params;
    job = await getJobById(id);
  } catch (error) {
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  const postedAgo = job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Unknown date';
  const scrapedAgo = job.scrapedAt ? formatDistanceToNow(new Date(job.scrapedAt), { addSuffix: true }) : 'Recently';

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col h-full gap-6 pb-12">
      <div className="flex items-center text-sm text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <Link href="/">Back to jobs</Link>
      </div>

      <header className="p-6 border border-border bg-surface rounded-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-4">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-secondary">
              <div className="flex items-center text-base text-primary">
                <Building className="w-4 h-4 mr-2 opacity-70" />
                <span className="font-medium">{job.company}</span>
              </div>
              
              {(job.location || job.remote) && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 opacity-70" />
                  <span>
                    {job.location || "Remote"}
                    {job.remote && job.location ? " (Remote)" : ""}
                  </span>
                </div>
              )}
              
              <div className="flex items-center px-2 py-1 border border-border rounded bg-background font-mono text-xs">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                {job.platform}
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-secondary">
              <span>Posted {postedAgo}</span>
              <span className="text-border">•</span>
              <span className="opacity-70">Scraped {scrapedAgo}</span>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
            <a 
              href={job.url}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary px-6 py-2.5 w-full shadow-sm"
            >
              Apply / Open
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <button className="btn btn-secondary px-6 py-2.5 w-full">
              <Bookmark className="w-4 h-4 mr-2" />
              Save Job
            </button>
          </div>
        </div>
      </header>

      {/* Description */}
      <div className="p-6 border border-border bg-background rounded-lg">
        <h2 className="text-lg font-semibold text-primary mb-4 border-b border-border pb-2">
          Job Description
        </h2>
        {job.description && job.description !== "Description not available" ? (
          <div 
            className="prose prose-invert prose-sm sm:prose-base max-w-none text-secondary"
            dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} 
          />
        ) : (
          <p className="text-secondary opacity-70 italic">
            Full description is not available for this job posting.
          </p>
        )}
      </div>

      {/* Details/Metadata (Skills, Requirements) */}
      {(job.skills || job.requirements || job.salary) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(job.skills && job.skills.length > 0) && (
            <div className="p-6 border border-border bg-surface rounded-lg">
              <h2 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(job.skills) 
                  ? job.skills.map((skill: string, i: number) => (
                    <span key={i} className="tag bg-background">{skill}</span>
                  ))
                  : <span className="tag bg-background">{job.skills}</span>
                }
              </div>
            </div>
          )}
          
          {job.salary && (
            <div className="p-6 border border-border bg-surface rounded-lg">
              <h2 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Compensation
              </h2>
              <div className="text-lg font-mono text-accent">
                {job.salary}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
