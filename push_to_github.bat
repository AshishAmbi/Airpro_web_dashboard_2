@echo off
set GIT_PATH="D:\Git\cmd\git.exe"

if not exist %GIT_PATH% (
    echo Git executable not found at expected location: D:\Git\cmd\git.exe
    echo Please verify your installation path.
    pause
    exit /b
)

echo Found Git at D:\Git\cmd\git.exe!
echo Initializing repository...

%GIT_PATH% init
%GIT_PATH% remote add origin https://github.com/AshishAmbi/Airpro_web_dashboard_2.git
%GIT_PATH% add .
%GIT_PATH% commit -m "Initial commit of Premium Airpro Dashboard"
%GIT_PATH% branch -M main
%GIT_PATH% push -u origin main

echo Done!

