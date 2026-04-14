@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ============================================================
REM  QQBot-Fire NapCat 多开启动器
REM
REM  读取 napcat-instances.conf 配置文件，批量启动多个 NapCat 实例。
REM  每个实例使用独立的 NAPCAT_WORKDIR 和端口，互不干扰。
REM
REM  用法:
 REM    napcat-multi.bat              启动所有实例
REM    napcat-multi.bat start         启动所有实例
REM    napcat-multi.bat stop          停止所有 QQ 进程 (慎用)
REM    napcat-multi.bat status        查看实例配置
REM    napcat-multi.bat init          生成示例配置文件
REM ============================================================

set "SCRIPT_DIR=%~dp0"
set "CONF_FILE=%SCRIPT_DIR%napcat-instances.conf"
set "ACTION=%~1"
if "%ACTION%"=="" set "ACTION=start"

if /i "%ACTION%"=="init" goto :action_init
if /i "%ACTION%"=="start" goto :action_start
if /i "%ACTION%"=="stop" goto :action_stop
if /i "%ACTION%"=="status" goto :action_status
if /i "%ACTION%"=="help" goto :action_help

echo 未知操作: %ACTION%
goto :action_help

REM ==================== init ====================
:action_init
if exist "%CONF_FILE%" (
    echo 配置文件已存在: %CONF_FILE%
    echo 如需重新生成，请先删除该文件
    goto :eof
)

echo 生成示例配置文件: %CONF_FILE%
(
echo # QQBot-Fire NapCat 多开配置
echo #
echo # 格式: 实例名 QQ号 WS端口 HTTP端口 WebUI端口
echo # 每行一个实例，# 开头为注释
echo #
echo # NapCat 安装目录 ^(所有实例共用^)
echo NAPCAT_DIR=C:\Users\Lenovo\Desktop\NapCat.Shell
echo #
echo # 工作目录根路径 ^(每个实例会在此下创建子目录^)
echo WORK_ROOT=C:\Users\Lenovo\Desktop\NapCat.Shell\instances
echo #
echo # 实例配置:  名称       QQ号          WS端口  HTTP端口  WebUI端口
echo # instance   bot1       2838453502    3001    3003      6101
echo # instance   bot2       3149003262    3002    3004      6102
) > "%CONF_FILE%"

echo.
echo 配置文件已生成，请编辑:
echo   %CONF_FILE%
echo.
echo 取消注释 instance 行并填写你的 QQ 号和端口
goto :eof

REM ==================== start ====================
:action_start
if not exist "%CONF_FILE%" (
    echo 配置文件不存在: %CONF_FILE%
    echo 运行 napcat-multi.bat init 生成示例配置
    goto :eof
)

set "NAPCAT_DIR="
set "WORK_ROOT="
set "COUNT=0"

for /f "usebackq tokens=1,2,3,4,5,6 delims= " %%a in ("%CONF_FILE%") do (
    set "LINE=%%a"
    REM 跳过注释
    if not "!LINE:~0,1!"=="#" (
        if "%%a"=="NAPCAT_DIR" (
            for /f "tokens=1,* delims==" %%x in ("%%a=%%b") do set "NAPCAT_DIR=%%y"
        ) else if "%%a"=="WORK_ROOT" (
            for /f "tokens=1,* delims==" %%x in ("%%a=%%b") do set "WORK_ROOT=%%y"
        ) else if /i "%%a"=="instance" (
            set "INST_NAME=%%b"
            set "INST_QQ=%%c"
            set "INST_WS=%%d"
            set "INST_HTTP=%%e"
            set "INST_WEBUI=%%f"

            if "!NAPCAT_DIR!"=="" (
                echo 错误: 请在 instance 行之前设置 NAPCAT_DIR
                goto :eof
            )
            if "!WORK_ROOT!"=="" (
                echo 错误: 请在 instance 行之前设置 WORK_ROOT
                goto :eof
            )

            set "INST_WORKDIR=!WORK_ROOT!\!INST_NAME!"

            echo.
            echo ========================================
            echo  启动实例: !INST_NAME! ^(QQ: !INST_QQ!^)
            echo  工作目录: !INST_WORKDIR!
            echo  端口: WS=!INST_WS! HTTP=!INST_HTTP! WebUI=!INST_WEBUI!
            echo ========================================

            REM 确保工作目录存在
            if not exist "!INST_WORKDIR!\config" mkdir "!INST_WORKDIR!\config"

            REM 生成 OneBot11 配置 (如果不存在)
            if not exist "!INST_WORKDIR!\config\onebot11_!INST_QQ!.json" (
                echo 生成 OneBot11 配置: onebot11_!INST_QQ!.json
                call :gen_onebot_config "!INST_WORKDIR!\config\onebot11_!INST_QQ!.json" !INST_WS! !INST_HTTP!
            )

            REM 在新窗口中启动
            start "NapCat-!INST_NAME!" cmd /c ""%SCRIPT_DIR%napcat-instance.bat" "!NAPCAT_DIR!" !INST_QQ! "!INST_WORKDIR!" !INST_WEBUI!"

            set /a COUNT+=1

            REM 间隔 3 秒，避免同时启动冲突
            if !COUNT! GEQ 1 (
                echo 等待 3 秒后启动下一个实例...
                timeout /t 3 /nobreak >nul 2>&1
            )
        )
    )
)

