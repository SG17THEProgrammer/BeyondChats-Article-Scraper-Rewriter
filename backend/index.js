const dotenv = require('dotenv')
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL , 
    methods: ["GET", "POST" , "PUT" , "PATCH"]
  })
);

app.use(express.json());



app.use("/api/articles", articleRoutes);


app.listen(process.env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));