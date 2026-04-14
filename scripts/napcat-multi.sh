#!/bin/bash
# ============================================================
#  QQBot-Fire NapCat 多开启动器 (Linux)
#
#  读取 napcat-instances.conf 配置文件，批量启动多个 NapCat 实例。
#  每个实例使用独立的 NAPCAT_WORKDIR 和端口，互不干扰。
#
#  用法:
#    napcat-multi.sh              启动所有实例
#    napcat-multi.sh start        启动所有实例
#    napcat-multi.sh stop         停止所有实例
#    napcat-multi.sh status       查看实例配置和运行状态
#    napcat-multi.sh init         生成示例配置文件
#    napcat-multi.sh restart      重启所有实例
# ============================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF_FILE="$SCRIPT_DIR/napcat-instances.conf"
PID_DIR="$SCRIPT_DIR/.pids"
ACTION="${1:-start}"

# ==================== init ====================
action_init() {
    if [ -f "$CONF_FILE" ]; then
        echo "配置文件已存在: $CONF_FILE"
        echo "如需重新生成，请先删除该文件"
        return
    fi

    cat > "$CONF_FILE" << 'CONF'
# QQBot-Fire NapCat 多开配置 (Linux)
#
# 格式: instance <名称> <QQ号> <WS端口> <HTTP端口> <WebUI端口>
# 每行一个实例，# 开头为注释
#
# NapCat 安装目录 (所有实例共用)
NAPCAT_DIR=/opt/NapCat
#
# 工作目录根路径 (每个实例会在此下创建子目录)
WORK_ROOT=/opt/NapCat/instances
#
# 实例配置:  名称       QQ号          WS端口  HTTP端口  WebUI端口
# instance   bot1       2838453502    3001    3003      6101
# instance   bot2       3149003262    3002    3004      6102
CONF

    echo "配置文件已生成: $CONF_FILE"
    echo "请编辑配置文件，取消注释 instance 行并填写你的 QQ 号和端口"
}

