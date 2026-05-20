@echo off
REM Migria SaaS - arranque rapido en Windows
REM Doble clic para ejecutar.

cd /d "%~dp0"

echo.
echo ========================================
echo   Migria SaaS - Arranque local
echo ========================================
echo.

REM Si node_modules existe pero no tiene 'next', esta a medias.
if exist node_modules\.bin\next.cmd goto :run
if exist node_modules (
  echo Limpiando node_modules incompleto...
  rmdir /s /q node_modules 2>nul
  if exist package-lock.json del /q package-lock.json 2>nul
)

echo Instalando dependencias por primera vez...
echo Esto tarda entre 1 y 3 minutos.
echo.
call npm install --no-audit --no-fund --legacy-peer-deps
if errorlevel 1 (
  echo.
  echo [ERROR] npm install ha fallado. Revisa que tienes Node.js 20+ instalado.
  pause
  exit /b 1
)

:run
echo.
echo ========================================
echo   Servidor en http://localhost:3000
echo   Pulsa Ctrl+C para detener.
echo ========================================
echo.

call npm run dev
