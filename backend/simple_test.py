#!/usr/bin/env python3
"""
Simple server health test
"""
import httpx
import asyncio

async def test_server():
    try:
        async with httpx.AsyncClient() as client:
            print(" Testing server health...")
            response = await client.get("http://127.0.0.1:8000/")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            
            print("\n Testing API docs...")
            response = await client.get("http://127.0.0.1:8000/docs")
            print(f"API Docs Status: {response.status_code}")
            
            print("\n Testing market overview...")
            response = await client.get("http://127.0.0.1:8000/api/market/overview")
            print(f"Market Overview Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Market data keys: {list(data.keys())}")
            
            print("\n Basic server tests completed!")
            
    except Exception as e:
        print(f" Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_server())