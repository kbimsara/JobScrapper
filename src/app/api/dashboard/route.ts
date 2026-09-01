import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectToDatabase from "@/lib/db/mongoose";
import { Job } from "@/lib/db/models/Job";
import { JobRole } from "@/lib/db/models/JobRole";
import { Notification } from "@/lib/db/models/Notification";

export async function GET() {
  try {
    await connectToDatabase();

    const [activeJobRoles, jobsReceived, notificationsSent, notificationsFailed, latestJob] = await Promise.all([
      JobRole.countDocuments({ enabled: true }),
      Job.countDocuments(),
      Notification.countDocuments({ status: "sent" }),
      Notification.countDocuments({ status: { $ne: "sent" } }),
      Job.findOne().sort({ collectedAt: -1, createdAt: -1 })
    ]);

    const dashboardStats = {
      activeJobRoles,
      jobsReceived,
      notificationsSent,
      notificationsFailed,
      // Default to health 'up' since DB connection works
      systemHealth: { status: "UP", details: { mongodb: { status: "UP" } } }
    };

    let scraperHealth = { status: 'unknown' };
    try {
      const url = `${process.env.API_BASE_URL || 'https://jobfinder-5af78f88caff.herokuapp.com'}/api/v1/dashboard`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${process.env.SERVICE_API_KEY}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        scraperHealth = data.data?.scraperHealth || data.scraperHealth || { status: 'unknown' };
      }
    } catch (e) {
      console.error("Failed to fetch scraper health from API", e);
    }

    return NextResponse.json({
      stats: dashboardStats,
      scraperHealth
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
