const everything = "everything?q=";
const topheading = "top-headlines?country=";
const sources = "top-headlines/sources?category=";
const source = "top-headlines/sources?";
const queryString = "&category=";
const category = encodeURIComponent(queryString);
let country = "in";
let timeZone = "Asia/Kolkata";
let count = "India";
let rid = "general";

let data = {};
let latitude = null;
let longitude = null;

function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

function toggleClassOnScroll() {
  const element = document.getElementById("view-more");
  if (isAtBottom()) {
    element.classList.add("active");
    element.classList.toggle("active");
  } else {
    element.classList.toggle("active");
  }
}

window.addEventListener("scroll", toggleClassOnScroll);

window.addEventListener("load", async () => {
  if (navigator.onLine) {
    const element = document.getElementById("view-more");
    element.classList.toggle("active");
    async function getCountryCode(latitude, longitude) {
      const url = `/api/ip?latitude=${latitude}&longitude=${longitude}`;

      try {
        const response = await fetch(url);
        data = await response.json();

        if (data.results && data.results.length > 0) {
          country = data.results[0].components.country_code;
          return country;
        } else {
          console.warn("Failed to get country code");
          return country;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return country;
      }
    }

    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      getCountryCode(latitude, longitude)
        .then((countryCode) => {
          if (countryCode) {
            country = countryCode;
            timeZone = getTargetTimeZone();
          } else {
            console.warn("Unable to determine country code");
          }
        })
        .catch((error) => {
          console.warn("Error getting country code:", error);
        });
    });

    fetchNews(topheading + country);
  } else {
    console.warn("No internet connection available");
  }
});

function getTargetTimeZone() {
  if (latitude !== null && longitude !== null) {
    if (!data || !data.results || data.results.length === 0) {
      return "Asia/Kolkata";
    }

    const continentCode = data.results[0].components.continent;
    const stateCode = data.results[0].components.state_code;
    count = data.results[0].components.country;
    if (country === "us") {
      switch (stateCode) {
        case "CA":
          return "America/Los_Angeles";
        case "NY":
          return "America/New_York";
        case "TX":
          return "America/Chicago";
        default:
          return "America/Los_Angeles";
      }
    } else if (continentCode === "Asia") {
      switch (country) {
        case "jp":
          return "Asia/Tokyo";
        case "cn":
          return "Asia/Shanghai";
        case "in":
          return "Asia/Kolkata";
        default:
          return "Asia/Jakarta";
      }
    } else if (continentCode === "Europe") {
      switch (country) {
        case "gb":
          return "Europe/London";
        case "fr":
          return "Europe/Paris";
        case "de":
          return "Europe/Berlin";
        default:
          return "Europe/Amsterdam";
      }
    } else {
      switch (continentCode) {
        case "Australia":
          return "Australia/Sydney";
        case "Africa":
          return "Africa/Nairobi";
        case "Antarctica":
          return "Antarctica/McMurdo";
        case "North America":
          switch (country) {
            case "ca":
              return "America/Toronto";
            case "mx":
              return "America/Mexico_City";
            default:
              return "America/New_York";
          }
        case "South America":
          switch (country) {
            case "br":
              return "America/Sao_Paulo";
            case "ar":
              return "America/Argentina/Buenos_Aires";
            default:
              return "America/Sao_Paulo";
          }
        default:
          return "UTC";
      }
    }
  }
}

async function fetchNews(quer) {
  showLoadingSpinner();
  try {
    const res = await fetch(`/api/news?quer=${quer}`);
    const data = await res.json();
    console.log("Fetched data:", data);
    timeZone = getTargetTimeZone();
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  } finally {
    hideLoadingSpinner();
  }
}

