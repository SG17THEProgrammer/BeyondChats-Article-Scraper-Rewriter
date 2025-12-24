# BeyondChats Article Scraper & Rewriter 🚀

This project scrapes articles from the **BeyondChats blog**, stores them in MongoDB, provides **CRUD APIs using Node.js + Express**, and includes a **Python-based AI rewriting pipeline** that updates articles using Google-ranked reference content and an LLM (Groq).
A **React frontend** allows users to view original and updated articles and trigger rewrites.

---

## 🧱 Tech Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Scraping      | Python, Requests, BeautifulSoup |
| Backend APIs  | Node.js, Express                |
| Database      | MongoDB Atlas                   |
| AI / LLM      | Groq API                        |
| Search        | SERP API (Google Search)        |
| Frontend      | ReactJS                         |
| Orchestration | Node → Python via child_process |

---

## 📂 Project Structure

```
BeyondChats/
│
├── backend/                # Node + Express APIs
│   ├── routes/
│   │   └── articles.js
│   ├── models/
│   │   └── Article.js
│   └── index.js
|   ├── scraper/                  # Python scraping & rewriting
│         └── index.py            # main rewrite pipeline
│         └── scrape.py           # BeyondChats scraper
│         └── google_search.py    # SERP API logic
│         └── scrape_article.py   # external article scraper
│         └── llm_rewrite.py      # Groq LLM logic
│         └── config.py           # For all API keys
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleList.jsx
│   │   │   ├── FullArticle.jsx
│   │   │   └── FullCard.jsx
│   │   │   └── Home.jsx
│   │   │   └── Loader.jsx
│   │   │   └── MarkdownRenderer.jsx
│   │   │   └── Tabs.jsx
│   │   └── App.jsx
│   │   └── main.jsx
│
└── README.md
```

---


## ⚙️ Live (Hosted URL) 

```bash
https://scarp-writing.netlify.app/
```





## ⚙️ Local Setup Instructions

###  Clone Repository

```bash
git clone https://github.com/SG17THEProgrammer/BeyondChats-Article-Scraper-Rewriter.git

```



###  Backend Setup (Node.js)

```bash
cd backend
npm install
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 4️⃣ Python Scraper & Rewriter Setup

```bash
cd scraper
pip install -r requirements.txt
```

Add `.env`:

```env
MONGO_URI=your_mongo_uri
GROQ_API_KEY=your_groq_key
SERP_API_KEY=your_serpapi_key
GROQ_MODEL=your_groq_model
```

Run initial scraper to scrap "Beyond Chats Website":

```bash
python scrape.py
```

---

### 5️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔁 Data Flow / Architecture Diagram

```
┌──────────────────────────┐
│        Frontend          │
│      (ReactJS App)       │
│                          │
│ • View article list both │
│  original and updated    │
│ • View full article      │
│ • Trigger rewrite action │
│ • Show loading & status  │
└──────────────┬───────────┘
               │ REST APIs (HTTP/JSON)
               ▼
┌──────────────────────────┐
│        Backend API       │
│     (Node.js + Express)  │
│                          │
│ • Article CRUD APIs      │
│ • Rewrite trigger route  │
│ • Python process spawn   │
└──────────────┬───────────┘
               │ spawn() / child_process
               ▼
┌──────────────────────────┐
│      Processing Layer    │
│        (Python)          │
│                          │
│ 1. Fetch article by ID   │
│ 2. Perform SERP search   │
│ 3. Scrape top references │
│ 4. Rewrite using Groq    │
│    LLM (Markdown output) │
│ 5. Store rewritten data │
└──────────────┬───────────┘
               │ Database Operations
               ▼
┌──────────────────────────┐
│          Database        │
│          (MongoDB)       │
│                          │
│ • Original articles      │
│ • Rewritten articles     │
│ • References             │
└──────────────────────────┘

```

---

## 🧠 Rewrite Pipeline

1. User selects an article from frontend
2. Frontend calls:

   ```
   POST /api/articles/:id/rewrite
   ```
3. Backend:

   * Spawns Python script
     
5. Python script:

   * Searches article title on Google
   * Filters repetitve/unscrappable  links
   * Scrapes content from top 2 articles (if possible and available)
   * Uses Groq LLM to rewrite content
   * Stores updated article with references
     
6. Backend updates
   
7. Frontend accordingly updates the UI

---

## 📌 How Updated Articles Are Identified

An article is considered **updated** if :

* Title ends with `(Updated)`

No separate endpoint required.

---

## 🎯 Features

* ✅ Scrape oldest BeyondChats articles
* ✅ Store full content in MongoDB
* ✅ Rewrite using Google-ranked articles
* ✅ LLM-based content enhancement
* ✅ Reference citation
* ✅ Responsive React UI
* ✅ Markdown rendering support

---


⚠️ Important Notes & Limitations

🔒 Access Restrictions
Some websites block automated scraping (403 / Access Denied). In such cases, only 1 reference article may be available instead of 2.

☁️ Render Hosting Constraints
The backend runs on Render, and many sites restrict cloud IPs — this can lead to fewer scrapeable sources.

⏳ Performance Delay
Scraping + rewriting is a background-heavy task. On Render, it may take slightly longer due to cold starts & limited resources.

💻 Local vs Production

Running locally:
Faster execution ⚡
Higher success rate for 2 or more  references ✅

🎯 Intentional Design Choice
No paid proxies used — kept cost-efficient, simple, and transparent.

