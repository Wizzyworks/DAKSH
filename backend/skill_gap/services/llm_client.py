"""
Unified LLM Client Service for DAKSH.
Dynamically resolves provider, base_url, and model based on the API key prefix in .env:
1. xAI (Grok): Keys starting with 'xai-' -> base_url='https://api.x.ai/v1', model='grok-2-latest' or 'grok-beta'
2. Groq: Keys starting with 'gsk_' -> base_url='https://api.groq.com/openai/v1', model='llama-3.3-70b-versatile'
3. OpenAI: Keys starting with 'sk-' -> base_url='https://api.openai.com/v1', model='gpt-4o-mini'
"""

import os
import re
import json
import logging
from typing import Tuple, Optional, Any
from django.conf import settings
from groq import Groq

logger = logging.getLogger(__name__)


def get_llm_client_and_model() -> Tuple[Optional[Groq], Optional[str]]:
    """
    Returns (client, model_name) configured for the detected LLM provider.
    """
    api_key = (
        getattr(settings, 'GROQ_API_KEY', '') or
        os.getenv('GROQ_API_KEY', '') or
        getattr(settings, 'XAI_API_KEY', '') or
        os.getenv('XAI_API_KEY', '') or
        getattr(settings, 'OPENAI_API_KEY', '') or
        os.getenv('OPENAI_API_KEY', '')
    ).strip()

    configured_model = (
        getattr(settings, 'GROQ_MODEL', '') or
        os.getenv('GROQ_MODEL', '')
    ).strip()

    custom_base_url = (
        getattr(settings, 'LLM_BASE_URL', '') or
        os.getenv('LLM_BASE_URL', '')
    ).strip()

    if not api_key:
        logger.warning("[DAKSH-LLM] No LLM API key detected in settings or environment. AI features will use smart dynamic fallback pool.")
        return None, None

    # Auto-detect provider based on key prefix or explicit base_url
    if custom_base_url:
        base_url = custom_base_url
        model = configured_model or 'llama-3.3-70b-versatile'
    elif api_key.startswith('xai-'):
        base_url = 'https://api.x.ai/v1'
        # If user configured a groq model name (e.g. llama) while using xai key, use an xAI model
        if not configured_model or 'llama' in configured_model.lower():
            model = 'grok-2-latest'
        else:
            model = configured_model
        logger.info(f"[DAKSH-LLM] Auto-detected xAI (Grok) key. Using endpoint {base_url} with model '{model}'")
    elif api_key.startswith('gsk_'):
        base_url = 'https://api.groq.com/openai/v1'
        model = configured_model or 'llama-3.3-70b-versatile'
        logger.info(f"[DAKSH-LLM] Auto-detected Groq key. Using endpoint {base_url} with model '{model}'")
    elif api_key.startswith('sk-'):
        base_url = 'https://api.openai.com/v1'
        model = configured_model or 'gpt-4o-mini'
        logger.info(f"[DAKSH-LLM] Auto-detected OpenAI key. Using endpoint {base_url} with model '{model}'")
    else:
        # Default fallback to Groq endpoint
        base_url = 'https://api.groq.com/openai/v1'
        model = configured_model or 'llama-3.3-70b-versatile'
        logger.info(f"[DAKSH-LLM] Using base_url {base_url} with model '{model}'")

    try:
        client = Groq(api_key=api_key, base_url=base_url)
        return client, model
    except Exception as e:
        logger.error(f"[DAKSH-LLM] Failed to initialize client for {base_url}: {e}")
        return None, None


def call_chat_completion(client: Groq, model: str, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    """
    Executes a chat completion call with automatic fallback if json_object format is unsupported.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.warning(f"[DAKSH-LLM] json_object call failed ({e}). Retrying without response_format...")
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content


def parse_json_safely(raw_text: str) -> Any:
    """
    Cleans markdown code fences and parses JSON payload reliably.
    """
    cleaned = re.sub(r'^```(?:json)?\s*', '', raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r'\s*```$', '', cleaned.strip(), flags=re.MULTILINE)
    return json.loads(cleaned)

