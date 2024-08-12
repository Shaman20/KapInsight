# analyzer.py
import requests
from bs4 import BeautifulSoup
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.sentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import json
import os
from urllib.parse import urlparse
import re

# Download necessary NLTK data
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)

API_KEY = 'AIzaSyBCY9c3InjO535IYDYbyLEOtC-3J_uL_kY'

def scrape_website(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)
    return response.text, response.elapsed.total_seconds()

def analyze_content(soup, text):
    stop_words = set(stopwords.words('english'))
    words = [word.lower() for word in word_tokenize(text) if word.isalnum() and word.lower() not in stop_words]
    
    freq_dist = FreqDist(words)
    common_words = freq_dist.most_common(10)
    
    sia = SentimentIntensityAnalyzer()
    sentiment_scores = sia.polarity_scores(text)
    
    blob = TextBlob(text)
    topics = blob.noun_phrases[:10]
    
    return {
        "common_words": common_words,
        "sentiment": sentiment_scores,
        "topics": topics
    }

def analyze_structure(soup):
    nav_links = [a['href'] for a in soup.find_all('a', href=True) if a.text.strip()]
    headings = {f"h{i}": len(soup.find_all(f'h{i}')) for i in range(1, 7)}
    design_patterns = {
        "has_header": bool(soup.find('header')),
        "has_footer": bool(soup.find('footer')),
        "has_sidebar": bool(soup.find(['aside', 'div class*="sidebar"']))
    }
    return {
        "nav_links": nav_links[:10],
        "headings": headings,
        "design_patterns": design_patterns
    }

def analyze_seo(soup):
    title = soup.title.string if soup.title else None
    meta_description = soup.find('meta', attrs={'name': 'description'})
    meta_description = meta_description['content'] if meta_description else None
    headings = {f"h{i}": [h.text for h in soup.find_all(f'h{i}')] for i in range(1, 7)}
    images = soup.find_all('img')
    images_with_alt = sum(1 for img in images if img.get('alt'))
    return {
        "title": title,
        "meta_description": meta_description,
        "headings": headings,
        "images_with_alt": f"{images_with_alt}/{len(images)}"
    }

def analyze_technical(soup, load_time):
    technologies = []
    if soup.find(text=re.compile('node.js')):
        technologies.append('node.js')
    if soup.find(text=re.compile('contentful')):
        technologies.append('contentful')
    if soup.find(text=re.compile('react')):
        technologies.append('react')
    if soup.find(text=re.compile('nginx')):
        technologies.append('nginx')
    if soup.find(text=re.compile('next.js')):
        technologies.append('next.js')
    scripts = [script['src'] for script in soup.find_all('script', src=True)]
    return {
        "technologies": technologies,
        "scripts": scripts[:10],
        "load_time": f"{load_time:.2f} seconds"
    }

def analyze_compliance(soup, url):
    privacy_policy = bool(soup.find('a', text=re.compile('privacy', re.I)))
    terms_of_service = bool(soup.find('a', text=re.compile('terms', re.I)))
    aria_labels = len(soup.find_all(attrs={"aria-label": True}))
    return {
        "has_privacy_policy": privacy_policy,
        "has_terms_of_service": terms_of_service,
        "aria_labels_count": aria_labels
    }

def fetch_core_web_vitals(url):
    api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&key={API_KEY}"
    response = requests.get(api_url)
    data = response.json()
    
    if 'lighthouseResult' in data:
        result = data['lighthouseResult']
        metrics = result.get('audits', {})
        core_web_vitals = {
            'LCP': metrics.get('largest-contentful-paint', {}).get('displayValue'),
            'FID': metrics.get('max-potential-fid', {}).get('displayValue'),
            'CLS': metrics.get('cumulative-layout-shift', {}).get('displayValue')
        }
        return core_web_vitals
    else:
        return {"error": "Unable to fetch Core Web Vitals"}

def analyze_website(url):
    html_content, load_time = scrape_website(url)
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()
    
    content_analysis = analyze_content(soup, text)
    structure_analysis = analyze_structure(soup)
    seo_analysis = analyze_seo(soup)
    technical_analysis = analyze_technical(soup, load_time)
    compliance_analysis = analyze_compliance(soup, url)
    core_web_vitals = fetch_core_web_vitals(url)
    
    return {
        "content_analysis": content_analysis,
        "structure_analysis": structure_analysis,
        "seo_analysis": seo_analysis,
        "technical_analysis": technical_analysis,
        "compliance_analysis": compliance_analysis,
        "core_web_vitals": core_web_vitals
    }

def save_results_to_file(url, results):
    if not os.path.exists('website_analysis_results'):
        os.makedirs('website_analysis_results')
    
    domain = urlparse(url).netloc
    filename = f"website_analysis_results/{domain}_analysis.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"Analysis results have been saved to {filename}")
