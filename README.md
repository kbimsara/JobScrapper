# 🕵️‍♂️ JobScrapper & Intelligence Dashboard

Yo! Welcome to **JobScrapper** — my personal, slightly over-engineered job hunting command center. 🚀 

This is where I keep track of all the jobs my background scrapers are finding for me, manage the roles I actually care about, and hopefully, score that next sweet gig. 

## 🌟 What's this thing do?

It does a lot, actually. Here is the full rundown of all the magic packed inside:

### 💼 The Job Feed
- **Global Search:** Search jobs, skills, or companies. 
- **Mega Filters:** Filter jobs by Platform (LinkedIn, TopJobs), Workplace Type (Remote, Hybrid, On-site), and Region (Sri Lanka vs. Overseas).
- **Tag-based Filtering:** Filter your job feed easily using the keywords extracted from your roles.
- **Sorting Magic:** Sort by Recently Posted, Oldest Posted, or Recently Scraped.
- **Offline Caching:** Fast loading and local storage syncing for jobs.
- **Pagination:** Don't break the browser — smooth navigation through pages of jobs.

### 🎯 Role Management
- **Role Configs:** Keep track of different hats you want to wear.
- **Active & Paused States:** Toggle roles on or off so the scraper knows what you currently care about.
- **Targeting:** Define targeted keywords and locations for each role.

### 🩺 Scraper Health & Dashboard
- **Live Stats:** See active roles, total jobs, alerts sent, and failed alerts at a glance.
- **Health Monitoring:** Overall status (Healthy, Failed, Unknown) with last sync and next scheduled run timings.
- **Error Tracking:** Catches and displays the last scraper error so you know when things break.
- **Manual Sync:** A big "Run Sync Now" button for when you just can't wait for the background cron job.
- **Auto-refresh:** Dashboard stats auto-refresh every 12 seconds.

## 🛠️ Built with the good stuff

- **Next.js** (App Router because we like the future)
- **MongoDB** (Mongoose for when I need some structure in my NoSQL life)
- **Tailwind CSS v4** (Making things look pretty without writing actual CSS)
- **Lucide React** (Shiny icons)
- **SWR** (Data fetching made easy-peasy)

## 🚀 How to fire it up

1. Make sure you got your MongoDB URI set up in a `.env.local` file (there's an `.env.example` hanging around, just copy that).
2. Install the things and start the engine:

```bash
npm install
npm run dev
```

3. Head over to [http://localhost:3000](http://localhost:3000) and behold the magic! ✨

## 📂 Where things live

- `src/app/jobs/` - Where the job magic happens
- `src/app/roles/` - For managing those dream roles
- `src/app/health/` - The scraper ICU
- `src/app/api/` - The backend brains (Next.js API routes)
- `src/components/` - The Lego blocks (UI pieces, etc.)

## 📜 License

It's MIT. Do whatever you want with it, just don't blame me if the bots become sentient. 🤖
