const express = require("express");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://jonathan1865037:${process.env.PASS}@cluster0.2kxf4v5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const app = express();
const port = 3000;

async function run(id, temp, moisture, humidity) {
  try {
    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("Sensors");
    const haiku = database.collection(id);

    // Create a document to insert
    const doc = {
      time: new Date(),
      temp: temp,
      humidity: humidity,
      moisture: moisture,
    };
    // Insert the defined document into the "haiku" collection
    const result = await haiku.insertOne(doc);

    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/data/", (req, res) => {
  const { id, temp, moisture, humidity } = req.body;
  run(id, temp, moisture, humidity).catch(console.dir);
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
