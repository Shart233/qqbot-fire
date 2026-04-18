#!/usr/bin/env bash
# 在服务器本地执行：停止 qqbot-fire.service + 清理 NapCat 残留进程
# 用于宝塔「计划任务 / Shell 脚本」或手动 bash fire-stop.sh
# 只停、不启。
#
# 需要 root（systemctl + pkill /opt/QQ/qq）
set -e

SERVICE="${FIRE_SERVICE:-qqbot-fire.service}"

log() { echo "[$(date '+%F %T')] $*"; }

log "[1/2] 停止 $SERVICE"
systemctl stop "$SERVICE" || true

log "[2/2] 清理 NapCat 残留进程（xvfb-run / QQ NT / napcat.mjs / NapCat）"
pkill -f napcat.mjs      || true
pkill -f 'xvfb-run'      || true
pkill -f '/opt/QQ/qq'    || true
pkill -f NapCat          || true
sleep 1
pkill -9 -f napcat.mjs   || true
pkill -9 -f 'xvfb-run'   || true
pkill -9 -f '/opt/QQ/qq' || true

log '--- 残留检查 ---'
REMAIN=$(pgrep -af 'napcat.mjs|xvfb-run|/opt/QQ/qq' || true)
if [ -n "$REMAIN" ]; then
  log '[警告] 仍有 NapCat 相关进程:'
  echo "$REMAIN"
else
  log '[OK] NapCat 已清干净'
fi

log "--- $SERVICE 状态 ---"
systemctl is-active "$SERVICE" || true

log '[fire-stop] 完成'
