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
  
  const roles = await JobRole.find().lean();
  console.log(JSON.stringify(roles, null, 2));

  await mongoose.disconnect();
}

main().catch(console.error);
