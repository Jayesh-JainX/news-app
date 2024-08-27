const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const NodeCache = require("node-cache");
const { linkPreview } = require(`link-preview-node`);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 600 });

app.use(
  cors({
    origin: [
      "https://online-news-app.vercel.app",
      "https://online-news-app.netlify.app",
    ],
  })
);

app.use(express.static(path.join(__dirname, "public")));

const authorImagesUrls = {
  NDTV: "https://www.ndtv.com",
  BBC: "https://www.bbc.com",
  CNN: "https://www.cnn.com",
  "The Guardian": "https://www.theguardian.com",
  "The New York Times": "https://www.nytimes.com",
  "The Washington Post": "https://www.washingtonpost.com",
  Reuters: "https://www.reuters.com",
  "Al Jazeera": "https://www.aljazeera.com",
  "The Wall Street Journal": "https://www.wsj.com",
  "The Economist": "https://www.economist.com",
  "The Times of India": "https://timesofindia.indiatimes.com",
  "Hindustan Times": "https://www.hindustantimes.com",
  "The Hindu": "https://www.thehindu.com",
  "The Daily Mail": "https://www.dailymail.co.uk",
  "The Sun": "https://www.thesun.co.uk",
  "The Telegraph": "https://www.telegraph.co.uk",
  "The Independent": "https://www.independent.co.uk",
  "The Associated Press": "https://apnews.com",
  "France 24": "https://www.france24.com",
  "Deutsche Welle": "https://www.dw.com",
  "El País": "https://elpais.com",
  "Le Monde": "https://www.lemonde.fr",
  "La Repubblica": "https://www.repubblica.it",
  "Asahi Shimbun": "https://www.asahi.com",
  "Yomiuri Shimbun": "https://www.yomiuri.co.jp",
  "Xinhua News Agency": "https://www.xinhuanet.com",
  "Sputnik News": "https://sputniknews.com",
  TASS: "https://tass.ru",
  "The Sydney Morning Herald": "https://www.smh.com.au",
  "The Age": "https://www.theage.com.au",
  "The New Zealand Herald": "https://www.nzherald.co.nz",
  "The Globe and Mail": "https://www.theglobeandmail.com",
  "National Post": "https://nationalpost.com",
  "CBC News": "https://www.cbc.ca/news",
  "The Toronto Star": "https://www.thestar.com",
  "The Irish Times": "https://www.irishtimes.com",
  "The Scotsman": "https://www.scotsman.com",
  "The South African": "https://www.thesouthafrican.com",
  "The Nigerian Tribune": "https://tribuneonlineng.com",
  "The Straits Times": "https://www.straitstimes.com",
  "The Jakarta Post": "https://www.thejakartapost.com",
  "Bangkok Post": "https://www.bangkokpost.com",
  "The Korea Herald": "https://www.koreaherald.com",
  "The Japan Times": "https://www.japantimes.co.jp",
  "The Jerusalem Post": "https://www.jpost.com",
  Haaretz: "https://www.haaretz.com",
  "Al-Ahram": "https://english.ahram.org.eg/",
  "Al-Monitor": "https://www.al-monitor.com",
  "The Daily Star Lebanon": "https://www.dailystar.com.lb/",
  "The Times of Israel": "https://www.timesofisrael.com",
  "The National (UAE)": "https://www.thenational.ae/",
  "The Independent (South Africa)": "https://www.iol.co.za/",
  "The Daily News (South Africa)": "https://www.dailynews.co.za/",
  "The Star (South Africa)": "https://www.iol.co.za/the-star",
  "The Herald (Zimbabwe)": "https://www.herald.co.zw/",
  "The Daily Monitor (Uganda)": "https://www.monitor.co.ug/",
  "The East African": "https://www.theeastafrican.co.ke/",
  "The Zambian Watchdog": "https://www.watchdog.co.zm/",
  "The Namibian": "https://www.namibian.com.na/",
  "The Botswana Gazette": "https://www.botswanagazette.com/",
  "The Herald (Ghana)": "https://www.ghanaweb.com/GhanaHomePage/",
  "The Daily Graphic (Ghana)": "https://www.graphic.com.gh/",
  "The Punch (Nigeria)": "https://punchng.com/",
  "The Guardian Nigeria": "https://guardian.ng/",
  "The Nation (Nigeria)": "https://thenationonlineng.net/",
  "The Daily News (Kenya)": "https://www.dailynews.co.ke/",
  "The Standard (Kenya)": "https://www.standardmedia.co.ke/",
  "The Daily Nation (Kenya)": "https://www.nation.co.ke/",
  "The Daily News (Tanzania)": "https://www.dailynews.tz/",
  "The Citizen (South Africa)": "https://www.citizen.co.za/",
  "The Sunday Times (South Africa)": "https://www.timeslive.co.za/",
  "The Mail & Guardian (South Africa)": "https://mg.co.za/",
  "The Namibian Sun": "https://www.namibiansun.com/",
  "The Botswana Guardian": "https://www.botswanaguard.com/",
  "The Ghanaian Times": "https://www.ghanaiantimes.com.gh/",
  Cricbuzz: "https://www.cricbuzz.com/",
  "Bloomberg Television": "https://www.bloomberg.com",
  "India TV News": "https://www.indiatvnews.com",
  Moneycontrol: "https://www.moneycontrol.com",
  "TOI Etimes": "https://timesofindia.indiatimes.com/etimes",
  "Al Jazeera English": "https://www.aljazeera.com",
  "Channel News Asia": "https://www.channelnewsasia.com",
  "Daily Sabah": "https://www.dailysabah.com",
  "The Telegraph (Australia)": "https://www.theaustralian.com.au",
  "The New Statesman": "https://www.newstatesman.com",
  "The Spectator": "https://www.spectator.co.uk",
  "The Atlantic": "https://www.theatlantic.com",
  "National Geographic": "https://www.nationalgeographic.com",
  Forbes: "https://www.forbes.com",
  "Business Insider": "https://www.businessinsider.com",
  Politico: "https://www.politico.com",
  Wired: "https://www.wired.com",
  "The Hindu Business Line": "https://www.thehindubusinessline.com",
  TechCrunch: "https://techcrunch.com",
  Mashable: "https://mashable.com",
  Slate: "https://slate.com",
  "USA Today": "https://www.usatoday.com",
  "The Independent (US)": "https://www.independent.co.uk/us",
  NPR: "https://www.npr.org",
  "BBC World News": "https://www.bbc.com/news/world",
  "Reuters World": "https://www.reuters.com/news/world",
  "The Washington Times": "https://www.washingtontimes.com",
  "Al-Arabiya": "https://english.alarabiya.net",
  "The New Yorker": "https://www.newyorker.com",
  "The Hill": "https://thehill.com",
  "The Root": "https://www.theroot.com",
  "Daily Beast": "https://www.thedailybeast.com",
  "The Ringer": "https://www.theringer.com",
};

