@echo off
setlocal
cd /d "%~dp0"
python "%~dp0scripts\preview.py"
if errorlevel 1 (
  echo.
  echo Preview could not start. Check Python and the message above.
  pause
)
