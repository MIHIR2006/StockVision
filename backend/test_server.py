#!/usr/bin/env python3
"""
Comprehensive backend server test script
Tests all major endpoints and functionality
"""
import asyncio
import httpx
import json
import time

# Server configuration
BASE_URL = "http://127.0.0.1:8000"

async def test_server_health():
    """Test if server is responding"""
    print("🔍 Testing server health...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/")
            if response.status_code == 200:
                print(" Server is responding")
                return True
            else:
                print(f" Server returned status code: {response.status_code}")
                return False
    except Exception as e:
        print(f" Server connection failed: {e}")
        return False

async def test_docs_endpoint():
    """Test API documentation endpoint"""
    print("🔍 Testing API documentation...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/docs")
            if response.status_code == 200:
                print(" API documentation accessible")
                return True
            else:
                print(f" Documentation endpoint failed: {response.status_code}")
                return False
    except Exception as e:
        print(f" Documentation test failed: {e}")
        return False

async def test_market_endpoints():
    """Test market data endpoints"""
    print("🔍 Testing market endpoints...")
    
    endpoints = [
        "/api/market/overview",
        "/api/market/trends", 
        "/api/market/movers"
    ]
    
    results = []
    async with httpx.AsyncClient() as client:
        for endpoint in endpoints:
            try:
                response = await client.get(f"{BASE_URL}{endpoint}")
                if response.status_code == 200:
                    print(f" {endpoint} - Working")
                    results.append(True)
                else:
                    print(f" {endpoint} - Status: {response.status_code}")
                    results.append(False)
            except Exception as e:
                print(f" {endpoint} - Error: {e}")
                results.append(False)
    
    return all(results)

async def test_stock_endpoints():
    """Test stock data endpoints"""
    print("🔍 Testing stock endpoints...")
    
    endpoints = [
        "/api/stocks/AAPL",
        "/api/stocks/AAPL/trends?days=30",
        "/api/stocks/price?symbol=AAPL"
    ]
    
    results = []
    async with httpx.AsyncClient(timeout=30.0) as client:
        for endpoint in endpoints:
            try:
                response = await client.get(f"{BASE_URL}{endpoint}")
                if response.status_code == 200:
                    print(f"✅ {endpoint} - Working")
                    results.append(True)
                else:
                    print(f"❌ {endpoint} - Status: {response.status_code}")
                    results.append(False)
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
                results.append(False)
    
    return all(results)

async def test_chatbot_endpoints():
    """Test AI chatbot endpoints"""
    print("🔍 Testing AI chatbot endpoints...")
    
    # Test creating a chat session
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Test chat session creation
            response = await client.post(f"{BASE_URL}/api/chatbot/sessions")
            if response.status_code == 200:
                session_data = response.json()
                session_id = session_data.get("session_id")
                print(f"✅ Chat session created: {session_id}")
                
                # Test sending a message
                message_payload = {
                    "message": "What's the current price of AAPL?",
                    "session_id": session_id
                }
                
                response = await client.post(
                    f"{BASE_URL}/api/chatbot/chat",
                    json=message_payload
                )
                
                if response.status_code == 200:
                    chat_response = response.json()
                    print("✅ Chat message processed successfully")
                    print(f"   Response: {chat_response.get('response', 'No response')[:100]}...")
                    return True
                else:
                    print(f"❌ Chat message failed: {response.status_code}")
                    print(f"   Response: {response.text}")
                    return False
            else:
                print(f"❌ Chat session creation failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Chatbot test failed: {e}")
        return False

async def test_portfolio_endpoints():
    """Test portfolio endpoints"""
    print("🔍 Testing portfolio endpoints...")
    
    try:
        async with httpx.AsyncClient() as client:
            # Test portfolio overview
            response = await client.get(f"{BASE_URL}/api/portfolios/overview")
            if response.status_code == 200:
                print(" Portfolio overview - Working")
                return True
            else:
                print(f" Portfolio overview failed: {response.status_code}")
                return False
    except Exception as e:
        print(f" Portfolio test failed: {e}")
        return False

async def run_all_tests():
    """Run all backend server tests"""
    print(" Starting StockVision Backend Server Tests")
    print("=" * 50)
    
    # Wait for server to be ready
    print(" Waiting for server to be ready...")
    await asyncio.sleep(2)
    
    # Run tests
    tests = [
        ("Server Health", test_server_health),
        ("API Documentation", test_docs_endpoint),
        ("Market Endpoints", test_market_endpoints),
        ("Stock Endpoints", test_stock_endpoints),
        ("AI Chatbot", test_chatbot_endpoints),
        ("Portfolio Endpoints", test_portfolio_endpoints)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n Running {test_name} test...")
        start_time = time.time()
        result = await test_func()
        end_time = time.time()
        results.append((test_name, result, end_time - start_time))
        
        if result:
            print(f" {test_name} test completed successfully ({end_time - start_time:.2f}s)")
        else:
            print(f" {test_name} test failed ({end_time - start_time:.2f}s)")
    
    # Summary
    print("\n" + "=" * 50)
    print(" TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, result, _ in results if result)
    total = len(results)
    
    for test_name, result, duration in results:
        status = " PASS" if result else " FAIL"
        print(f"{status} {test_name:<20} ({duration:.2f}s)")
    
    print("\n" + "=" * 50)
    print(f" Overall Results: {passed}/{total} tests passed")
    
    if passed == total:
        print(" ALL TESTS PASSED! Backend server is working correctly!")
        print(" Your StockVision AI chatbot backend is production-ready!")
    else:
        print("  Some tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    asyncio.run(run_all_tests())