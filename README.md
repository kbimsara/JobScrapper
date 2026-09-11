# Job Intelligence & Scraper

A personal job intelligence application built with Next.js to monitor background scraping jobs, manage job roles, and provide a dashboard for job hunting.

## Features

- **Dashboard**: View jobs, roles, and application statuses.
- **Scraper Health**: Monitor the status of background scrapers in real-time.
- **Job Management**: Review, filter, and organize fetched jobs.
- **Role Management**: Define and track different job roles.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)

## Getting Started

First, ensure you have your MongoDB URI set up in a `.env.local` file (copy from `.env.example` if available).

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/jobs/` - Jobs listing and management pages
- `src/app/roles/` - Roles management pages
- `src/app/health/` - Scraper health and monitoring dashboard
- `src/app/api/` - Next.js API routes handling data and scraper coordination
- `src/components/` - Reusable React components (UI, Navigation, Scraper)

## License

This project is open-source and available under the standard MIT License.
