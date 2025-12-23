from bson import ObjectId
import requests
from config import ARTICLE_API_BASE
from google_search import google_search
from scrape_article import scrape_article
from llm_rewrite import rewrite_article
import argparse , os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument("--articleId", required=True)
args = parser.parse_args()

ARTICLE_ID = args.articleId


client = MongoClient(os.getenv("MONGO_URI"))
db = client["beyondchats"]
articles = db["articles"]




# def fetch_latest_article():
#     response = requests.get(ARTICLE_API_BASE)
#     response.raise_for_status()
#     return response.json()[0]


def fetch_existing_urls():
    res = requests.get(f"{ARTICLE_API_BASE}")
    res.raise_for_status()
    articles = res.json()
    return set(a["url"] for a in articles if "url" in a)


def build_excerpt(text, length=400):
    return text[:length].rsplit(" ", 1)[0] + "..."


def publish_article(title, excerpt, url, content ,  references):
    payload = {
        "title": title,
        "excerpt": excerpt,
        "url": url,
        "content": content,
        "references": references
    }

    response = requests.post(ARTICLE_API_BASE, json=payload)
    response.raise_for_status()


def main():
    print("Fetching latest article...")
    # article = fetch_latest_article()
    article = articles.find_one({ "_id": ObjectId(ARTICLE_ID) })

    if not article:
        print("Article not found")
        exit(1)

    # print("Article", article)

    print("Searching Google...")
    google_results = google_search(article["title"])

    # print("GOOGLE RESULT", google_results)

    existing_urls = fetch_existing_urls()

    filtered_results = [
        r for r in google_results
        if r["url"] not in existing_urls
    ]


    print("Scraping reference articles...")
    scraped_contents = []
    reference_urls = []

    for r in filtered_results:
        if len(scraped_contents) == 2:
            break

        content = scrape_article(r["url"])
        if content and len(content) > 500:  # quality check
            scraped_contents.append(content)
            reference_urls.append(r["url"])

    if len(scraped_contents) == 0:
        raise Exception("No valid reference articles found")

    # Allow 1 article if only one is usable
    print(f"Using {len(scraped_contents)} reference article(s)")


    print("Rewriting article using Groq LLM...")
    updated_content = rewrite_article(
        article["content"],
        scraped_contents
    )

    print("Publishing updated article...")
    publish_article(
        title=f"{article['title']} (Updated)",
        excerpt=article["excerpt"],
        url=article["url"],
        content = updated_content,
        references=reference_urls
    )

    print("Rewriting pipeline completed successfully")


if __name__ == "__main__":
    main()
