const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gusrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        const subcategories = database.collection("subcategories");


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
            // console.log(newData);
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

        // delete item
        app.delete("/items/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await craftItems.deleteOne(filter);
            res.send(result);
        })


        // temporarily insert data in the database
        // await database.collection("subcategories").insertMany([
        //     {
        //         subcategory_Name: "Abstract Line Art",
        //         image: "https://i.ibb.co/KcMJ1g6S/abstract-Art.jpg",
        //         description: "Minimal and expressive line-based abstract compositions."
        //     },
        //     {
        //         subcategory_Name: "Cartoon Drawing",
        //         image: "https://i.ibb.co/5x8NR96w/cartoon-Drawing.webp",
        //         description: "Fun and colorful cartoon avatars, characters, and comics."
        //     },
        //     {
        //         subcategory_Name: "Pencil Portrait",
        //         image: "https://i.ibb.co/LXFB5nsv/pencilart.jpg",
        //         description: "Realistic pencil drawings capturing personal expressions."
        //     },
        //     {
        //         subcategory_Name: "Landscape Drawing",
        //         image: "https://i.ibb.co/9mqSpKfr/sunset-Overhill.jpg",
        //         description: "Scenic landscape drawings featuring hills, skies, and nature."
        //     },
        //     {
        //         subcategory_Name: "Watercolor Art",
        //         image: "https://i.ibb.co/5XqnD6ct/watercolor-Art.jpg",
        //         description: "Soft watercolor art featuring florals and nature elements."
        //     },
        //     {
        //         subcategory_Name: "Charcoal Drawing",
        //         image: "https://i.ibb.co/bZh7SBc/urban.jpg",
        //         description: "Dramatic black-and-white charcoal sketches of urban scenes."
        //     }
        // ]);

        app.get("/subcategory", async (req, res) => {
            const cursor = subcategories.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/subcategory/:sub_name", async (req, res) => {
            const subName = req.params.sub_name;
            const cursor = { subcategory_Name: subName };
            const result = craftItems.find(cursor);
            const result1 = await result.toArray();
            res.send(result1);
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