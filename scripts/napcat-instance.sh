#!/bin/bash
# ============================================================
#  NapCat 单实例启动器 (被 napcat-multi.sh 或 BotConsole 调用)
#
#  用法: napcat-instance.sh <NapCat目录> <QQ号> <工作目录> [WebUI端口]
#
#  参数:
#    1. NapCat.Shell 安装目录
#    2. QQ 号 (用于快速登录 -q)
#    3. 工作目录 (NAPCAT_WORKDIR, 每个实例独立)
#    4. [可选] WebUI 端口
# ============================================================

set -euo pipefail

if [ $# -lt 3 ]; then
    echo "用法: $0 <NapCat目录> <QQ号> <工作目录> [WebUI端口]"
    echo "示例: $0 /opt/NapCat 123456 /opt/NapCat/instances/bot1 6101"
    exit 1
fi

NAPCAT_DIR="$1"
QQ_UIN="$2"
WORK_DIR="$3"
WEBUI_PORT="${4:-}"

# ---- 校验 NapCat 目录 ----
if [ ! -f "$NAPCAT_DIR/napcat.mjs" ]; then
    echo "错误: NapCat 目录无效，找不到 napcat.mjs: $NAPCAT_DIR"
    exit 1
fi

# ---- 创建工作目录 ----
mkdir -p "$WORK_DIR/config"

# ---- 设置环境变量 ----
export NAPCAT_WORKDIR="$WORK_DIR"
export NAPCAT_MAIN_PATH="$NAPCAT_DIR/napcat.mjs"

if [ -n "$WEBUI_PORT" ]; then
    export NAPCAT_WEBUI_PREFERRED_PORT="$WEBUI_PORT"
fi

# ---- 检测启动方式 ----
# Linux 下 NapCat 通常通过 node 直接运行 napcat.mjs
# 或者使用 napcat.sh 启动脚本 (如果存在)

if [ -f "$NAPCAT_DIR/napcat.sh" ]; then
    # 使用官方启动脚本
    echo "[NapCat] 启动实例: QQ=$QQ_UIN 工作目录=$WORK_DIR"
    [ -n "$WEBUI_PORT" ] && echo "[NapCat] WebUI 端口: $WEBUI_PORT"
    cd "$NAPCAT_DIR"
    exec bash "$NAPCAT_DIR/napcat.sh" "$QQ_UIN"
elif command -v node &>/dev/null; then
    # 直接用 node 启动
    echo "[NapCat] 启动实例 (node): QQ=$QQ_UIN 工作目录=$WORK_DIR"
    [ -n "$WEBUI_PORT" ] && echo "[NapCat] WebUI 端口: $WEBUI_PORT"
    cd "$NAPCAT_DIR"
    exec node "$NAPCAT_DIR/napcat.mjs" "$QQ_UIN"
else
    echo "错误: 未找到 node 或 napcat.sh，无法启动 NapCat"
    echo "请确保已安装 Node.js 或 NapCat 包含启动脚本"
    exit 1
fi
