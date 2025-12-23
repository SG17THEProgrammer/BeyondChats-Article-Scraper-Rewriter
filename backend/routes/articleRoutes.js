const express = require("express");
const Article = require("../models/Article");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
});

// READ ALL
router.get("/", async (req, res) => {
  const articles = await Article.find({}).sort({ createdAt: -1 });
  res.json(articles);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
//   console.log(article);
  res.json(article);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Article deleted" });
});

//PYTHON
router.post("/:id/rewrite", async (req, res) => {
  const articleId = req.params.id;

  console.log(articleId);

   const pythonPath = path.join(
    __dirname,
    "../scraper/index.py" ,
  );

    const process = spawn("python", [
    pythonPath,
     "--articleId",
    articleId
  ]);

  process.stdout.on("data", (data) => {
    console.log(`PYTHON: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`PYTHON ERROR: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  res.json({ message: "Rewrite job started" });
});

module.exports = router;
