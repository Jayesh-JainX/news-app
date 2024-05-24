const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://online-news-app.vercel.app",
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/news", (req, res) => {
  const quer = req.query.quer;
  const apiKey = process.env.API_KEY;

  if (!quer) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  fetch(`https://newsapi.org/v2/${quer}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((newsData) => {
      res.json(newsData);
    })
    .catch((error) => {
      console.error("Error fetching news data:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/api/ip", (req, res) => {
  const ip_apiKey = process.env.IP_API_KEY;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  fetch(
    `https://api.opencagedata.com/geocode/v1/json?key=${ip_apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`
  )
    .then((response) => response.json())
    .then((Data) => {
      res.json(Data);
    })
    .catch((error) => {
      console.error("Error fetching news data:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
