const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7bquc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tour");
    const servicesCollection = database.collection("places");

    // GET API
    app.get("/places", async (req, res) => {
      const cursor = servicesCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });

    // Get Single package
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific place", id);
      const query = { _id: ObjectId(id) };
      const place = await servicesCollection.findOne(query);
      res.json(place);
    });

    // POST API
    app.post("/places", async (req, res) => {
      const place = req.body;
      console.log("hit the post API", place);

      const result = await servicesCollection.insertOne(place);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("today is 3rd day and my server is running");
});

app.listen(port, () => {
  console.log("my server is running on port ", port);
});
