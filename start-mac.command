#!/bin/zsh
cd "$(dirname "$0")"
npm install
npm run build
npm run local &
SITE_PID=$!
sleep 2
open "http://127.0.0.1:5188/"
npx --yes localtunnel --port 5188 --subdomain julebu-jay-private-833234
kill "$SITE_PID" 2>/dev/null
