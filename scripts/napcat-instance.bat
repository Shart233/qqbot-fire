@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ============================================================
REM  NapCat 单实例启动器 (被 napcat-multi.bat 或 BotConsole 调用)
REM
REM  用法: napcat-instance.bat <NapCat目录> <QQ号> <工作目录> [WebUI端口]
REM
REM  参数:
REM    1. NapCat.Shell 安装目录 (如 C:\Users\Lenovo\Desktop\NapCat.Shell)
REM    2. QQ 号 (用于快速登录 -q)
 REM    3. 工作目录 (NAPCAT_WORKDIR, 每个实例独立)
REM    4. [可选] WebUI 端口 (默认自动分配)
REM ============================================================

if "%~1"=="" (
    echo 用法: napcat-instance.bat ^<NapCat目录^> ^<QQ号^> ^<工作目录^> [WebUI端口]
    echo 示例: napcat-instance.bat "C:\NapCat.Shell" 123456 "C:\NapCat\inst1" 6101
    exit /b 1
)
if "%~2"=="" (
    echo 错误: 请指定 QQ 号
    exit /b 1
)
if "%~3"=="" (
    echo 错误: 请指定工作目录
    exit /b 1
)

set "NAPCAT_DIR=%~1"
set "QQ_UIN=%~2"
set "WORK_DIR=%~3"
set "WEBUI_PORT=%~4"

REM ---- 校验 NapCat 目录 ----
if not exist "%NAPCAT_DIR%\napcat.mjs" (
    echo 错误: NapCat 目录无效，找不到 napcat.mjs: %NAPCAT_DIR%
    exit /b 1
)
if not exist "%NAPCAT_DIR%\NapCatWinBootMain.exe" (
    echo 错误: 找不到 NapCatWinBootMain.exe: %NAPCAT_DIR%
    exit /b 1
)

REM ---- 创建工作目录和 config 子目录 ----
if not exist "%WORK_DIR%" mkdir "%WORK_DIR%"
if not exist "%WORK_DIR%\config" mkdir "%WORK_DIR%\config"

REM ---- 设置环境变量 ----
set "NAPCAT_WORKDIR=%WORK_DIR%"
set "NAPCAT_PATCH_PACKAGE=%NAPCAT_DIR%\qqnt.json"
set "NAPCAT_LOAD_PATH=%NAPCAT_DIR%\loadNapCat.js"
set "NAPCAT_INJECT_PATH=%NAPCAT_DIR%\NapCatWinBootHook.dll"
set "NAPCAT_LAUNCHER_PATH=%NAPCAT_DIR%\NapCatWinBootMain.exe"
set "NAPCAT_MAIN_PATH=%NAPCAT_DIR%\napcat.mjs"

if not "%WEBUI_PORT%"=="" (
    set "NAPCAT_WEBUI_PREFERRED_PORT=%WEBUI_PORT%"
)

REM ---- 从注册表查找 QQ.exe ----
for /f "tokens=2*" %%a in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\QQ" /v "UninstallString" 2^>nul') do (
    set "RetString=%%~b"
    goto :found_qq
)
echo 错误: 未找到 QQ 安装路径，请确认 QQ 已安装
exit /b 1

:found_qq
for %%a in ("%RetString%") do (
    set "pathWithoutUninstall=%%~dpa"
)
set "QQPath=%pathWithoutUninstall%QQ.exe"

if not exist "%QQPath%" (
    echo 错误: QQ.exe 不存在: %QQPath%
    exit /b 1
)

REM ---- 生成 loadNapCat.js ----
set "NAPCAT_MAIN_SLASH=%NAPCAT_MAIN_PATH:\=/%"
echo (async () =^> {await import("file:///%NAPCAT_MAIN_SLASH%")})() > "%NAPCAT_LOAD_PATH%"

REM ---- 启动 ----
echo [NapCat] 启动实例: QQ=%QQ_UIN% 工作目录=%WORK_DIR%
if not "%WEBUI_PORT%"=="" echo [NapCat] WebUI 端口: %WEBUI_PORT%

"%NAPCAT_LAUNCHER_PATH%" "%QQPath%" "%NAPCAT_INJECT_PATH%" %QQ_UIN%

endlocal
