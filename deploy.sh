#!/bin/bash

# Gyors deploy script
# Használat: ./deploy.sh

echo "🚀 Walter & Walter Kft. Website Deployment"
echo "=========================================="
echo ""

# Ellenőrizzük, hogy melyik platform van telepítve
if command -v netlify &> /dev/null; then
    echo "✅ Netlify CLI találva"
    echo "Deploy Netlify-ra? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        netlify deploy --prod
    fi
elif command -v surge &> /dev/null; then
    echo "✅ Surge CLI találva"
    echo "Deploy Surge-ra? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        surge . walter-walter.surge.sh
    fi
else
    echo "❌ Nincs CLI telepítve"
    echo ""
    echo "Telepítés:"
    echo "  Netlify: npm install -g netlify-cli"
    echo "  Surge:   npm install -g surge"
    echo ""
    echo "Vagy használd a webes felületet:"
    echo "  Netlify: https://app.netlify.com/drop"
    echo "  Vercel:  https://vercel.com"
fi

