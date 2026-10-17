#!/usr/bin/env bash
# 停止当前部署，保留所有持久化数据。
set -euo pipefail
exec bash "$(dirname "${BASH_SOURCE[0]}")/fire-service.sh" stop
