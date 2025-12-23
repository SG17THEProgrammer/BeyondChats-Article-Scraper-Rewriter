const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title:  { type: String, required: true },
    url: { type: String ,  required: true},
    excerpt:  { type: String ,  required: true},
    content: String,
    references :[String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
