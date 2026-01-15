#!/bin/bash

# Quiz Error Debug & Fix Script
# Usage: Run this to diagnose quiz issues

echo "🔍 QUIZ ERROR DIAGNOSTIC TOOL"
echo "=============================="
echo ""

# Check if .env is configured
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    exit 1
fi

echo "✅ Checking configuration..."
echo ""

# Test API endpoints
TOKEN=$1  # Pass token as first argument

if [ -z "$TOKEN" ]; then
    echo "Usage: ./quiz-debug.sh YOUR_AUTH_TOKEN"
    echo ""
    echo "Steps to get token:"
    echo "1. Login to https://mpt-warrior.vercel.app"
    echo "2. Open browser console (F12)"
    echo "3. Run: localStorage.getItem('mpt_token')"
    echo "4. Copy token and run: ./quiz-debug.sh YOUR_TOKEN"
    exit 1
fi

BASE_URL="https://mpt-warrior.vercel.app"

echo "Testing Quiz API Endpoints..."
echo ""

# Test module 1 quiz
echo "Testing Module 1 Quiz..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/academy/quiz/module-1" | jq . || echo "Error fetching quiz"

echo ""
echo "Done!"
