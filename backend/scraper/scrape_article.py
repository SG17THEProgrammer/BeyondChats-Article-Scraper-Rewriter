import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def scrape_article(url):
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10,
            verify=False   # 🔥 FIX
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        article = soup.find("article")
        if not article:
            return None

        paragraphs = article.find_all("p")
        text = "\n".join(p.get_text() for p in paragraphs)

        return text.strip()

    except Exception as e:
        print(f"Failed to scrape {url}: {e}")
        return None
