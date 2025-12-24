from groq import Groq
from config import GROQ_API_KEY , GROQ_MODEL
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

client = Groq(api_key=GROQ_API_KEY)

def rewrite_article(original, references):

    article_1 = references[0] if len(references) >= 1 else ""
    article_2 = references[1] if len(references) >= 2 else ""

    prompt = f"""
You are a senior SEO content editor.

TASK:
Rewrite the ORIGINAL ARTICLE so that:
- Its structure, formatting, and depth are similar to the TOP-RANKING ARTICLES
- The topic remains the same
- The wording is original and NOT copied

---

ORIGINAL CONTENT (to improve):
{original}

---

TOP-RANKING ARTICLES (style references):

ARTICLE 1:
{article_1}

ARTICLE 2:
{article_2}

---

INSTRUCTIONS:
1. Infer the common structure used by ARTICLE 1 and ARTICLE 2
2. Rewrite the ORIGINAL ARTICLE using:
   - Similar section flow
   - Similar paragraph depth
   - Similar formatting (headings, bullets, short paragraphs)
3. DO NOT copy text
4. Make it engaging, professional, and SEO-friendly
5. Output clean Markdown
6. Length: 250-400 words

OUTPUT:
Only the rewritten article.
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()
