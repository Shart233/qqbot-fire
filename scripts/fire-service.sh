#!/usr/bin/env bash
# 仅管理所选部署，不按通用进程名终止其他 QQ、Xvfb 或 NapCat。
set -euo pipefail
ACTION="${1:?需要 stop 或 restart}"
case "$ACTION" in stop|restart) ;; *) echo "只支持 stop 或 restart" >&2; exit 2 ;; esac
case "${FIRE_DEPLOYMENT:-systemd}" in
  docker)
    PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
    if [ "$ACTION" = stop ]; then
      docker compose -f "${FIRE_COMPOSE_FILE:-$PROJECT_ROOT/docker-compose.yml}" stop qqbot-fire
    else
      docker compose -f "${FIRE_COMPOSE_FILE:-$PROJECT_ROOT/docker-compose.yml}" up -d --build qqbot-fire
    fi
    ;;
  systemd)
    SERVICE="${FIRE_SERVICE:-qqbot-fire.service}"
    systemctl "$ACTION" "$SERVICE"
    if [ "$ACTION" = restart ]; then
      systemctl is-active "$SERVICE"
      journalctl -u "$SERVICE" -n 15 --no-pager
    else
      echo "$SERVICE 已停止"
    fi
    ;;
  *) echo "FIRE_DEPLOYMENT 只能为 docker 或 systemd" >&2; exit 2 ;;
esac
