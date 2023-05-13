const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// meddle-were
app.use(cors())
app.use(express.json())

// mongodb info
// pass: 
// user: 

// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ypbupu6.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("coffeesDB").collection("coffees")

    // create new coffee
    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        const result = await userCollection.insertOne(newCoffee)
        res.send(result)
    })

    // read coffees
    app.get('/coffees', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    // read a specific coffee item
    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    // delete coffee
    app.delete('/coffees/:id', async(req, res)=> {
      const dltId = req.params.id;
      const query = {_id: new ObjectId(dltId)}
      const result = await userCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })

    // updated coffee
    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateCoffee = req.body;
      const options = {upsert: true}
      const coffee = {
        $set:{
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photoUrl: updateCoffee.photoUrl
        }
      }
      const result = await userCollection.updateOne(filter, coffee, options)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




// get the server in root point [for tasting]
app.get('/', (req, res)=> {
    res.send('This is Espresso-Emporium-coffee server')
})

// app listen
app.listen(port, ()=> {
    console.log(`The server is running on: ${port}`)
})