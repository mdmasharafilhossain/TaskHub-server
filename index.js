const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzichn4.mongodb.net/?retryWrites=true&w=majority`;

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
    const TasksCollection = client.db('taskHub').collection('tasks');


    // Task 
    app.get('/tasks', async(req,res)=>{
      const cursor = TasksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });

  app.get('/tasks/user/:email', async(req,res)=>{
    const email = req.params.email;
  
  const result = await TasksCollection.find({email}).toArray();
  res.send(result)
  })
  app.post('/tasks', async(req,res)=>{
    const AddNewTask = req.body;
    console.log(AddNewTask);
    const query = {title:AddNewTask.title}
      const ExistingUser = await TasksCollection.findOne(query);
      if(ExistingUser){
        return res.send({message: 'Tasks Already Exists',insertedId: null})
      }
    const result = await TasksCollection.insertOne(AddNewTask);
    res.send(result);
  });

  app.put('/tasks/update/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert:true}
    const updatedProduct = req.body;

    const Product = {
      $set: {
        title:updatedProduct.title,
        description:updatedProduct.description,
        
      }
    }

    const result = await TasksCollection.updateOne(filter,Product,options);
    res.send(result);
  });
  app.delete('/tasks/delete/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await TasksCollection.deleteOne(query);
    res.send(result);
 });




    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req,res) =>{
   res.send('Server Running Successfully');
})

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`)
})