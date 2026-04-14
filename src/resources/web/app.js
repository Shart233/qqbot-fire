// ===== QQBot-Fire Web Console =====

let cachedBots = [];
let currentPage = localStorage.getItem('currentPage') || 'dashboard';
let refreshTimer = null;
let contactTab = localStorage.getItem('contactTab') || 'friends';

// ===== LocalStorage Memory =====
function remember(key, value) { try { localStorage.setItem(key, value); } catch(e) {} }
function recall(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch(e) { return fallback; } }

// ===== API Helper =====
async function api(method, path, body = null) {
    try {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(path, opts);
        const json = await res.json();
        if (!json.ok) {
            showToast(json.error || '请求失败', 'error');
            return null;
        }
        return json.data;
    } catch (e) {
        showToast('网络错误: ' + e.message, 'error');
        return null;
    }
}

// ===== Toast =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== Modal =====
let modalConfirmCallback = null;
function showModal(title, contentHtml, onConfirm) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = contentHtml;
    modalConfirmCallback = onConfirm;
    const footer = document.getElementById('modalFooter');
    footer.innerHTML = onConfirm
        ? '<button class="btn" onclick="hideModal()">取消</button><button class="btn btn-primary" onclick="modalConfirm()">确定</button>'
        : '<button class="btn btn-primary" onclick="hideModal()">关闭</button>';
    document.getElementById('modalOverlay').classList.add('active');
}
function hideModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    modalConfirmCallback = null;
}
function modalConfirm() {
    if (modalConfirmCallback) modalConfirmCallback();
    hideModal();
}

// ===== Navigation =====
function navigate(page) {
    currentPage = page;
    remember('currentPage', page);
    document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    const titles = { dashboard:'仪表盘', bots:'Bot 管理', messages:'消息发送', contacts:'好友与群', schedules:'定时任务', napcat:'NapCat 管理', logs:'日志' };
    document.getElementById('pageTitle').textContent = titles[page] || page;
    // Load page data
    switch(page) {
        case 'dashboard': loadDashboard(); break;
        case 'bots': loadBotTable(); break;
        case 'messages': populateBotSelect(document.getElementById('msgBotSelect'), true); break;
        case 'contacts': populateBotSelect(document.getElementById('contactBotSelect'), true); loadContacts(); break;
        case 'schedules': populateBotSelect(document.getElementById('scheduleBotSelect'), false); loadSchedules(); break;
        case 'napcat': loadNapCatPage(); break;
    }
}

// ===== Bot Select Helper =====
function populateBotSelect(select, connectedOnly) {
    const prev = select.value || recall('select_' + select.id, '');
    select.innerHTML = '<option value="">选择 Bot...</option>';
    cachedBots.filter(b => !connectedOnly || b.connected).forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.name;
        opt.textContent = b.name + (b.connected ? ` (QQ:${b.userId || '?'})` : ' (未连接)');
        select.appendChild(opt);
    });
    if (prev) select.value = prev;
    // Remember selection on change
    select.onchange = function() {
        remember('select_' + select.id, select.value);
        // Trigger original onchange if set via HTML attribute
        if (select.id === 'contactBotSelect') loadContacts();
        else if (select.id === 'scheduleBotSelect') loadSchedules();
        else if (select.id === 'ncLogSelect') loadNapCatLog();
    };
}

// ===== Status Bar =====
function updateStatus() {
    const online = cachedBots.filter(b => b.connected).length;
    const total = cachedBots.length;
    document.getElementById('statusDot').className = 'status-dot ' + (online > 0 ? 'online' : 'offline');
    document.getElementById('statusText').textContent = `${online}/${total} 在线`;
}

// ===== Log =====
function appendLog(msg) {
    const el = document.getElementById('logContent');
    const time = new Date().toLocaleTimeString();
    if (el.textContent === '等待日志...') el.textContent = '';
    el.textContent += `[${time}] ${msg}\n`;
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
}
function clearLogs() {
    document.getElementById('logContent').textContent = '等待日志...';
}

