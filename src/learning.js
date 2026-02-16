import './shared.js';

const encoder = new TextEncoder();
async function hashText(text) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Linked-block demo
const chainTxInput = document.querySelector('#chain-tx');
const updateChainBtn = document.querySelector('#update-chain');
const chainOut = document.querySelector('#chain-output');

async function renderChain() {
  if (!chainTxInput || !chainOut) return;
  const tx = chainTxInput.value.trim() || 'Alice pays Bob 1 coin';
  const block1Data = `index:1|prev:GENESIS|tx:${tx}`;
  const block1Hash = await hashText(block1Data);
  const block2Data = `index:2|prev:${block1Hash}|tx:Bob pays Carol 0.2 coin`;
  const block2Hash = await hashText(block2Data);
  const block3Data = `index:3|prev:${block2Hash}|tx:Carol pays Dan 0.1 coin`;
  const block3Hash = await hashText(block3Data);

  chainOut.innerHTML = [
    ['01', tx, block1Hash, 'GENESIS'],
    ['02', 'Bob pays Carol 0.2 coin', block2Hash, block1Hash],
    ['03', 'Carol pays Dan 0.1 coin', block3Hash, block2Hash]
  ].map((b) => `
    <article class="content" style="margin-top:.5rem;">
      <strong>Block ${b[0]}</strong>
      <p>${b[1]}</p>
      <p class="output">prev: ${b[3].slice(0, 18)}...</p>
      <p class="output">hash: ${b[2].slice(0, 28)}...</p>
    </article>
  `).join('') + '<p class="warning" style="margin-top:.8rem;">Any edit in block 1 creates a new hash fingerprint and breaks every linked block after it.</p>';
}
updateChainBtn?.addEventListener('click', renderChain);
renderChain();

// Signature simulator
const messageInput = document.querySelector('#sig-message');
const signBtn = document.querySelector('#sign-btn');
const verifyBtn = document.querySelector('#verify-btn');
const sigOut = document.querySelector('#sig-output');
let currentSignature = '';
const privateKey = `priv-${Math.random().toString(36).slice(2)}`;
const publicKey = await hashText(privateKey);
const walletAddress = (await hashText(publicKey)).slice(0, 40);

const keyInfo = document.querySelector('#key-info');
if (keyInfo) {
  keyInfo.innerHTML = `
    <p><span class="badge">Demo wallet identity</span></p>
    <p class="output">public key: ${publicKey.slice(0, 52)}...</p>
    <p class="output">wallet address: 0x${walletAddress.slice(0, 28)}...</p>
  `;
}

signBtn?.addEventListener('click', async () => {
  const message = messageInput?.value || '';
  currentSignature = await hashText(`${message}|${privateKey}`);
  if (sigOut) {
    sigOut.innerHTML = `<p>Message signed with private key.</p><p class="output">signature: ${currentSignature.slice(0,56)}...</p>`;
  }
});

verifyBtn?.addEventListener('click', async () => {
  const message = messageInput?.value || '';
  const expected = await hashText(`${message}|${privateKey}`);
  const valid = expected === currentSignature && currentSignature.length > 0;
  if (sigOut) {
    sigOut.innerHTML = valid
      ? `<p class="badge">Valid signature ✓</p><p>Integrity check passed: this exact message matches the original signed content.</p>`
      : `<p class="danger">Invalid signature ✗</p><p>Either the message changed or there is no signature yet.</p>`;
  }
});

// Mempool demo
const addTxBtn = document.querySelector('#add-tx');
const mineBtn = document.querySelector('#mine-block');
const mempoolList = document.querySelector('#mempool-list');
const blockList = document.querySelector('#block-list');
const txFrom = document.querySelector('#tx-from');
const txTo = document.querySelector('#tx-to');
const txAmount = document.querySelector('#tx-amount');
const txFee = document.querySelector('#tx-fee');
const mempool = [];

