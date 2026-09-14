// Speed control
const speedSlider = document.getElementById('speed');
const speedLabel = document.getElementById('speed-label');
let stepDelay = 5000;

speedSlider.addEventListener('input', (e) => {
    stepDelay = parseInt(e.target.value);
    speedLabel.textContent = (stepDelay / 1000).toFixed(1) + 's';
});

const messages = [
    // User prompt
    {
        type: 'user',
        content: `"Compare these two words: 'bookkeeper' and 'beekeeper'. Which one has more 'e's?"`
    },
    // Claude intro
    {
        type: 'claude',
        content: `<p>Great question for demonstrating the neuro-symbolic approach! Let me use deterministic tools rather than trying to count myself (LLMs are notoriously unreliable at character counting due to tokenization).</p>`
    },
    // Tool call 1
    {
        type: 'claude',
        content: `
<div class="tool-call">
    <div class="tool-call-header">
<span>🔧</span> db2-neuro-anchor:anchor_text
    </div>
    <div class="tool-call-body">
<span class="tool-param">text:</span> <span class="tool-value">"bookkeeper"</span>
    </div>
</div>

<div class="approval-box">
    <div class="approval-icon">✓</div>
    <div class="approval-text">
<div class="approval-title">AUTO-APPROVED</div>
<div class="approval-details">Governance check passed • No PII detected • Operation: WRITE</div>
    </div>
</div>

<div class="result-box">
    <div class="result-header">✅ TEXT ANCHORED SUCCESSFULLY</div>
    <div class="result-row">
<span class="result-label">Anchor ID</span>
<span class="result-value highlight">5</span>
    </div>
    <div class="result-row">
<span class="result-label">Text Length</span>
<span class="result-value">10 characters</span>
    </div>
    <div class="result-row">
<span class="result-label">Content Hash</span>
<span class="result-value"><span class="hash-verified">✓</span> 5687fc0c84b1cbb0...</span>
    </div>
</div>`
    },
    // Tool call 2
    {
        type: 'claude',
        content: `
<div class="tool-call">
    <div class="tool-call-header">
<span>🔧</span> db2-neuro-anchor:anchor_text
    </div>
    <div class="tool-call-body">
<span class="tool-param">text:</span> <span class="tool-value">"beekeeper"</span>
    </div>
</div>

<div class="approval-box">
    <div class="approval-icon">✓</div>
    <div class="approval-text">
<div class="approval-title">AUTO-APPROVED</div>
<div class="approval-details">Governance check passed • No PII detected • Operation: WRITE</div>
    </div>
</div>

<div class="result-box">
    <div class="result-header">✅ TEXT ANCHORED SUCCESSFULLY</div>
    <div class="result-row">
<span class="result-label">Anchor ID</span>
<span class="result-value highlight">6</span>
    </div>
    <div class="result-row">
<span class="result-label">Text Length</span>
<span class="result-value">9 characters</span>
    </div>
    <div class="result-row">
<span class="result-label">Content Hash</span>
<span class="result-value"><span class="hash-verified">✓</span> 288d7654827794da...</span>
    </div>
</div>`
    },
    // Tool call 3 - verify bookkeeper
    {
        type: 'claude',
        content: `
<div class="tool-call">
    <div class="tool-call-header">
<span>🔧</span> db2-neuro-anchor:verify_char_count
    </div>
    <div class="tool-call-body">
<span class="tool-param">anchor_id:</span> <span class="tool-value">5</span> &nbsp;
<span class="tool-param">target_char:</span> <span class="tool-value">'e'</span>
    </div>
</div>

<div class="approval-box">
    <div class="approval-icon">✓</div>
    <div class="approval-text">
<div class="approval-title">AUTO-APPROVED</div>
<div class="approval-details">Deterministic verification • Python .count() • Hash integrity check</div>
    </div>
</div>

<div class="result-box">
    <div class="result-header">✅ GROUND TRUTH VERIFICATION</div>
    <div class="result-row">
<span class="result-label">Anchor ID</span>
<span class="result-value">5</span>
    </div>
    <div class="result-row">
<span class="result-label">Target Character</span>
<span class="result-value">'e'</span>
    </div>
    <div class="result-row">
<span class="result-label">Verified Count</span>
<span class="result-value highlight">3</span>
    </div>
    <div class="result-row">
<span class="result-label">Hash Verified</span>
<span class="result-value"><span class="hash-verified">✓</span> 5687fc0c84b1cbb0...</span>
    </div>
</div>`
    },
    // Tool call 4 - verify beekeeper
    {
        type: 'claude',
        content: `
<div class="tool-call">
    <div class="tool-call-header">
<span>🔧</span> db2-neuro-anchor:verify_char_count
    </div>
    <div class="tool-call-body">
<span class="tool-param">anchor_id:</span> <span class="tool-value">6</span> &nbsp;
<span class="tool-param">target_char:</span> <span class="tool-value">'e'</span>
    </div>
</div>

<div class="approval-box">
    <div class="approval-icon">✓</div>
    <div class="approval-text">
<div class="approval-title">AUTO-APPROVED</div>
<div class="approval-details">Deterministic verification • Python .count() • Hash integrity check</div>
    </div>
</div>

<div class="result-box">
    <div class="result-header">✅ GROUND TRUTH VERIFICATION</div>
    <div class="result-row">
<span class="result-label">Anchor ID</span>
<span class="result-value">6</span>
    </div>
    <div class="result-row">
<span class="result-label">Target Character</span>
<span class="result-value">'e'</span>
    </div>
    <div class="result-row">
<span class="result-label">Verified Count</span>
<span class="result-value highlight">5</span>
    </div>
    <div class="result-row">
<span class="result-label">Hash Verified</span>
<span class="result-value"><span class="hash-verified">✓</span> 288d7654827794da...</span>
    </div>
</div>`
    },
    // Result summary
    {
        type: 'claude',
        content: `
<h3 style="color: var(--accent-cyan); margin-bottom: 1rem;">Deterministic Result</h3>

<table class="comparison-table">
    <tr>
<th>Word</th>
<th>Length</th>
<th>Count of 'e'</th>
    </tr>
    <tr>
<td>bookkeeper</td>
<td>10 chars</td>
<td>3</td>
    </tr>
    <tr>
<td>beekeeper</td>
<td>9 chars</td>
<td class="winner">5 ✓</td>
    </tr>
</table>

<p><strong>Answer: "<span class="winner">beekeeper</span>" has more 'e's</strong> (5 vs 3)</p>`
    },
    // Why this matters
    {
        type: 'claude',
        content: `
<h3 style="color: var(--accent-cyan); margin: 1.5rem 0 1rem 0;">Why This Matters for DataSentinel™</h3>

<p>This is a classic LLM failure case — if I had tried to count myself, I might have said "bookkeeper" looks longer and has double letters, so maybe it has more? But the neuro-symbolic approach guarantees correctness:</p>

<ol class="insight-list">
    <li><strong>Neural (me):</strong> Understood the question, orchestrated the workflow</li>
    <li><strong>Symbolic (Python):</strong> Executed deterministic <code>.count()</code> on raw bytes</li>
    <li><strong>Result:</strong> 100% accurate, auditable, hash-verified</li>
</ol>

<p>This same pattern applies to the governance gateway — <strong style="color: var(--accent-green);">AI advises, rules decide</strong>. The LLM interprets intent; the symbolic system enforces truth.</p>

<div class="db2-section">
    <div class="db2-header">
<span>🗄️</span> AEGISAI.SYMBOL_ANCHOR — Persisted to DB2
    </div>
    <table class="db2-table">
<tr>
    <th>ANCHOR_ID</th>
    <th>RAW_CONTENT</th>
    <th>HASH (prefix)</th>
    <th>CREATED_AT</th>
</tr>
<tr>
    <td>1</td>
    <td>strawberry</td>
    <td>5e737f891db1...</td>
    <td>13:38:19</td>
</tr>
<tr>
    <td>2</td>
    <td>garlic</td>
    <td>41024084d2e2...</td>
    <td>13:38:19</td>
</tr>
<tr>
    <td>3</td>
    <td>strawberry</td>
    <td>5e737f891db1...</td>
    <td>15:31:34</td>
</tr>
<tr>
    <td>4</td>
    <td>garlic</td>
    <td>41024084d2e2...</td>
    <td>15:31:34</td>
</tr>
<tr class="new-row">
    <td>5</td>
    <td>bookkeeper</td>
    <td>5687fc0c84b1...</td>
    <td>16:11:56</td>
</tr>
<tr class="new-row">
    <td>6</td>
    <td>beekeeper</td>
    <td>288d7654827...</td>
    <td>16:12:08</td>
</tr>
    </table>
</div>`
    }
];

