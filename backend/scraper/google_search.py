import requests
from config import SERPAPI_KEY

BLOCKED_DOMAINS = [
    "amazon.",
    "youtube.",
    "linkedin.",
    "reddit.",
    "quora.",
    "facebook.",
    "twitter.",
    "instagram.",
    "beyondchats.com"
]

def google_search(query):
    params = {
        "engine": "google",
        "q": query,
        "api_key": SERPAPI_KEY,
        "num": 20
    }

    response = requests.get("https://serpapi.com/search", params=params)
    response.raise_for_status()

    results = response.json().get("organic_results", [])
    articles = []

    for r in results:
        url = r.get("link")
        if not url:
            continue

        # 🚫 Skip blocked domains
        if any(domain in url for domain in BLOCKED_DOMAINS):
            continue

        articles.append({
            "title": r.get("title"),
            "url": url
        })

        # if len(articles) == 2:
        #     break

    return articles