function bindData(articles) {
  const cardContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) {
      console.log("No image URL found, setting default.");
      article.urlToImage = "image/image-load-failed.png";
    }
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataCard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function fillDataCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const dat = new Date(article.publishedAt).toLocaleString("en-us", {
    timeZone,
  });

  newsSource.innerHTML = `${article.author} . ${dat}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;
let curSelectedNav1 = null;
const navItem = document.getElementById("general");
const navItem1 = document.getElementById("generalm");
curSelectedNav = navItem;
curSelectedNav1 = navItem1;
curSelectedNav.classList.add("active");
curSelectedNav1.classList.add("active");

function onNavItemClick(id) {
  rid = id;
  fetchNews(topheading + country + category + id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
  if (SearchInput.value !== "") {
    SearchInput.value = "";
  }
}

function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

function onNavItemClick1(id) {
  rid = id;
  fetchNews(topheading + country + category + id);
  const navItem1 = document.getElementById(id + "m");
  curSelectedNav1?.classList.remove("active");
  curSelectedNav1 = navItem1;
  curSelectedNav1.classList.add("active");
  sidebar.classList.toggle("active");
  if (openSidebarButton.className !== "bx bx-x-circle") {
    openSidebarButton.className = "bx bx-x-circle";
  } else {
    openSidebarButton.className = "bx bx-menu";
  }
  if (SearchInput1.value !== "") {
    SearchInput1.value = "";
  }
}

const SearchInput = document.getElementById("news-input");
const SearchInput1 = document.getElementById("news-input1");
const SearchButton = document.getElementById("news-button");
const SearchButton1 = document.getElementById("news-button1");

SearchButton.addEventListener("click", () => {
  const list = SearchInput.value;
  rid = "Trending" + list;
  fetchNews(everything + list);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

SearchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const list = SearchInput.value;
    rid = "Trending" + list;
    fetchNews(everything + list);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
  }
});

SearchButton1.addEventListener("click", () => {
  const list1 = SearchInput1.value;
  rid = "Trending" + list1;
  fetchNews(everything + list1);
  curSelectedNav1?.classList.remove("active");
  curSelectedNav1 = null;
  sidebar.classList.toggle("active");
  if (openSidebarButton.className !== "bx bx-x-circle") {
    openSidebarButton.className = "bx bx-x-circle";
  } else {
    openSidebarButton.className = "bx bx-menu";
  }
});

SearchInput1.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const list1 = SearchInput1.value;
    rid = "Trending" + list1;
    fetchNews(everything + list1);
    curSelectedNav1?.classList.remove("active");
    curSelectedNav1 = null;
    sidebar.classList.toggle("active");
    if (openSidebarButton.className !== "bx bx-x-circle") {
      openSidebarButton.className = "bx bx-x-circle";
    } else {
      openSidebarButton.className = "bx bx-menu";
    }
  }
});

const openSidebarButton = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("cards-container");

main.addEventListener("click", function () {
  if (sidebar.classList.contains("active")) {
    sidebar.classList.toggle("active");
    if (openSidebarButton.className !== "bx bx-x-circle") {
      openSidebarButton.className = "bx bx-x-circle";
    } else {
      openSidebarButton.className = "bx bx-menu";
    }
  }
});

openSidebarButton.addEventListener("click", function () {
  sidebar.classList.toggle("active");
  if (openSidebarButton.className !== "bx bx-x-circle") {
    openSidebarButton.className = "bx bx-x-circle";
  } else {
    openSidebarButton.className = "bx bx-menu";
  }
});

function hideside() {
  sidebar.classList.toggle("active");
  if (openSidebarButton.className !== "bx bx-x-circle") {
    openSidebarButton.className = "bx bx-x-circle";
  } else {
    openSidebarButton.className = "bx bx-menu";
  }
}

function viewmore() {
  appendNews(everything + rid + " " + count);
  const element = document.getElementById("view-more");
  element.classList.toggle("active");
}

async function appendNews(quer) {
  showLoadingSpinner();
  try {
    const res = await fetch(`/api/news?quer=${quer}`);
    const data = await res.json();
    timeZone = getTargetTimeZone();
    bindappendData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  } finally {
    hideLoadingSpinner();
  }
}

function bindappendData(articles) {
  const cardContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  articles.forEach((article) => {
    if (!article.urlToImage) {
      console.log("No image URL found, setting default.");
      article.urlToImage = "/image/image-load-failed.png";
    }

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataCard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });
}
