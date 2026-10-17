#!/usr/bin/env bash
# 重启当前部署；Docker 模式同时重建已修改的镜像。
set -euo pipefail
exec bash "$(dirname "${BASH_SOURCE[0]}")/fire-service.sh" restart