// ===== Dashboard =====
async function loadDashboard() {
    const data = await api('GET', '/api/bots');
    if (!data) return;
    cachedBots = data.bots || [];
    updateStatus();
    const grid = document.getElementById('botCards');
    if (cachedBots.length === 0) {
        grid.innerHTML = '<div class="empty-state">暂无 Bot 实例，请在 Bot 管理中添加</div>';
        return;
    }
    grid.innerHTML = cachedBots.map(b => `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${esc(b.name)}</span>
                <span class="badge badge-${b.mode === 'ws' ? 'ws' : 'http'}">${b.mode.toUpperCase()}</span>
            </div>
            <div class="card-body">
                <p><span class="status-dot ${b.connected ? 'online' : 'offline'}"></span> ${b.connected ? '已连接' : '未连接'}</p>
                ${b.connected ? `<p>QQ: ${b.userId || '-'}</p><p>昵称: ${esc(b.nickname || '-')}</p>` : `<p>${esc(b.mode === 'ws' ? b.wsUrl : b.httpUrl)}</p>`}
            </div>
            <div class="card-footer">
                ${b.connected
                    ? `<button class="btn btn-danger btn-sm" onclick="toggleBot('${esc(b.name)}', false)">断开</button>`
                    : `<button class="btn btn-success btn-sm" onclick="toggleBot('${esc(b.name)}', true)">连接</button>`
                }
                <button class="btn btn-sm" onclick="navigate('bots')">管理</button>
            </div>
        </div>
    `).join('');
}

async function toggleBot(name, connect) {
    const action = connect ? 'connect' : 'disconnect';
    const data = await api('POST', `/api/bots/${encodeURIComponent(name)}/${action}`);
    if (data !== null) {
        showToast(`${name} ${connect ? '已连接' : '已断开'}`, 'success');
        appendLog(`${name} ${connect ? '连接成功' : '已断开'}`);
        loadDashboard();
    }
}

async function connectAll() {
    const data = await api('POST', '/api/connect-all');
    if (data !== null) { showToast('全部连接完成', 'success'); loadDashboard(); }
}
async function disconnectAll() {
    const data = await api('POST', '/api/disconnect-all');
    if (data !== null) { showToast('全部断开完成', 'success'); loadDashboard(); }
}

// ===== Bot Management =====
async function loadBotTable() {
    const data = await api('GET', '/api/bots');
    if (!data) return;
    cachedBots = data.bots || [];
    updateStatus();
    const tbody = document.getElementById('botTable');
    if (cachedBots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无 Bot</td></tr>';
        return;
    }
    tbody.innerHTML = cachedBots.map(b => `
        <tr>
            <td><strong>${esc(b.name)}</strong>${b.name === data.activeBot ? ' <span class="badge badge-on">当前</span>' : ''}</td>
            <td><span class="badge badge-${b.mode === 'ws' ? 'ws' : 'http'}">${b.mode.toUpperCase()}</span></td>
            <td>${esc(b.mode === 'ws' ? b.wsUrl : b.httpUrl)}</td>
            <td><span class="badge badge-${b.connected ? 'on' : 'off'}">${b.connected ? '在线' : '离线'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showBotConfig('${esc(b.name)}')">配置</button>
                ${b.connected
                    ? `<button class="btn btn-sm btn-danger" onclick="toggleBot('${esc(b.name)}', false)">断开</button>`
                    : `<button class="btn btn-sm btn-success" onclick="toggleBot('${esc(b.name)}', true)">连接</button>`
                }
                <button class="btn btn-sm btn-danger" onclick="deleteBot('${esc(b.name)}')">删除</button>
            </td>
        </tr>
    `).join('');
}

async function addBot() {
    const name = document.getElementById('addBotName').value.trim();
    if (!name) { showToast('请输入 Bot 名称', 'error'); return; }
    const data = await api('POST', '/api/bots', { name });
    if (data !== null) {
        document.getElementById('addBotName').value = '';
        showToast(`Bot "${name}" 已添加`, 'success');
        loadBotTable();
    }
}

