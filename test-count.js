const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://22ug10498_db_user:Hunter12045@ac-ppngmjd-shard-00-00.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-01.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-02.wiongjz.mongodb.net:27017/job-finder?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=jbclaster";
  
  console.log("Testing with pure MongoDB Driver...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("job-finder");
  const rawJobCount = await db.collection('jobposts').countDocuments();
  console.log("Raw jobposts count:", rawJobCount);
  await client.close();

  console.log("Testing with Mongoose...");
  await mongoose.connect(uri);
  
  const JobSchema = new mongoose.Schema({}, { collection: 'jobposts', strict: false });
  // If the model is already compiled, use it, else compile it
  const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
  
  const mongooseJobCount = await Job.countDocuments();
  console.log("Mongoose jobposts count:", mongooseJobCount);
  
  await mongoose.disconnect();
}

main().catch(console.error);
