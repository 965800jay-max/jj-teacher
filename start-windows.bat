@echo off
cd /d "%~dp0"
npm install
npm run build
start "Julebu Local Site" cmd /k "npm run local"
start "" "http://127.0.0.1:5188/"
npx --yes localtunnel --port 5188 --subdomain julebu-jay-private-833234
