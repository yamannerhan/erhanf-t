@echo off
cd /d "%~dp0"
echo ERHAN FIT - Web sunucusu baslatiliyor...
echo Tarayicida ac: http://localhost:8082
npx expo start --web --port 8082 --clear
