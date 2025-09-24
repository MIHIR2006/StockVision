from openai import OpenAI
import json
import os
import re
import logging
from typing import Dict, Any, List, Optional
import httpx
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# AI Configuration Constants
OPENAI_MODEL = "gpt-3.5-turbo"
PARSER_MAX_TOKENS = 200
PARSER_TEMPERATURE = 0.3
ANALYSIS_MAX_TOKENS = 300
ANALYSIS_TEMPERATURE = 0.7
DEFAULT_CONFIDENCE = 0.7
DEFAULT_TIME_RANGE = 30  # Default time range for trend analysis in days
JSON_INDENT = 2

class AIStockAnalyzer:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        
        # Initialize OpenAI client with API key
        if self.openai_api_key:
            self.client = OpenAI(api_key=self.openai_api_key)
        else:
            self.client = None
        # Track if JSON mode succeeded once (avoid double attempts later)
        self._json_mode_supported: bool = True
        self.logger = logging.getLogger(__name__)

    # ----------------------------- JSON Parsing Helpers ----------------------------- #
    def _extract_json_from_fenced_block(self, content: str) -> Optional[str]:
        """Extract JSON from markdown fenced code blocks (```json ... ``` or ``` ... ```)."""
        fenced_pattern = re.compile(r"```(?:json)?\s*\n(\{[\s\S]*?\})\s*```", re.IGNORECASE)
        match = fenced_pattern.search(content)
        if match:
            return match.group(1).strip()
        return None

    def _extract_json_with_stack(self, content: str) -> Optional[str]:
        """Robustly extract the first complete top-level JSON object using a brace stack.

        Handles nested braces and ignores braces appearing inside quoted strings.
        Returns the JSON string or None if not found.
        """
        in_string = False
        escape = False
        stack = []
        start_index = None
        for i, ch in enumerate(content):
            if ch == '"' and not escape:
                in_string = not in_string
            if in_string and ch == '\\' and not escape:
                escape = True
                continue
            escape = False
            if in_string:
                continue
            if ch == '{':
                stack.append(ch)
                if start_index is None:
                    start_index = i
            elif ch == '}' and stack:
                stack.pop()
                if not stack and start_index is not None:
                    return content[start_index:i+1]
        return None

    def _safe_json_load(self, json_str: str) -> Optional[Dict[str, Any]]:
        try:
            return json.loads(json_str)
        except Exception:
            return None

    def _parse_ai_response(self, content: str, query: str) -> Dict[str, Any]:
        """Parse AI response and extract structured data using multiple resilient strategies."""
        parsing_attempts: List[str] = []

        # 1. Direct full content if it already looks like JSON
        trimmed = content.strip()
        if trimmed.startswith('{') and trimmed.endswith('}'):
            parsing_attempts.append(trimmed)

        # 2. Fenced code block
        fenced = self._extract_json_from_fenced_block(content)
        if fenced:
            parsing_attempts.append(fenced)

        # 3. Stack-based extraction
        stacked = self._extract_json_with_stack(content)
        if stacked:
            parsing_attempts.append(stacked)

        # 4. Legacy fallback (first/last brace) only if none collected
        if not parsing_attempts and '{' in content and '}' in content:
            first = content.find('{')
            last = content.rfind('}') + 1
            parsing_attempts.append(content[first:last])

        for candidate in parsing_attempts:
            loaded = self._safe_json_load(candidate)
            if isinstance(loaded, dict):
                return loaded

        # Fallback to heuristic analysis
        return self._simple_query_analysis(query)
    
    async def analyze_stock_query(self, query: str, context: Optional[Dict[str, Any]] = None):
        """Analyze user query and determine what stock data to fetch using JSON mode when possible."""
        if not self.client:
            return self._simple_query_analysis(query)

        base_system_prompt = (
            "You are an AI stock analyst assistant. Return ONLY structured JSON describing the user's intent. "
            "Recognize: symbols (list of uppercase stock tickers), action (one of get_price, get_trends, compare_portfolios, analyze_risk, market_summary), "
            "time_range (integer days if the user implies a period, else default), confidence (0-1 float). Provide no commentary."
        )

        user_instruction = f"User Query: {query}\nIf ambiguous, infer best action."

        # Attempt JSON mode first (efficient & guaranteed if supported)
        if self._json_mode_supported:
            try:
                response = self.client.chat.completions.create(
                    model=OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": base_system_prompt},
                        {"role": "user", "content": user_instruction},
                    ],
                    max_tokens=PARSER_MAX_TOKENS,
                    temperature=PARSER_TEMPERATURE,
                    response_format={"type": "json_object"},
                )
                content = response.choices[0].message.content
                loaded = self._safe_json_load(content.strip())
                if isinstance(loaded, dict):
                    return loaded
            except Exception as json_mode_err:
                # Mark unsupported and fall back to prompt-based fenced JSON strategy
                self._json_mode_supported = False
                self.logger.warning(
                    "JSON mode unsupported or failed; falling back to fenced parsing.",
                    exc_info=True
                )

        # Fallback strategy: instruct model to wrap JSON in fenced code block
        try:
            fenced_prompt = (
                base_system_prompt +
                " Output ONLY a markdown fenced JSON block like:\n```json\n{ ... }\n```\nNo extra commentary outside the block."
            )
            response = self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": fenced_prompt},
                    {"role": "user", "content": user_instruction},
                ],
                max_tokens=PARSER_MAX_TOKENS,
                temperature=PARSER_TEMPERATURE,
            )
            content = response.choices[0].message.content
            return self._parse_ai_response(content, query)
        except Exception as e:
            self.logger.error("OpenAI analyze fallback error", exc_info=True)
            return self._simple_query_analysis(query)
    
    def _simple_query_analysis(self, query: str) -> Dict[str, Any]:
        """Simple fallback analysis without AI"""
        query_lower = query.lower()
        
        # Extract common stock symbols
        symbols = []
        common_symbols = ['aapl', 'googl', 'msft', 'amzn', 'tsla', 'meta', 'nvda', 'nflx']
        for symbol in common_symbols:
            if symbol in query_lower:
                symbols.append(symbol.upper())
        
        # Determine action based on keywords
        if any(word in query_lower for word in ['price', 'cost', 'value', 'current']):
            action = "get_price"
        elif any(word in query_lower for word in ['trend', 'analysis', 'performance', 'growth']):
            action = "get_trends"
        elif any(word in query_lower for word in ['compare', 'comparison', 'portfolio']):
            action = "compare_portfolios"
        elif any(word in query_lower for word in ['risk', 'volatility']):
            action = "analyze_risk"
        else:
            action = "market_summary"
        
        return {
            "action": action,
            "symbols": symbols,
            "time_range": DEFAULT_TIME_RANGE,
            "confidence": DEFAULT_CONFIDENCE
        }
    
    # (Original _parse_ai_response replaced by robust version above)
    
    async def generate_response(self, query: str, data: Dict[str, Any]) -> str:
        """Generate natural language response"""
        
        if not self.client:
            return self._generate_simple_response(query, data)
        
        try:
            context = f"""
            User Query: {query}
            Stock Data: {json.dumps(data, indent=JSON_INDENT)}
            
            Provide a helpful, professional response with insights and recommendations.
            """
            
            response = self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional stock analyst providing clear, actionable insights."},
                    {"role": "user", "content": context}
                ],
                max_tokens=ANALYSIS_MAX_TOKENS,
                temperature=ANALYSIS_TEMPERATURE
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            self.logger.error("OpenAI response generation error", exc_info=True)
            return self._generate_simple_response(query, data)
    
    def _generate_simple_response(self, query: str, data: Dict[str, Any]) -> str:
        """Simple response generation without AI"""
        if not data:
            return "I couldn't find the requested stock data. Please try asking about specific stock symbols like AAPL, GOOGL, or TSLA."
        
        response_parts = []
        
        for key, value in data.items():
            if isinstance(value, dict):
                if 'price' in value:
                    response_parts.append(f"{key}: Current price is ${value['price']:.2f}")
                elif 'change' in value:
                    change = value['change']
                    direction = "up" if change > 0 else "down"
                    response_parts.append(f"{key} is {direction} by {abs(change):.2f}%")
            else:
                response_parts.append(f"{key}: {value}")
        
        if response_parts:
            return "Here's what I found:\n\n" + "\n".join(response_parts)
        else:
            return "I found some data but couldn't format it properly. Please try rephrasing your question."

