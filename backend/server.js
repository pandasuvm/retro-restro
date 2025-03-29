const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Product Schema
const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
}));

// Route to insert a dummy product
app.get("/add-dummy-product", async (req, res) => {
  const dummyProduct = new Product({
    name: "Retro Coffee Mug",
    price: 15.99,
    image: "https://via.placeholder.com/150",
    description: "A classic retro-style coffee mug for your morning brew!",
  });

  await dummyProduct.save();
  res.json({ message: "Dummy product added!", product: dummyProduct });
});

// Route to get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(3000, () => console.log("Server running on port 3000"));