function feeBar(fee) {
  const width = Math.max(10, Math.min(100, fee * 8));
  return `<span class="fee-bar" style="width:${width}px"></span>`;
}

function redrawMempool() {
  if (!mempoolList) return;
  mempoolList.innerHTML = mempool
    .map((tx, i) => `<li>#${i + 1}: ${tx.from} → ${tx.to}, amount ${tx.amount}, fee ${tx.fee}${feeBar(tx.fee)}</li>`)
    .join('') || '<li>No transactions yet.</li>';
}

addTxBtn?.addEventListener('click', () => {
  const tx = {
    from: txFrom?.value || 'Alice',
    to: txTo?.value || 'Bob',
    amount: Number(txAmount?.value || 1),
    fee: Number(txFee?.value || 1)
  };
  mempool.push(tx);
  redrawMempool();
});

mineBtn?.addEventListener('click', () => {
  const sorted = [...mempool].sort((a, b) => b.fee - a.fee);
  const picked = sorted.slice(0, 3);
  if (blockList) {
    blockList.innerHTML = picked.map((tx, index) => `<li><strong>Slot ${index + 1}</strong> ${tx.from} → ${tx.to} | fee ${tx.fee}${feeBar(tx.fee)}</li>`).join('') || '<li>Block is empty.</li>';
  }
});
redrawMempool();

// Gas fee widget
const gasLimitInput = document.querySelector('#gas-limit');
const gasPriceInput = document.querySelector('#gas-price');
const gasOut = document.querySelector('#gas-output');
const gasMood = document.querySelector('#gas-mood');
function calcGas() {
  const limit = Number(gasLimitInput?.value || 21000);
  const price = Number(gasPriceInput?.value || 20);
  const totalGwei = limit * price;
  const eth = totalGwei / 1_000_000_000;
  if (gasOut) {
    gasOut.textContent = `${limit.toLocaleString()} gas × ${price} gwei = ${totalGwei.toLocaleString()} gwei ≈ ${eth.toFixed(6)} ETH`;
  }
  if (gasMood) {
    const level = price < 20 ? 'Calm network 🟢' : price < 60 ? 'Busy network 🟠' : 'High congestion 🔴';
    gasMood.textContent = level;
  }
}
gasLimitInput?.addEventListener('input', calcGas);
gasPriceInput?.addEventListener('input', calcGas);
calcGas();

// On-chain vs off-chain
const dataToggle = document.querySelector('#data-toggle');
const dataResult = document.querySelector('#data-result');
const examples = {
  on: {
    title: 'On-chain example',
    text: 'Sending ETH, minting an NFT, or executing a smart contract. Visible to everyone through an explorer. Slower and costs fees, but highly transparent.'
  },
  off: {
    title: 'Off-chain example',
    text: 'Discussing price in a chat, storing profile pictures on cloud storage, or calculating analytics privately. Fast and cheap, but less trustless.'
  }
};
function updateToggle() {
  if (!dataToggle || !dataResult) return;
  const mode = dataToggle.value;
  dataResult.innerHTML = `<strong>${examples[mode].title}</strong><p>${examples[mode].text}</p>`;
}
dataToggle?.addEventListener('change', updateToggle);
updateToggle();

// Wallet safety checklist
const checklist = document.querySelector('#safety-checklist');
const safetyScore = document.querySelector('#safety-score');
function updateSafety() {
  if (!checklist || !safetyScore) return;
  const checks = checklist.querySelectorAll('input[type="checkbox"]');
  const checked = [...checks].filter((c) => c.checked).length;
  const score = Math.round((checked / checks.length) * 100);
  const note = score < 40 ? 'Needs immediate work' : score < 80 ? 'Solid but improve backup rigor' : 'Strong baseline safety';
  safetyScore.textContent = `Safety readiness: ${score}% — ${note}`;
}
checklist?.addEventListener('change', updateSafety);
updateSafety();
