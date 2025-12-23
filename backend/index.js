const dotenv = require('dotenv')
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/articles", articleRoutes);


app.listen(4000, () => {
    console.log("🚀 API running on http://localhost:4000");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));