async function deleteBot(name) {
    showModal('确认删除', `<p>确定要删除 Bot "${esc(name)}" 吗？</p>`, async () => {
        const data = await api('DELETE', `/api/bots/${encodeURIComponent(name)}`);
        if (data !== null) { showToast('已删除', 'success'); loadBotTable(); loadDashboard(); }
    });
}

async function showBotConfig(name) {
    const cfg = await api('GET', `/api/bots/${encodeURIComponent(name)}/config`);
    if (!cfg) return;
    const html = `
        <div class="form-group">
            <label>连接模式</label>
            <div class="radio-group">
                <label><input type="radio" name="cfgMode" value="ws" ${cfg.mode==='ws'?'checked':''}> WebSocket</label>
                <label><input type="radio" name="cfgMode" value="http" ${cfg.mode==='http'?'checked':''}> HTTP</label>
            </div>
        </div>
        <div class="form-group"><label>WS 地址</label><input class="input" id="cfgWsUrl" value="${esc(cfg.wsUrl||'')}"></div>
        <div class="form-group"><label>HTTP 地址</label><input class="input" id="cfgHttpUrl" value="${esc(cfg.httpUrl||'')}"></div>
        <div class="form-group"><label>WS Token</label><input class="input" id="cfgWsToken" value="${esc(cfg.wsToken||'')}" type="password"></div>
        <div class="form-group"><label>HTTP Token</label><input class="input" id="cfgHttpToken" value="${esc(cfg.httpToken||'')}" type="password"></div>
    `;
    showModal(`配置 - ${name}`, html, async () => {
        const mode = document.querySelector('input[name=cfgMode]:checked')?.value || 'ws';
        const body = {
            mode,
            wsUrl: document.getElementById('cfgWsUrl').value,
            httpUrl: document.getElementById('cfgHttpUrl').value,
            wsToken: document.getElementById('cfgWsToken').value,
            httpToken: document.getElementById('cfgHttpToken').value
        };
        const data = await api('PUT', `/api/bots/${encodeURIComponent(name)}/config`, body);
        if (data !== null) { showToast('配置已保存', 'success'); loadBotTable(); }
    });
}

// ===== Messages =====
async function sendMessage() {
    const bot = document.getElementById('msgBotSelect').value;
    if (!bot) { showToast('请选择 Bot', 'error'); return; }
    const type = document.querySelector('input[name=msgType]:checked').value;
    const target = parseInt(document.getElementById('msgTarget').value);
    const message = document.getElementById('msgContent').value.trim();
    if (!target) { showToast('请输入目标', 'error'); return; }
    if (!message) { showToast('请输入消息', 'error'); return; }
    const data = await api('POST', `/api/bots/${encodeURIComponent(bot)}/send`, { type, target, message });
    if (data !== null) {
        showToast('消息已发送', 'success');
        appendLog(`[${bot}] ${type === 'group' ? '群' : '私聊'}消息 -> ${target}: ${message}`);
        saveQQHistory('msgTarget', target);
        document.getElementById('msgContent').value = '';
    }
}
// Update hint when message type changes
document.addEventListener('change', e => {
    if (e.target.name === 'msgType') {
        document.getElementById('targetHint').textContent = e.target.value === 'group' ? '(群号)' : '(QQ号)';
    }
});