# Stock data fetching functions
async def get_real_time_stock_data(symbol: str) -> Dict[str, Any]:
    """Fetch real-time stock data"""
    try:
        # Using Alpha Vantage API (free tier available)
        api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        if not api_key:
            # Mock data for testing
            return {
                "symbol": symbol,
                "price": 150.25,
                "change": 2.5,
                "change_percent": 1.69,
                "volume": 1000000,
                "market_cap": "2.5T",
                "note": "Demo data - add ALPHA_VANTAGE_API_KEY for real data"
            }
        
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()  # Raises exception for HTTP errors
            data = response.json()
        
        if "Global Quote" in data:
            quote = data["Global Quote"]
            return {
                "symbol": symbol,
                "price": float(quote["05. price"]),
                "change": float(quote["09. change"]),
                "change_percent": float(quote["10. change percent"].replace("%", "")),
                "volume": int(quote["06. volume"]),
                "high": float(quote["03. high"]),
                "low": float(quote["04. low"])
            }
        else:
            raise Exception("Invalid API response")
            
    except Exception as e:
        logger.error(f"Stock data error for {symbol}: {e}", exc_info=True)
        # Return mock data on error
        return {
            "symbol": symbol,
            "price": 100.00,
            "change": 0.0,
            "change_percent": 0.0,
            "volume": 0,
            "error": f"Could not fetch real data for {symbol}"
        }

async def get_stock_trends(symbol: str, days: int = 30) -> Dict[str, Any]:
    """Get stock trend analysis"""
    try:
        # For demo purposes, return mock trend data
        import random
        
        trend_data = []
        base_price = 100
        for i in range(days):
            price = base_price + random.uniform(-5, 5)
            trend_data.append({
                "date": (datetime.now() - timedelta(days=days-i)).strftime("%Y-%m-%d"),
                "price": round(price, 2)
            })
            base_price = price
        
        return {
            "symbol": symbol,
            "period": f"{days} days",
            "trend_data": trend_data,
            "trend_direction": "upward" if trend_data[-1]["price"] > trend_data[0]["price"] else "downward",
            "volatility": "moderate"
        }
        
    except Exception as e:
        return {"error": f"Could not analyze trends for {symbol}: {e}"}