let currentMessage = 0;
let isRunning = false;

function runDemo() {
    if (isRunning) return;
    isRunning = true;
    currentMessage = 0;
    document.getElementById('chat-body').innerHTML = '';
    document.getElementById('run-btn').disabled = true;
    showNextMessage();
}

function showNextMessage() {
    if (currentMessage >= messages.length) {
        isRunning = false;
        document.getElementById('run-btn').disabled = false;
        return;
    }

    const msg = messages[currentMessage];
    const chatBody = document.getElementById('chat-body');

    // Create message element
    const msgEl = document.createElement('div');
    msgEl.className = 'message';
    msgEl.innerHTML = `
        <div class="message-header">
            <div class="avatar ${msg.type}">${msg.type === 'user' ? '👤' : '🤖'}</div>
            <span class="sender-name ${msg.type}">${msg.type === 'user' ? 'You' : 'Claude'}</span>
        </div>
        <div class="message-content">
            ${msg.content}
        </div>
    `;

    chatBody.appendChild(msgEl);

    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // Trigger animation
    setTimeout(() => {
        msgEl.classList.add('visible');
        currentMessage++;
        
        // Schedule next message
        setTimeout(showNextMessage, stepDelay);
    }, 50);
}

function resetDemo() {
    isRunning = false;
    currentMessage = 0;
    document.getElementById('run-btn').disabled = false;
    document.getElementById('chat-body').innerHTML = `
        <div style="color: var(--text-muted); text-align: center; padding: 3rem;">
            <div style="margin-bottom: 1rem;"><img src="../helmet-logo.webp" alt="" style="width:2.5rem;height:2.5rem;object-fit:contain;vertical-align:middle;"></div>
            <div>Click <strong>"Run Demo"</strong> to start</div>
        </div>
    `;
}