// ===== Contacts =====
async function loadContacts() {
    const bot = document.getElementById('contactBotSelect').value;
    if (!bot) { document.getElementById('contactTable').innerHTML = '<tr><td class="empty-state">请选择 Bot</td></tr>'; return; }
    if (contactTab === 'friends') {
        const data = await api('GET', `/api/bots/${encodeURIComponent(bot)}/friends`);
        document.getElementById('contactTableHead').innerHTML = '<tr><th>QQ</th><th>昵称</th><th>备注</th></tr>';
        if (!data || data.length === 0) {
            document.getElementById('contactTable').innerHTML = '<tr><td colspan="3" class="empty-state">暂无好友</td></tr>';
            return;
        }
        document.getElementById('contactTable').innerHTML = data.map(f => `<tr><td>${f.userId}</td><td>${esc(f.nickname)}</td><td>${esc(f.remark||'')}</td></tr>`).join('');
    } else {
        const data = await api('GET', `/api/bots/${encodeURIComponent(bot)}/groups`);
        document.getElementById('contactTableHead').innerHTML = '<tr><th>群号</th><th>群名</th><th>成员数</th><th>操作</th></tr>';
        if (!data || data.length === 0) {
            document.getElementById('contactTable').innerHTML = '<tr><td colspan="4" class="empty-state">暂无群组</td></tr>';
            return;
        }
        document.getElementById('contactTable').innerHTML = data.map(g => `<tr>
            <td>${g.groupId}</td><td>${esc(g.groupName)}</td><td>${g.memberCount}/${g.maxMemberCount}</td>
            <td><button class="btn btn-sm" onclick="loadMembers('${bot}', ${g.groupId}, '${esc(g.groupName)}')">查看成员</button></td>
        </tr>`).join('');
    }
    document.getElementById('memberSection').style.display = 'none';
}
function switchContactTab(tab) {
    contactTab = tab;
    remember('contactTab', tab);
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
    loadContacts();
}
async function loadMembers(bot, groupId, groupName) {
    const data = await api('GET', `/api/bots/${encodeURIComponent(bot)}/groups/${groupId}/members`);
    document.getElementById('memberTitle').textContent = `群成员 - ${groupName} (${groupId})`;
    document.getElementById('memberSection').style.display = 'block';
    if (!data || data.length === 0) {
        document.getElementById('memberTable').innerHTML = '<tr><td colspan="4" class="empty-state">暂无成员</td></tr>';
        return;
    }
    document.getElementById('memberTable').innerHTML = data.map(m => `<tr><td>${m.userId}</td><td>${esc(m.nickname)}</td><td>${esc(m.card||'')}</td><td>${esc(m.role)}</td></tr>`).join('');
}
function closeMemberSection() { document.getElementById('memberSection').style.display = 'none'; }

// ===== Schedules =====
async function loadSchedules() {
    const bot = document.getElementById('scheduleBotSelect').value;
    if (!bot) { document.getElementById('scheduleTable').innerHTML = '<tr><td colspan="6" class="empty-state">请选择 Bot</td></tr>'; return; }
    const data = await api('GET', `/api/bots/${encodeURIComponent(bot)}/schedules`);
    if (!data || data.length === 0) {
        document.getElementById('scheduleTable').innerHTML = '<tr><td colspan="6" class="empty-state">暂无定时任务</td></tr>';
        return;
    }
    document.getElementById('scheduleTable').innerHTML = data.map(t => `<tr>
        <td>${esc(t.name)}</td><td>${esc(t.time)}</td>
        <td>${(t.targets||[]).join(', ')}</td><td>${esc(t.message)}</td>
        <td>
            <label class="toggle"><input type="checkbox" ${t.enabled?'checked':''} onchange="toggleSchedule('${esc(bot)}','${esc(t.name)}',this.checked)"><span class="toggle-slider"></span></label>
        </td>
        <td>
            <button class="btn btn-sm btn-warning" onclick="testSchedule('${esc(bot)}','${esc(t.name)}')">测试</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSchedule('${esc(bot)}','${esc(t.name)}')">删除</button>
        </td>
    </tr>`).join('');
}
async function addSchedule() {
    const bot = document.getElementById('scheduleBotSelect').value;
    if (!bot) { showToast('请选择 Bot', 'error'); return; }
    const name = document.getElementById('schedName').value.trim();
    const time = document.getElementById('schedTime').value;
    const targetsStr = document.getElementById('schedTargets').value.trim();
    const message = document.getElementById('schedMessage').value.trim();
    if (!name || !time || !targetsStr || !message) { showToast('请填写所有字段', 'error'); return; }
    const targets = targetsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const data = await api('POST', `/api/bots/${encodeURIComponent(bot)}/schedules`, { name, time, targets, message });
    if (data !== null) {
        showToast('任务已添加', 'success');
        document.getElementById('schedName').value = '';
        document.getElementById('schedTime').value = '';
        document.getElementById('schedTargets').value = '';
        document.getElementById('schedMessage').value = '';
        loadSchedules();
    }
}
async function toggleSchedule(bot, name, enabled) {
    await api('PUT', `/api/bots/${encodeURIComponent(bot)}/schedules/${encodeURIComponent(name)}/toggle`, { enabled });
}
async function testSchedule(bot, name) {
    const data = await api('POST', `/api/bots/${encodeURIComponent(bot)}/schedules/${encodeURIComponent(name)}/test`);
    if (data !== null) showToast('已触发测试', 'success');
}
async function deleteSchedule(bot, name) {
    const data = await api('DELETE', `/api/bots/${encodeURIComponent(bot)}/schedules/${encodeURIComponent(name)}`);
    if (data !== null) { showToast('已删除', 'success'); loadSchedules(); }
}

