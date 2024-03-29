//1
const express = require('express');
const app = express()
const port = process.env.PORT || 5000
//3
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');

//5^1 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//4
// middleware 
app.use(cors())
app.use(express.json())

//5 cloud.mongodb.com 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//6 https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/ 

async function run() {
    try {
        //7
        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        const orderCollection = client.db("geniusCar").collection("order");

        //8 Find Multiple (get means load data)
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        //9 findOne 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //10 POST  (post means add data ) insert a doc  [client site ==> AddService 8]
        // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/ 
        app.post('/service' , async(req,res) => {
            const service = req.body 
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        //11 delete      (specific on item )
        // https://www.mongodb.com/docs/drivers/node/current/usage-examples/deleteOne/
        app.delete('/service/:id' , async(req,res) => {
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

        //12 update 

        //order collection api 

        //load orders
        app.get('/order' , async(req,res) => {
            const email = req.query.email
            const query = {email : email} 
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        // get orders
        app.post('/order' , async(req,res) => {
            const order = req.body 
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

        //auth (access token)
        app.post('/login' , async(req,res) =>{
            const user = req.body 
            const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '1d'})
            res.send(accessToken)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



//2
app.get('/', (req, res) => {
    res.send('Running genius car service ')
})

app.listen(port, () => {
    console.log("Running Genius Car ", port);
})
