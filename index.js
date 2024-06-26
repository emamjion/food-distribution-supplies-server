const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Food Distribution supplies server is running..... ');
});


/* -------------------------------------- MongoDB code here ---------------------------- */





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjkyc58.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collections
    const suppliesCollection = client.db('DistributionDb').collection('supplies');

    // Get Method
    app.get('/supplies', async(req, res) => {
        const result = await suppliesCollection.find().toArray();
        res.send(result);
    });

    app.get('/supplies/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await suppliesCollection.findOne(query);
      res.send(result);
    });

    app.post('/supplies', async(req, res) => {
      const item = req.body;
      const result = await suppliesCollection.insertOne(item);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




/* -------------------------------------- MongoDB code here ---------------------------- */


app.listen(port, () => {
    console.log(`Food Distribution Server is running on port: ${port}`);
})