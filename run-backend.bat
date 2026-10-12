@echo off
echo ========================================================
echo   Launching SmartCanteen Spring Boot Backend
echo   URL: http://localhost:8081/api/health
echo ========================================================
echo.
cd backend
mvn spring-boot:run
pause