// ===== NapCat =====
async function loadNapCatPage() {
    // Load config
    const cfg = await api('GET', '/api/napcat/config');
    if (cfg) {
        document.getElementById('napCatDir').value = cfg.napCatDir || '';
        document.getElementById('napCatWorkRoot').value = cfg.workRoot || '';
    }
    // Load instances
    await loadNapCatInstances();
}
async function loadNapCatInstances() {
    const data = await api('GET', '/api/napcat/instances');
    const tbody = document.getElementById('napCatInstances');
    const logSelect = document.getElementById('ncLogSelect');
    logSelect.innerHTML = '<option value="">选择实例...</option>';
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无运行中的实例</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(i => `<tr>
        <td><strong>${esc(i.name)}</strong></td><td>${esc(i.qq)}</td>
        <td>${i.wsPort}</td><td>${i.httpPort}</td><td>${i.pid}</td>
        <td>
            <button class="btn btn-sm" onclick="loadNapCatLogFor('${esc(i.name)}')">日志</button>
            <button class="btn btn-sm btn-danger" onclick="stopNapCat('${esc(i.name)}')">停止</button>
        </td>
    </tr>`).join('');
    data.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.name; opt.textContent = i.name;
        logSelect.appendChild(opt);
    });
}
async function saveNapCatConfig() {
    const napCatDir = document.getElementById('napCatDir').value.trim();
    const workRoot = document.getElementById('napCatWorkRoot').value.trim();
    const data = await api('PUT', '/api/napcat/config', { napCatDir, workRoot });
    if (data !== null) showToast('NapCat 配置已保存', 'success');
}
async function startNapCat() {
    const name = document.getElementById('ncName').value.trim();
    const qq = document.getElementById('ncQQ').value.trim();
    const webuiPort = parseInt(document.getElementById('ncWebUIPort').value) || 6099;
    if (!name || !qq) { showToast('请填写名称和 QQ 号', 'error'); return; }
    const data = await api('POST', '/api/napcat/start', { name, qq, webuiPort });
    if (data !== null) {
        showToast(`NapCat 实例 ${name} 已启动`, 'success');
        appendLog(`NapCat ${name} (QQ:${qq}) 已启动`);
        saveQQHistory('ncQQ', qq);
        document.getElementById('ncName').value = '';
        document.getElementById('ncQQ').value = '';
        document.getElementById('ncWebUIPort').value = '';
        loadNapCatInstances();
        loadDashboard();
    }
}
async function stopNapCat(name) {
    const data = await api('POST', '/api/napcat/stop', { name });
    if (data !== null) { showToast(`已停止 ${name}`, 'success'); loadNapCatInstances(); }
}
async function stopAllNapCat() {
    const data = await api('POST', '/api/napcat/stop', { name: 'all' });
    if (data !== null) { showToast('已停止所有实例', 'success'); loadNapCatInstances(); }
}
async function napcatDiscover() {
    const data = await api('POST', '/api/napcat/discover');
    if (data !== null) {
        showToast(`发现完成: 新建 ${data.created||0} 个，共 ${data.total||0} 个 Bot`, 'success');
        appendLog(`NapCat 自动发现: 新建 ${data.created||0} 个`);
        loadDashboard();
        loadBotTable();
    }
}
async function loadNapCatLog() {
    const name = document.getElementById('ncLogSelect').value;
    if (!name) return;
    await loadNapCatLogFor(name);
}
async function loadNapCatLogFor(name) {
    document.getElementById('ncLogSelect').value = name;
    const data = await api('GET', `/api/napcat/instances/${encodeURIComponent(name)}/log`);
    const el = document.getElementById('napCatLogContent');
    if (!data || !data.lines) { el.textContent = '无日志'; return; }
    el.textContent = data.lines.join('\n');
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
}

