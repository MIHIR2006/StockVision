import openai
import json
import os
from typing import Dict, Any, List
import requests
from datetime import datetime, timedelta

class AIStockAnalyzer:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
    
    async def analyze_stock_query(self, query: str, context: Dict[str, Any] = None):
        """Analyze user query and determine what stock data to fetch"""
        
        if not self.openai_api_key:
            # Fallback to simple keyword matching if no OpenAI key
            return self._simple_query_analysis(query)
        
        try:
            system_prompt = """
            You are an AI stock analyst assistant. Analyze the user's query and extract:
            1. Stock symbols mentioned (e.g., AAPL, TSLA, GOOGL)
            2. Type of analysis needed
            3. Time ranges if mentioned
            4. Return structured JSON response
            
            Available actions: "get_price", "get_trends", "compare_portfolios", "analyze_risk", "market_summary"
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze this query: {query}"}
                ],
                max_tokens=200,
                temperature=0.3
            )
            
            # Parse the response and extract structured data
            content = response.choices[0].message.content
            return self._parse_ai_response(content, query)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
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
            "time_range": 30,
            "confidence": 0.7
        }
    
    def _parse_ai_response(self, content: str, query: str) -> Dict[str, Any]:
        """Parse AI response and extract structured data"""
        try:
            # Try to extract JSON from response
            if '{' in content and '}' in content:
                start = content.find('{')
                end = content.rfind('}') + 1
                json_str = content[start:end]
                return json.loads(json_str)
        except:
            pass
        
        # Fallback to simple analysis
        return self._simple_query_analysis(query)
    
    async def generate_response(self, query: str, data: Dict[str, Any]) -> str:
        """Generate natural language response"""
        
        if not self.openai_api_key:
            return self._generate_simple_response(query, data)
        
        try:
            context = f"""
            User Query: {query}
            Stock Data: {json.dumps(data, indent=2)}
            
            Provide a helpful, professional response with insights and recommendations.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional stock analyst providing clear, actionable insights."},
                    {"role": "user", "content": context}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI response error: {e}")
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
        response = requests.get(url)
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
        print(f"Stock data error for {symbol}: {e}")
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