#!/usr/bin/env python3
"""
Simple test script for portfolio endpoints
Run this after starting the backend server to test the API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_portfolios():
    print("🚀 Testing Portfolio API Endpoints")
    print("=" * 50)
    
    # Test 1: Get all portfolios
    print("\n1. Getting all portfolios...")
    try:
        response = requests.get(f"{BASE_URL}/api/portfolios/")
        if response.status_code == 200:
            portfolios = response.json()
            print(f"✅ Found {len(portfolios)} portfolios")
            for p in portfolios:
                print(f"   - {p['name']}: ${p['total_value']:,.2f}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get portfolio analytics
    print("\n2. Getting portfolio analytics...")
    try:
        response = requests.get(f"{BASE_URL}/api/portfolios/analytics/summary")
        if response.status_code == 200:
            analytics = response.json()
            print(f"✅ Combined value: ${analytics['combined_value']:,.2f}")
            print(f"   Best performer: {analytics['best_performer']['name']} ({analytics['best_performer']['gain_loss_percent']:.2f}%)")
            print(f"   Worst performer: {analytics['worst_performer']['name']} ({analytics['worst_performer']['gain_loss_percent']:.2f}%)")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Create a new portfolio
    print("\n3. Creating a new portfolio...")
    try:
        new_portfolio = {
            "name": "Test Portfolio",
            "description": "Created by test script"
        }
        response = requests.post(f"{BASE_URL}/api/portfolios/", json=new_portfolio)
        if response.status_code == 200:
            portfolio = response.json()
            portfolio_id = portfolio['id']
            print(f"✅ Created portfolio: {portfolio['name']} (ID: {portfolio_id})")
            
            # Test 4: Get portfolio history
            print(f"\n4. Getting history for portfolio {portfolio_id}...")
            response = requests.get(f"{BASE_URL}/api/portfolios/{portfolio_id}/history?days=30")
            if response.status_code == 200:
                history = response.json()
                print(f"✅ Retrieved {len(history)} history records")
            else:
                print(f"❌ Failed to get history: {response.status_code}")
            
            # Test 5: Delete the test portfolio
            print(f"\n5. Deleting test portfolio {portfolio_id}...")
            response = requests.delete(f"{BASE_URL}/api/portfolios/{portfolio_id}")
            if response.status_code == 200:
                print("✅ Portfolio deleted successfully")
            else:
                print(f"❌ Failed to delete: {response.status_code}")
        else:
            print(f"❌ Failed to create: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 6: Portfolio comparison
    print("\n6. Testing portfolio comparison...")
    try:
        # Get portfolios first
        response = requests.get(f"{BASE_URL}/api/portfolios/")
        if response.status_code == 200:
            portfolios = response.json()
            if len(portfolios) >= 2:
                comparison_data = {
                    "portfolios": [portfolios[0]['id'], portfolios[1]['id']],
                    "time_range": "90d",
                    "metrics": ["value", "returns"]
                }
                response = requests.post(f"{BASE_URL}/api/portfolios/compare", json=comparison_data)
                if response.status_code == 200:
                    comparison = response.json()
                    print(f"✅ Comparison data generated for {len(comparison['portfolios'])} portfolios")
                    print(f"   Chart data points: {len(comparison['comparison_data'])}")
                else:
                    print(f"❌ Failed comparison: {response.status_code}")
            else:
                print("⚠️  Need at least 2 portfolios for comparison")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Portfolio API testing completed!")

if __name__ == "__main__":
    test_portfolios()