const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://artAndCraftStore:jmP1Fh5DIx1l8qb1@cluster0.gusrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {



        const database = client.db("artAndCraftStore");
        const craftItems = database.collection("craftItems");

        app.get("/items", async (req, res) => {
            const cursor = craftItems.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // specific item
        app.get("/items/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) };
            const result = await craftItems.findOne(cursor);
            res.send(result);
        })

        // stores craft and art items in the database
        app.post("/items", async (req, res) => {
            const newData = req.body;
            const result = await craftItems.insertOne(newData);
            res.send(result);
            console.log(newData);
        })

        // update items
        app.put("/items/:id", async (req, res) => {
            const newItem = req.body;
            const filter = { _id: new ObjectId(req.params.id) };
            const option = { upsert: true }
            const updatedItem = {
                $set: {
                    image: newItem.image,
                    item_name: newItem.item_name,
                    subcategory_name: newItem.subcategory_name,
                    price: newItem.price,
                    rating: newItem.rating,
                    customization: newItem.customization,
                    processing_time: newItem.processing_time,
                    stockStatus: newItem.stockStatus,
                    short_description: newItem.short_description,
                }
            }
            const result = await craftItems.updateOne(filter, updatedItem, option);
            res.send(result);
        })





        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);






app.get("/", (req, res) => {
    res.send("server is running!")
})
app.listen(port, () => {
    console.log(`Server is runnning on : ${port}`);
})