# ==================== start ====================
action_start() {
    if [ ! -f "$CONF_FILE" ]; then
        echo "配置文件不存在: $CONF_FILE"
        echo "运行 $0 init 生成示例配置"
        return 1
    fi

    mkdir -p "$PID_DIR"

    local napcat_dir="" work_root="" count=0

    while IFS= read -r line || [ -n "$line" ]; do
        # 跳过空行和注释
        line="$(echo "$line" | sed 's/^[[:space:]]*//')"
        [[ -z "$line" || "$line" == \#* ]] && continue

        # 解析 KEY=VALUE
        if [[ "$line" == NAPCAT_DIR=* ]]; then
            napcat_dir="${line#NAPCAT_DIR=}"
            continue
        fi
        if [[ "$line" == WORK_ROOT=* ]]; then
            work_root="${line#WORK_ROOT=}"
            continue
        fi

        # 解析 instance 行
        if [[ "$line" == instance\ * ]]; then
            read -r _ inst_name inst_qq inst_ws inst_http inst_webui <<< "$line"

            if [ -z "$napcat_dir" ]; then
                echo "错误: 请在 instance 行之前设置 NAPCAT_DIR"
                return 1
            fi
            if [ -z "$work_root" ]; then
                echo "错误: 请在 instance 行之前设置 WORK_ROOT"
                return 1
            fi

            local inst_workdir="$work_root/$inst_name"

            echo ""
            echo "========================================"
            echo " 启动实例: $inst_name (QQ: $inst_qq)"
            echo " 工作目录: $inst_workdir"
            echo " 端口: WS=$inst_ws HTTP=$inst_http WebUI=$inst_webui"
            echo "========================================"

            # 确保工作目录和 config 存在
            mkdir -p "$inst_workdir/config"

            # 生成 OneBot11 配置 (如果不存在)
            local onebot_conf="$inst_workdir/config/onebot11_${inst_qq}.json"
            if [ ! -f "$onebot_conf" ]; then
                echo "生成 OneBot11 配置: $onebot_conf"
                gen_onebot_config "$onebot_conf" "$inst_ws" "$inst_http"
            fi

            # 检查是否已在运行
            local pid_file="$PID_DIR/${inst_name}.pid"
            if [ -f "$pid_file" ]; then
                local old_pid
                old_pid=$(cat "$pid_file")
                if kill -0 "$old_pid" 2>/dev/null; then
                    echo "实例 $inst_name 已在运行中 (PID=$old_pid)，跳过"
                    continue
                fi
            fi

            # 在后台启动
            local log_file="$inst_workdir/napcat-${inst_name}.log"
            nohup "$SCRIPT_DIR/napcat-instance.sh" "$napcat_dir" "$inst_qq" "$inst_workdir" "$inst_webui" \
                >> "$log_file" 2>&1 &
            local pid=$!
            echo "$pid" > "$pid_file"
            echo "已启动, PID=$pid, 日志: $log_file"

            count=$((count + 1))

            # 间隔 3 秒，避免同时启动冲突
            if [ $count -ge 1 ]; then
                echo "等待 3 秒后启动下一个实例..."
                sleep 3
            fi
        fi
    done < "$CONF_FILE"

    if [ $count -eq 0 ]; then
        echo "未找到任何 instance 配置"
        echo "请编辑 $CONF_FILE 添加实例"
    else
        echo ""
        echo "已启动 $count 个 NapCat 实例"
    fi
}

# ==================== stop ====================
action_stop() {
    if [ ! -d "$PID_DIR" ]; then
        echo "没有运行中的实例"
        return
    fi

    local count=0
    for pid_file in "$PID_DIR"/*.pid; do
        [ -f "$pid_file" ] || continue
        local name
        name=$(basename "$pid_file" .pid)
        local pid
        pid=$(cat "$pid_file")

        if kill -0 "$pid" 2>/dev/null; then
            echo "停止实例: $name (PID=$pid)"
            kill "$pid" 2>/dev/null || true
            # 等待最多 5 秒
            for i in $(seq 1 5); do
                if ! kill -0 "$pid" 2>/dev/null; then
                    break
                fi
                sleep 1
            done
            # 强制终止
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null || true
                echo "  强制终止: $name"
            fi
            count=$((count + 1))
        else
            echo "实例 $name (PID=$pid) 已不在运行"
        fi
        rm -f "$pid_file"
    done

    echo "已停止 $count 个实例"
}

# ==================== status ====================
action_status() {
    echo ""
    echo "QQBot-Fire NapCat 多开状态:"
    echo "──────────────────────────────────────────────"

    if [ -f "$CONF_FILE" ]; then
        while IFS= read -r line || [ -n "$line" ]; do
            line="$(echo "$line" | sed 's/^[[:space:]]*//')"
            [[ -z "$line" || "$line" == \#* ]] && continue

            if [[ "$line" == NAPCAT_DIR=* ]]; then
                echo " NapCat 目录: ${line#NAPCAT_DIR=}"
            elif [[ "$line" == WORK_ROOT=* ]]; then
                echo " 工作根目录: ${line#WORK_ROOT=}"
            elif [[ "$line" == instance\ * ]]; then
                read -r _ name qq ws http webui <<< "$line"
                local status="未运行"
                local pid="-"
                local pid_file="$PID_DIR/${name}.pid"
                if [ -f "$pid_file" ]; then
                    pid=$(cat "$pid_file")
                    if kill -0 "$pid" 2>/dev/null; then
                        status="运行中"
                    else
                        status="已停止"
                    fi
                fi
                printf " %-6s %-14s QQ=%-12s WS=%-6s HTTP=%-6s WebUI=%-6s PID=%s\n" \
                    "[$status]" "$name" "$qq" "$ws" "$http" "$webui" "$pid"
            fi
        done < "$CONF_FILE"
    else
        echo " (配置文件不存在)"
    fi

    echo "──────────────────────────────────────────────"

    # 检查 PID 文件中的运行实例
    if [ -d "$PID_DIR" ]; then
        local running=0
        for pid_file in "$PID_DIR"/*.pid; do
            [ -f "$pid_file" ] || continue
            local pid
            pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                running=$((running + 1))
            fi
        done
        echo " 运行中的实例: $running"
    fi
}

# ==================== restart ====================
action_restart() {
    echo "重启所有实例..."
    action_stop
    sleep 2
    action_start
}

# ==================== help ====================
action_help() {
    echo ""
    echo "QQBot-Fire NapCat 多开启动器 (Linux)"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  init      生成示例配置文件"
    echo "  start     启动所有配置的实例 (默认)"
    echo "  stop      停止所有实例"
    echo "  restart   重启所有实例"
    echo "  status    查看配置和运行状态"
    echo "  help      显示此帮助"
    echo ""
    echo "配置文件: $CONF_FILE"
}

# ==================== 生成 OneBot11 配置 ====================
gen_onebot_config() {
    local out_file="$1" ws_port="$2" http_port="$3"
    cat > "$out_file" << EOF
{
  "network": {
    "httpServers": [
      {
        "enable": true,
        "name": "http",
        "host": "127.0.0.1",
        "port": $http_port,
        "enableCors": true,
        "enableWebsocket": false,
        "messagePostFormat": "array",
        "token": "",
        "debug": false
      }
    ],
    "httpSseServers": [],
    "httpClients": [],
    "websocketServers": [
      {
        "enable": true,
        "name": "ws",
        "host": "127.0.0.1",
        "port": $ws_port,
        "reportSelfMessage": false,
        "enableForcePushEvent": true,
        "messagePostFormat": "array",
        "token": "",
        "debug": false,
        "heartInterval": 30000
      }
    ],
    "websocketClients": [],
    "plugins": []
  },
  "musicSignUrl": "",
  "enableLocalFile2Url": false,
  "parseMultMsg": false,
  "timeout": {
    "baseTimeout": 10000,
    "maxTimeout": 1800000
  }
}
EOF
}

# ==================== main ====================
case "$ACTION" in
    init)    action_init ;;
    start)   action_start ;;
    stop)    action_stop ;;
    restart) action_restart ;;
    status)  action_status ;;
    help|-h|--help) action_help ;;
    *)
        echo "未知操作: $ACTION"
        action_help
        exit 1
        ;;
esac
