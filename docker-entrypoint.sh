#!/bin/bash
set -e

DATA_DIR="/app/data"

# Symlink runtime files to persistent data directory
# config.json
if [ ! -f "$DATA_DIR/config.json" ]; then
    echo '{}' > "$DATA_DIR/config.json"
fi
ln -sf "$DATA_DIR/config.json" /app/config.json

# .keys directory
mkdir -p "$DATA_DIR/.keys"
ln -sf "$DATA_DIR/.keys" /app/.keys

# logs directory
mkdir -p "$DATA_DIR/logs"
ln -sf "$DATA_DIR/logs" /app/logs

# Symlink any existing schedule files
for f in "$DATA_DIR"/schedules*.json; do
    [ -f "$f" ] && ln -sf "$f" /app/$(basename "$f")
done

echo "========================================"
echo "  QQBot-Fire starting..."
echo "  Web UI: http://0.0.0.0:${PORT:-9988}"
echo "  Data:   $DATA_DIR"
echo "========================================"

# Run the application
# Use 'cat' to keep stdin open so the Scanner doesn't immediately EOF
# The app is fully manageable via Web UI in Docker mode
exec /app/bin/qqbot-fire "$@"
