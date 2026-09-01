const mongoose = require('mongoose');

async function main() {
  const uri = "mongodb://22ug10498_db_user:Hunter12045@ac-ppngmjd-shard-00-00.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-01.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-02.wiongjz.mongodb.net:27017/job-finder?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=jbclaster";
  await mongoose.connect(uri);

  const JobRoleSchema = new mongoose.Schema({
    name: String,
    keywords: [String],
    locations: [String],
    enabled: Boolean
  }, { collection: 'jobroles' });

  const JobRole = mongoose.models.JobRole || mongoose.model('JobRole', JobRoleSchema);
  
  console.log("Updating existing roles...");

  // Update SE
  await JobRole.findOneAndUpdate(
    { name: "SE" },
    { $set: { keywords: ["Software Engineer", "Software Developer", "Backend Developer", "Frontend Developer", "Full Stack Developer", "Programmer", "Web Developer", "App Developer", "SE"] } }
  );

  // Update DevOps
  await JobRole.findOneAndUpdate(
    { name: "DevOps" },
    { $set: { keywords: ["DevOps", "Site Reliability Engineer", "SRE", "Cloud Engineer", "Cloud", "Platform Engineer", "Kubernetes", "Docker", "Terraform", "CI/CD"] } }
  );

  // Update Full stack
  await JobRole.findOneAndUpdate(
    { name: "Full stack" },
    { $set: { keywords: ["Full stack", "Fullstack", "MERN", "MEAN", "Node.js", "Django", "Spring Boot", "Backend"] } }
  );

  // Update Data Scientist
  await JobRole.findOneAndUpdate(
    { name: "Data Scientist" },
    { $set: { keywords: ["Data Scientist", "Machine Learning", "AI", "Data Analyst", "Data Engineer", "Deep Learning", "NLP", "Computer Vision"] } }
  );

  // Update Cloud Architect
  await JobRole.findOneAndUpdate(
    { name: "Cloud Architect" },
    { $set: { keywords: ["Cloud Architect", "Cloud Solutions Architect", "AWS", "Azure", "GCP", "Google Cloud", "Cloud Infrastructure", "Cloud Native"] } }
  );

  // Update QA Engineer
  await JobRole.findOneAndUpdate(
    { name: "QA Engineer" },
    { $set: { keywords: ["QA Engineer", "Quality Assurance", "Software Tester", "Automation Engineer", "Test Engineer", "SDET", "Manual Tester", "Selenium", "Cypress"] } }
  );

  console.log("Adding new roles if they don't exist...");

  // Add Cloud Engineer if it doesn't exist
  const cloudEng = await JobRole.findOne({ name: "Cloud Engineer" });
  if (!cloudEng) {
    await JobRole.create({
      name: "Cloud Engineer",
      keywords: ["Cloud Engineer", "AWS Engineer", "Azure Engineer", "GCP Engineer", "Cloud Ops"],
      locations: ["Sri Lanka", "Remote"],
      enabled: true
    });
  }

  // Add Backend Developer
  const backendDev = await JobRole.findOne({ name: "Backend Developer" });
  if (!backendDev) {
    await JobRole.create({
      name: "Backend Developer",
      keywords: ["Backend Developer", "Backend Engineer", "Java Developer", "Node.js Developer", "Python Developer", "Go Developer", "C# Developer", ".NET Developer", "API Developer"],
      locations: ["Sri Lanka", "Remote"],
      enabled: true
    });
  }

  // Add Cybersecurity / Security Engineer
  const securityEng = await JobRole.findOne({ name: "Security Engineer" });
  if (!securityEng) {
    await JobRole.create({
      name: "Security Engineer",
      keywords: ["Security Engineer", "Cybersecurity", "InfoSec", "Information Security", "Penetration Tester", "Ethical Hacker", "Security Analyst"],
      locations: ["Sri Lanka", "Remote"],
      enabled: true
    });
  }

  console.log("Finished updating roles in database!");
  await mongoose.disconnect();
}

main().catch(console.error);
