const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:abcd1234@myapp-prthu.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("nodeApp").collection("web");
  console.log("connected");
  client.close();
});