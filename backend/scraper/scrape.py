import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
import pytz

load_dotenv()

BASE_URL = "https://beyondchats.com/blogs/"


client = MongoClient(os.getenv("MONGO_URI"))
db = client["beyondchats"]
collection = db["articles"]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}


def get_last_page():
    res = requests.get(BASE_URL, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(res.text, "html.parser")

    pages = []
    for a in soup.select(".page-numbers"):
        if a.text.isdigit():
            pages.append(int(a.text))

    return max(pages) if pages else 1


def scrape_article_content(url):
    """
    Scrape full blog content using Elementor structure:
    - Start from H1 (elementor-heading-title)
    - Capture p, h2-h4, li
    - Stop at Elementor footer
    """
    try:
        res = requests.get(
            url,
            headers=HEADERS,
            timeout=10,
            verify=False
        )
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        # H1
        h1 = soup.find("h1", class_="elementor-heading-title")
        if not h1:
            print(f"⚠ No H1 found for {url}")
            return ""

        content_parts = []

        # DOM after H1
        for elem in h1.find_all_next():

            # Stop at footer
            if (
                elem.name == "div"
                and elem.get("class")
                and "elementor-location-footer" in elem.get("class")
            ):
                break

            # Skip non-content tags
            if elem.name in ["script", "style", "noscript"]:
                continue

            # Paragraphs & headings
            if elem.name in ["p", "h2", "h3", "h4"]:
                text = elem.get_text(" ", strip=True)
                if text:
                    content_parts.append(text)

            # List items
            elif elem.name == "li":
                text = elem.get_text(" ", strip=True)
                if text:
                    content_parts.append(f"- {text}")

        return "\n".join(content_parts)

    except Exception as e:
        print(f"Failed to scrape {url}: {e}")
        return ""
    
STOP_PHRASES = [
    "Leave a Reply",
    "More from",
    "Share on",
    "BeyondChats 20",
    "Why BeyondChats",
    "All rights reserved",
    "Save my name",
    "Post Comment"
]

REMOVE_LINE_KEYWORDS = [
    "LinkedIn",
    "Instagram",
    "Twitter",
    "RESOURCES",
    "Pricing",
    "Products",
    "Features",
    "Integrations",
    "Contact Us",
    "About Us",
    "FAQs",
    "Startup",
    "Standard",
    "Business",
    "Enterprise"
]

    
def clean_article_content(raw_content):
    cleaned_lines = []

    for line in raw_content.split("\n"):
        line = line.strip()

        if any(stop in line for stop in STOP_PHRASES):
            break

        if not line:
            continue

        if any(word in line for word in REMOVE_LINE_KEYWORDS):
            continue

        if line.lower().startswith(("- ritika", "- december", "- chatbots")):
            continue

        cleaned_lines.append(line)

    return "\n".join(cleaned_lines)



def scrape_oldest_5_articles():
    last_page = get_last_page()
    collected_articles = []

    page = last_page

    while page > 0 and len(collected_articles) < 5:
        page_url = f"{BASE_URL}page/{page}/"
        print(f"Scraping page {page}...")

        res = requests.get(page_url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")

        articles = soup.find_all("article")

        # iterating from oldest to newest
        for art in reversed(articles):
            title_tag = art.find("h2")
            link_tag = title_tag.find("a") if title_tag else None

            if not link_tag or not link_tag.get("href"):
                continue

            title = title_tag.text.strip()
            url = link_tag["href"]
            excerpt = art.find("p").get_text(
                strip=True) if art.find("p") else ""

            # Scraping full content
            raw_content = scrape_article_content(url)
            content = clean_article_content(raw_content)

            if not content or len(content) < 300:
                print(f"⚠ Skipping {url} (content too short)")
                continue

            collected_articles.append({
                "title": title,
                "url": url,
                "excerpt": excerpt,
                "content": content
            })

            if len(collected_articles) == 5:
                break

        page -= 1

    # Store in MongoDB
    inserted = 0
    for art in collected_articles:
        result = collection.update_one(
            {"url": art["url"]},
            {
                "$set": {
                    "title": art["title"],
                    "excerpt": art["excerpt"],
                    "content": art["content"],
                    "updatedAt": datetime.now(pytz.timezone("Asia/Kolkata"))
                }
            }
        )
        print(result)

        if result.nModified:
            inserted += 1

    print(f" Updated/Stored {inserted} articles in DB")


if __name__ == "__main__":
    scrape_oldest_5_articles()
