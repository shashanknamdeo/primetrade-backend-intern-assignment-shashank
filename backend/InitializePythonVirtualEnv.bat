@echo off
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo   [OK] Backend Python virtual environment activated.
) else (
    echo   [ERROR] No virtual environment found in current directory.
)
