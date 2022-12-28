const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
const stripe = require("stripe")(`${process.env.STRIPE_PK}`);

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbqhd62.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
    const productsCollection = client.db("organicfoodshop").collection("products")
    const categoriesCollection = client.db("organicfoodshop").collection("categories")

    app.get("/products", async (req, res) => {
        const request = req.query;
        // checking if any query sent in request
        let query = {};
        let result = [];
        if (request.limit) {
            result = await productsCollection.find(query).sort({ name: -1 }).limit(parseInt(request.limit)).toArray();
        } else {
            result = await productsCollection.find(query).toArray();
        }
        res.send(result)
    })
    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await productsCollection.findOne(query)
        res.send(result)
    })
    app.get("/categories", async (req, res) => {
        const query = {};
        const result = await categoriesCollection.find(query).toArray();

        res.send(result)
    })
    app.post("/create-payment-intent", async (req, res) => {
        const order = req.body;
        const totalPrice = order.total;
        const amount = totalPrice * 100;


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            "payment_method_types": [
                "card"
            ],

        })
        res.send({
            clientSecret: paymentIntent.client_secret,
        })
    })


}

run().catch(error => console.log(error))



app.get("/", (req, res) => {
    res.send("Organic food server is running");
})

app.listen(port, () => {
    console.log("Organic food server is running at ", port)
})