#!/usr/bin/env bash
# Java 回退服务直接从数据卷运行，新增任务也会持久化，无需逐个建立软链接。
set -euo pipefail
DATA_DIR="${DATA_DIR:-/app/data}"
mkdir -p "$DATA_DIR"
cd "$DATA_DIR"
exec /app/bin/qqbot-fire "$@"
