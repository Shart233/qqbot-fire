#!/usr/bin/env bash
# QQ 已由上游镜像安装并修改主入口；按实例提供独立账号目录及虚拟显示。
set -euo pipefail
: "${NAPCAT_WORKDIR:?缺少实例工作目录}"
: "${NAPCAT_MAIN_PATH:?缺少 NapCat 入口}"
ulimit -c 0
mkdir -p "$NAPCAT_WORKDIR/home" "$NAPCAT_WORKDIR/qq-profile"
export HOME="$NAPCAT_WORKDIR/home"
export XDG_CONFIG_HOME="$HOME/.config"
exec xvfb-run -a --server-args="-screen 0 1280x720x24" /opt/QQ/qq --no-sandbox -q "$1" --user-data-dir="$NAPCAT_WORKDIR/qq-profile"
