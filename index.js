const { MongoClient } = require("mongodb");
const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, Hospital Users !!!");
});

app.listen(port, () => {
  console.log("Now listening to the port", port);
});

const uri = `mongodb+srv://${process.env._DB_USER}:${process.env._DB_PASS}@cluster0.ig2yp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("hospital");
    const servicesCollection = database.collection("services");

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service/:serviceName", async (req, res) => {
      //   const id = req.params.id;
      //   const query = { _id: ObjectId(id) };
      const serviceName = req.params.serviceName;
      const query = { service: serviceName };
      const result = await servicesCollection.findOne(query);

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
