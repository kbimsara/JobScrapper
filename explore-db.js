const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://22ug10498_db_user:Hunter12045@ac-ppngmjd-shard-00-00.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-01.wiongjz.mongodb.net:27017,ac-ppngmjd-shard-00-02.wiongjz.mongodb.net:27017/job-finder?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=jbclaster";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("job-finder");
    const sampleJob = await db.collection('jobposts').findOne({});
    console.log("Sample JobPost:", JSON.stringify(sampleJob, null, 2));

    const sampleNotification = await db.collection('notificationdeliveries').findOne({});
    console.log("Sample Notification Delivery:", JSON.stringify(sampleNotification, null, 2));
  } finally {
    await client.close();
  }
}

main().catch(console.error);