app.get("/api/news", async (req, res) => {
  const apiKey = process.env.API_KEY;
  const quer = req.query.quer;

  if (!quer) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const cacheKey = `newsData-${quer}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    // If cached data exists, return it
    return res.json(cachedData);
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/${quer}&apikey=${apiKey}`
    );
    const newsData = await response.json();

    const articlesWithoutImages = newsData.articles.filter(
      (article) => !article.urlToImage && article.author
    );
    const authorsWithUrls = [
      ...new Set(articlesWithoutImages.map((article) => article.author)),
    ];
    const authorUrls = authorsWithUrls
      .map((author) => authorImagesUrls[author])
      .filter((url) => url);

    const linkPreviewPromises = authorUrls.map((url) => linkPreview(url));
    const previews = await Promise.all(linkPreviewPromises);

    const previewMap = new Map();
    previews.forEach((preview, index) => {
      const author = authorsWithUrls[index];
      previewMap.set(author, preview.image || "");
    });

    newsData.articles.forEach((article) => {
      if (!article.urlToImage) {
        const authorImageUrl = authorImagesUrls[article.author];
        if (authorImageUrl) {
          article.urlToImage = previewMap.get(article.author) || "";
        }
      }
    });

    cache.set(cacheKey, newsData);

    res.json(newsData);
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/ip", (req, res) => {
  const ip_apiKey = process.env.IP_API_KEY;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  const cacheKey = `location-${latitude}-${longitude}`;
  const cachedLocation = cache.get(cacheKey);

  if (cachedLocation) {
    // If cached data exists, return it
    return res.json(cachedLocation);
  }

  fetch(
    `https://api.opencagedata.com/geocode/v1/json?key=${ip_apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`
  )
    .then((response) => response.json())
    .then((Data) => {
      cache.set(cacheKey, Data);
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
