import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { connectDb, db } from "./db.js";

const credential = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credential),
});

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  const { authToken } = req.header;
  if (authToken) {
    try {
      req.user = await admin.auth().verifyIdToken(authToken);
    } catch (e) {
      res.sendStatus(400).send(e);
    }
  }
  req.user = req.user || {};

  next();
});

// -------------------------greet
app.get("/api/articles/greet", (req, res) => {
  res.send("Welcome Home!");
});

// --------------------------get article
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid & !upvoteIds.includes(uid);
    res.json(article);
  } else res.sendStatus(404).send("data not found");
});

// --------------------------upote article

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.inclues(uid);

    if (canUpvote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
    }
    const updatedArticle = await db.collection("articles").findOne({ name });
    res.json(updatedArticle);
  } else {
    res.sendStatus(404).send("The article doesn't exist");
  }
});

// --------------------------comment article

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db
    .collection("articles")
    .updateOne({ name }, { $push: { comments: { postedBy: email, text } } });

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404).send("The article doesn't exist");
  }
});

connectDb(() => {
  console.log("Successfully connected to database!");
  app.listen(8000, () => {
    console.log("Server is listning on port:8000");
  });
});