if %COUNT%==0 (
    echo 未找到任何 instance 配置
    echo 请编辑 %CONF_FILE% 添加实例
) else (
    echo.
    echo 已启动 %COUNT% 个 NapCat 实例
)
goto :eof

REM ==================== stop ====================
:action_stop
echo 正在停止所有 QQ 进程...
taskkill /f /im QQ.exe 2>nul
if %errorlevel%==0 (
    echo 已停止所有 QQ 进程
) else (
    echo 没有正在运行的 QQ 进程
)
goto :eof

REM ==================== status ====================
:action_status
if not exist "%CONF_FILE%" (
    echo 配置文件不存在: %CONF_FILE%
    goto :eof
)

echo.
echo QQBot-Fire NapCat 多开配置:
echo ──────────────────────────────────────────────

for /f "usebackq tokens=1,2,3,4,5,6 delims= " %%a in ("%CONF_FILE%") do (
    set "LINE=%%a"
    if not "!LINE:~0,1!"=="#" (
        if "%%a"=="NAPCAT_DIR" (
            for /f "tokens=1,* delims==" %%x in ("%%a=%%b") do echo  NapCat 目录: %%y
        ) else if "%%a"=="WORK_ROOT" (
            for /f "tokens=1,* delims==" %%x in ("%%a=%%b") do echo  工作根目录: %%y
        ) else if /i "%%a"=="instance" (
            echo  实例: %%b  QQ=%%c  WS=%%d  HTTP=%%e  WebUI=%%f
        )
    )
)

echo ──────────────────────────────────────────────
echo.
echo QQ 进程:
tasklist /fi "imagename eq QQ.exe" /fo table /nh 2>nul | findstr /i "QQ" >nul
if %errorlevel%==0 (
    tasklist /fi "imagename eq QQ.exe" /fo table /nh
) else (
    echo  (无运行中的 QQ 进程)
)
goto :eof

REM ==================== help ====================
:action_help
echo.
echo QQBot-Fire NapCat 多开启动器
echo.
echo 用法: napcat-multi.bat [命令]
echo.
echo 命令:
echo   init      生成示例配置文件
echo   start     启动所有配置的实例 (默认)
echo   stop      停止所有 QQ 进程
echo   status    查看配置和运行状态
echo   help      显示此帮助
echo.
echo 配置文件: %CONF_FILE%
goto :eof

REM ==================== 生成 OneBot11 配置 ====================
:gen_onebot_config
set "OUT_FILE=%~1"
set "WS_PORT=%~2"
set "HTTP_PORT=%~3"

(
echo {
echo   "network": {
echo     "httpServers": [
echo       {
echo         "enable": true,
echo         "name": "http",
echo         "host": "127.0.0.1",
echo         "port": %HTTP_PORT%,
echo         "enableCors": true,
echo         "enableWebsocket": false,
echo         "messagePostFormat": "array",
echo         "token": "",
echo         "debug": false
echo       }
echo     ],
echo     "httpSseServers": [],
echo     "httpClients": [],
echo     "websocketServers": [
echo       {
echo         "enable": true,
echo         "name": "ws",
echo         "host": "127.0.0.1",
echo         "port": %WS_PORT%,
echo         "reportSelfMessage": false,
echo         "enableForcePushEvent": true,
echo         "messagePostFormat": "array",
echo         "token": "",
echo         "debug": false,
echo         "heartInterval": 30000
echo       }
echo     ],
echo     "websocketClients": [],
echo     "plugins": []
echo   },
echo   "musicSignUrl": "",
echo   "enableLocalFile2Url": false,
echo   "parseMultMsg": false,
echo   "timeout": {
echo     "baseTimeout": 10000,
echo     "maxTimeout": 1800000
echo   }
echo }
) > "%OUT_FILE%"
exit /b 0
