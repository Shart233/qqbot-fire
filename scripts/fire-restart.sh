#!/usr/bin/env bash
# 在服务器本地执行：重启 qqbot-fire.service + 清理 NapCat 残留进程
# 用于宝塔「计划任务 / Shell 脚本」或手动 bash fire-restart.sh
# 不拉代码、不重建，只做停服务 → 杀 NapCat → 启服务。
#
# 需要 root（systemctl + pkill /opt/QQ/qq）
set -e

SERVICE="${FIRE_SERVICE:-qqbot-fire.service}"
LOG_FILE="${FIRE_LOG:-/var/log/qqbot-fire.log}"

log() { echo "[$(date '+%F %T')] $*"; }

log "[1/3] 停止 $SERVICE"
systemctl stop "$SERVICE" || true

log "[2/3] 清理 NapCat 残留进程（xvfb-run / QQ NT / napcat.mjs / NapCat）"
# xvfb-run 会 fork 脱离父子关系，按命令行精确匹配
pkill -f napcat.mjs      || true
pkill -f 'xvfb-run'      || true
pkill -f '/opt/QQ/qq'    || true
pkill -f NapCat          || true
sleep 1
# 二次确认，仍在的用 -9
pkill -9 -f napcat.mjs   || true
pkill -9 -f 'xvfb-run'   || true
pkill -9 -f '/opt/QQ/qq' || true

log "[3/3] 启动 $SERVICE"
systemctl start "$SERVICE"
sleep 3
systemctl is-active "$SERVICE"

log '--- 残留检查 ---'
REMAIN=$(pgrep -af 'napcat.mjs|xvfb-run|/opt/QQ/qq' || true)
if [ -n "$REMAIN" ]; then
  log '[警告] 仍有 NapCat 相关进程:'
  echo "$REMAIN"
else
  log '[OK] NapCat 已清干净'
fi

log '--- 服务最近日志 ---'
if [ -f "$LOG_FILE" ]; then
  tail -15 "$LOG_FILE"
else
  journalctl -u "$SERVICE" -n 15 --no-pager
fi

log '[fire-restart] 完成'
