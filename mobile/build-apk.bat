@echo off
REM Build APK for direct download on Windows
REM Usage: build-apk.bat

echo.
echo === MPT Warrior APK Builder ===
echo.

REM Check if app.json exists
if not exist "app.json" (
    echo ERROR: app.json not found
    echo Please run this script from the mobile folder
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo.
echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Building APK (this may take a few minutes)...
call npx eas build --platform android --local

echo.
echo ===================================
echo [3/3] Build Complete!
echo ===================================
echo.
echo NEXT STEPS:
echo.
echo 1. Find the APK file in the output folder
echo.
echo 2. To install on Android phone:
echo    - Transfer APK to phone
echo    - Open file manager
echo    - Tap the APK file
echo    - Allow installation from unknown sources
echo    - Tap Install
echo.
echo 3. To share with others:
echo    - Upload APK to Google Drive or Dropbox
echo    - Share the download link
echo    - Users can download and install directly
echo.
echo 4. Alternatively, use Expo public link:
echo    - Run: eas publish
echo    - Share the generated link
echo.
pause
