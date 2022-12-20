const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbqhd62.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
    const productsCollection = client.db("organicfoodshop").collection("products")
    const categoriesCollection = client.db("organicfoodshop").collection("categories")

    app.get("/products", async (req, res) => {
        const query = {};
        const result = await productsCollection.find(query).toArray();

        res.send(result)
    })
    app.get("/categories", async (req, res) => {
        const query = {};
        const result = await categoriesCollection.find(query).toArray();

        res.send(result)
    })
}

run().catch(error => console.log(error))



app.get("/", (req, res) => {
    res.send("Organic food server is running");
})

app.listen(port, () => {
    console.log("Organic food server is running at ", port)
})