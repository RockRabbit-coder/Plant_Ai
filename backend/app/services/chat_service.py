import os
import re
import httpx
from typing import List, Optional
from app.core.config import settings
from app.schemas.schemas import ChatMessage, ChatResponse, ReferenceItem
from app.ml.labels import DISEASE_KNOWLEDGE_BASE

AGRI_SYSTEM_PROMPT = """You are PlantCare AI's expert agricultural extension specialist and agronomist.
Your goal is to assist farmers, gardeners, and agronomists with evidence-based plant health advice.
Always emphasize:
1. Cultural sanitation and integrated pest management (IPM) practices first.
2. Clear symptom identification and distinction between fungal, bacterial, viral, and pest causes.
3. Safe environmental stewardship: do not arbitrarily prescribe toxic chemical concoctions without advising consultation with local certified agronomists.
4. If asked about a specific disease prediction, ground your explanation in scientifically verified research (e.g., Cornell, UC IPM, FAO).
5. If the user asks in Hindi, Tamil, Telugu, or Kannada, respond helpfully in that language or bilingual with English plant terms."""

def search_local_knowledge(query: str, current_scan_id: Optional[str] = None) -> tuple[str, List[ReferenceItem]]:
    """Knowledge base search fallback grounded in verified agricultural literature."""
    q = query.lower()
    matched_diseases = []
    
    for raw_label, data in DISEASE_KNOWLEDGE_BASE.items():
        score = 0
        crop_low = data["crop"].lower()
        disease_low = data["disease"].lower()
        
        if crop_low in q:
            score += 2
        if disease_low in q:
            score += 3
        for sym in data.get("symptoms", []):
            if any(term in sym.lower() for term in q.split() if len(term) > 3):
                score += 1
                
        if score > 0:
            matched_diseases.append((score, data))
            
    matched_diseases.sort(key=lambda x: x[0], reverse=True)
    
    if matched_diseases:
        top_data = matched_diseases[0][1]
        reply_lines = [
            f"**Agronomic Guidance for {top_data['crop']} ({top_data['disease']})**\n",
            f"*Scientific identification:* {top_data.get('scientific_name', 'N/A')}",
            f"*Key Symptoms:* {'; '.join(top_data.get('symptoms', [])[:3])}.",
            f"\n**Immediate Cultural Action:**",
            f"- {top_data.get('management', ['Consult agricultural advisor'])[0]}",
            f"- Prevention: {top_data.get('prevention', ['Ensure proper airflow and crop rotation'])[0]}",
            f"\n*Favorable conditions:* {top_data.get('causes', 'Environmental stress')}",
            "\n*Note: For commercial crop treatment or chemical application, verify with your regional Agricultural Extension Service.*"
        ]
        refs = [ReferenceItem(title=r["title"], url=r["url"]) for r in top_data.get("references", [])]
        return "\n".join(reply_lines), refs
        
    # General helpful response if no specific crop/disease matched
    general_reply = (
        "Hello! I am your PlantCare Agricultural Assistant. I can help diagnose symptoms, explain disease predictions, "
        "and suggest preventive sanitation techniques for crops including Tomato, Potato, Corn, Apple, Grape, Pepper, and Cherry.\n\n"
        "To get targeted advice, please mention:\n"
        "1. The crop type (e.g., *Tomato*, *Potato*, *Corn*)\n"
        "2. The visible symptoms (e.g., *yellow spots with concentric rings*, *white powdery mold*, *curling leaves*)\n"
        "3. Leaf wetness or weather conditions in your area."
    )
    return general_reply, [
        ReferenceItem(title="FAO Plant Production & Integrated Pest Management", url="https://fao.org"),
        ReferenceItem(title="UC Davis IPM Plant Health Guidelines", url="https://ipm.ucanr.edu")
    ]

async def process_chat_message(
    message: str,
    language: str = "en",
    current_scan_id: Optional[str] = None,
    history: List[ChatMessage] = []
) -> ChatResponse:
    """Process message using configured LLM API (Gemini/OpenAI) or local verified botanical engine."""
    
    # 1. Check Gemini API
    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "system_instruction": {"parts": [{"text": AGRI_SYSTEM_PROMPT}]},
                "contents": [
                    {"role": "user" if m.role == "user" else "model", "parts": [{"text": m.content}]}
                    for m in history[-4:]
                ] + [{"role": "user", "parts": [{"text": f"Language: {language}\n\nQuestion: {message}"}]}]
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    _, refs = search_local_knowledge(message)
                    return ChatResponse(
                        reply=reply_text,
                        source_type="gemini_generative",
                        relevant_references=refs
                    )
        except Exception as e:
            print(f"[Chatbot] Gemini API attempt failed ({e}), falling back to verified agricultural engine.")
            
    # 2. Check OpenAI API
    if settings.OPENAI_API_KEY:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            messages = [{"role": "system", "content": AGRI_SYSTEM_PROMPT}]
            for m in history[-4:]:
                messages.append({"role": m.role, "content": m.content})
            messages.append({"role": "user", "content": f"Language: {language}\n\nQuestion: {message}"})
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={"model": "gpt-4o-mini", "messages": messages, "max_tokens": 500}
                )
                if res.status_code == 200:
                    data = res.json()
                    reply_text = data["choices"][0]["message"]["content"]
                    _, refs = search_local_knowledge(message)
                    return ChatResponse(
                        reply=reply_text,
                        source_type="openai_generative",
                        relevant_references=refs
                    )
        except Exception as e:
            print(f"[Chatbot] OpenAI API attempt failed ({e}), falling back to verified agricultural engine.")
            
    # 3. Verified Agronomic Knowledge Engine (Guaranteed zero-cost, offline-capable fallback)
    reply, refs = search_local_knowledge(message, current_scan_id)
    return ChatResponse(
        reply=reply,
        source_type="botanical_knowledge_engine",
        relevant_references=refs
    )