// ===== QQ Number History =====
function getQQHistory(key) {
    try { return JSON.parse(localStorage.getItem('qqHistory_' + key) || '[]'); } catch(e) { return []; }
}
function saveQQHistory(key, value) {
    if (!value) return;
    value = String(value).trim();
    if (!value || !/^\d+$/.test(value)) return;
    let history = getQQHistory(key);
    history = history.filter(v => v !== value);
    history.unshift(value);
    if (history.length > 20) history = history.slice(0, 20);
    try { localStorage.setItem('qqHistory_' + key, JSON.stringify(history)); } catch(e) {}
}
function removeQQHistory(key, value) {
    let history = getQQHistory(key);
    history = history.filter(v => v !== value);
    try { localStorage.setItem('qqHistory_' + key, JSON.stringify(history)); } catch(e) {}
}
function toggleHistory(inputId) {
    const dropdown = document.getElementById(inputId + '-history');
    // Close all other dropdowns first
    document.querySelectorAll('.history-dropdown.active').forEach(d => {
        if (d.id !== inputId + '-history') d.classList.remove('active');
    });
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        return;
    }
    const history = getQQHistory(inputId);
    if (history.length === 0) {
        dropdown.innerHTML = '<div class="history-empty">暂无历史记录</div>';
    } else {
        dropdown.innerHTML = history.map(v => `
            <div class="history-item">
                <span onclick="selectHistory('${inputId}', '${v}')">${v}</span>
                <span class="history-delete" onclick="event.stopPropagation();deleteHistory('${inputId}','${v}')" title="删除">✕</span>
            </div>
        `).join('');
    }
    dropdown.classList.add('active');
}
function selectHistory(inputId, value) {
    document.getElementById(inputId).value = value;
    document.getElementById(inputId + '-history').classList.remove('active');
}
function deleteHistory(inputId, value) {
    removeQQHistory(inputId, value);
    toggleHistory(inputId); // Refresh dropdown
}
// Close dropdown when clicking outside
document.addEventListener('click', e => {
    if (!e.target.closest('.input-with-history')) {
        document.querySelectorAll('.history-dropdown.active').forEach(d => d.classList.remove('active'));
    }
});

// ===== Utilities =====
function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.page));
    });
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
    });
    // Restore message type selection
    const savedMsgType = recall('msgType', 'group');
    const msgTypeRadio = document.querySelector(`input[name=msgType][value=${savedMsgType}]`);
    if (msgTypeRadio) msgTypeRadio.checked = true;
    document.getElementById('targetHint').textContent = savedMsgType === 'group' ? '(群号)' : '(QQ号)';
    // Remember message type on change
    document.querySelectorAll('input[name=msgType]').forEach(r => {
        r.addEventListener('change', () => remember('msgType', r.value));
    });
    // Restore contact tab
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.toggle('active', el.dataset.tab === contactTab));
    // Restore last page (load dashboard first for bot data, then navigate)
    loadDashboard().then(() => {
        navigate(currentPage);
    });
    // Auto-refresh
    refreshTimer = setInterval(() => {
        if (currentPage === 'dashboard') loadDashboard();
    }, 5000);
    appendLog('Web 控制台已启动');
});
