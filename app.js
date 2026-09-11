const RH_TESTNET = {
  chainId: '0xb626',
  chainIdDecimal: 46630,
  chainName: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrl: 'https://rpc.testnet.chain.robinhood.com',
  explorerUrl: 'https://explorer.testnet.chain.robinhood.com'
};
const SIGNAL_REGISTRY_ADDRESS = '0x3546BA7F464e5b209a2054f581fFB4Bd2A438BC2';
const SIGNAL_REGISTRY_DEPLOYMENT_BLOCK = 117730944;
const SIGNAL_REGISTRY_DEPLOYMENT_TX = '0x13b0aa5876c675c3a26ee756a2aec62dcb37c57964fd5288e79b2f847fd8b18a';

async function inspectNetwork() {
  if (!window.ethereum) {
    toast('No wallet detected · demo mode remains active');
    return;
  }
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId.toLowerCase() !== RH_TESTNET.chainId) {
      toast('Switch wallet to Robinhood Chain Testnet');
      return;
    }
    const block = await window.ethereum.request({ method: 'eth_blockNumber' });
    toast(`Robinhood testnet connected · registry ${SIGNAL_REGISTRY_ADDRESS.slice(0, 8)}…${SIGNAL_REGISTRY_ADDRESS.slice(-4)} · block ${parseInt(block, 16).toLocaleString()}`);
  } catch {
    toast('Wallet read cancelled · demo mode remains active');
  }
}

const tokens = [
  {id:'nova',name:'Nova Protocol',symbol:'$NOVA',age:'3 min ago',score:86,liquidity:'$6.2K',holders:'41',volume:'$19.8K',summary:'High attention, thin exit.',reason:'Liquidity is low relative to launch volume and the holder curve is unusually concentrated.',signals:[['Liquidity depth',22],['Holder spread',35],['Contract permissions',92],['Launch momentum',88]],proof:'Queued · 0x7d…4a9c'},
  {id:'bloom',name:'Bloom Club',symbol:'$BLOOM',age:'11 min ago',score:61,liquidity:'$24.8K',holders:'183',volume:'$41.3K',summary:'Interesting, but needs patience.',reason:'Healthy early spread, though the deployer still retains a large allocation.',signals:[['Liquidity depth',68],['Holder spread',54],['Contract permissions',48],['Launch momentum',76]],proof:'Queued · 0x3c…a1e7'},
  {id:'basis',name:'Basis Network',symbol:'$BASIS',age:'18 min ago',score:38,liquidity:'$83.1K',holders:'612',volume:'$62.4K',summary:'Cleaner launch profile.',reason:'Liquidity, holder spread and volume are aligned for an early-stage launch.',signals:[['Liquidity depth',87],['Holder spread',79],['Contract permissions',81],['Launch momentum',55]],proof:'Verified · 0xb2…19f4'},
  {id:'lagos',name:'Lagos Labs',symbol:'$LAGOS',age:'26 min ago',score:73,liquidity:'$11.4K',holders:'77',volume:'$37.9K',summary:'Momentum is outrunning depth.',reason:'The token is attracting attention faster than liquidity is arriving. Watch the next block range.',signals:[['Liquidity depth',39],['Holder spread',47],['Contract permissions',79],['Launch momentum',91]],proof:'Queued · 0x51…c2aa'},
  {id:'orbit',name:'Orbit Index',symbol:'$ORBIT',age:'42 min ago',score:29,liquidity:'$121K',holders:'1,040',volume:'$102K',summary:'Strongest profile in this feed.',reason:'No critical permission or concentration flags in the current demo snapshot.',signals:[['Liquidity depth',94],['Holder spread',92],['Contract permissions',84],['Launch momentum',61]],proof:'Verified · 0x81…e2b0'}
];
let activeFilter='all';let selected=null;
const $=s=>document.querySelector(s);
function tier(score){return score>=75?'high':score>=50?'mid':'clean'}
function renderList(){const q=$('#searchInput').value.toLowerCase().trim();const list=tokens.filter(t=>(activeFilter==='all'||(activeFilter==='high'?t.score>=70:t.score<50))&&(t.name+t.symbol).toLowerCase().includes(q));$('#tokenList').innerHTML=list.map(t=>`<div class="token-row ${selected===t.id?'selected':''}" data-id="${t.id}" tabindex="0" role="button" aria-label="Open scan for ${t.symbol}"><div class="token-name"><span class="token-icon">${t.symbol.replace('$','').slice(0,1)}</span><div><span class="token-symbol">${t.symbol}</span><span class="token-meta">${t.name} · ${t.age}</span></div></div><div><span class="row-label">LIQUIDITY</span><span class="row-value">${t.liquidity}</span></div><div><span class="row-label">HOLDERS</span><span class="row-value">${t.holders}</span></div><span class="score-pill score-${tier(t.score)}">${t.score}/100</span></div>`).join('')||`<div class="empty-state" style="padding:50px 20px">No matching launches in this snapshot.</div>`;document.querySelectorAll('.token-row').forEach(row=>{row.addEventListener('click',()=>selectToken(row.dataset.id));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectToken(row.dataset.id)}})});}
function selectToken(id){selected=id;const t=tokens.find(x=>x.id===id);$('#detailEmpty').classList.add('hidden');$('#detailContent').classList.remove('hidden');$('#detailTitle').textContent=t.name;$('#detailTicker').textContent=t.symbol;$('#detailAge').textContent=' · '+t.age;$('#detailScore').textContent=t.score+'/100';$('#riskFill').style.width=t.score+'%';$('#riskLabel').textContent=t.score>=75?'HIGH RISK — WAIT FOR MORE PROOF':t.score>=50?'MEDIUM RISK — WATCH THE NEXT BLOCKS':'LOWER RISK — CLEANER PROFILE';$('#detailStats').innerHTML=[['LIQUIDITY',t.liquidity],['HOLDERS',t.holders],['24H VOLUME',t.volume]].map(x=>`<div><span class="row-label">${x[0]}</span><span class="row-value">${x[1]}</span></div>`).join('');$('#signalBars').innerHTML=t.signals.map(s=>`<div class="signal-item"><label>${s[0]}</label><span class="signal-track"><i style="width:${s[1]}%"></i></span><b>${s[1]}</b></div>`).join('');$('#detailSummary').textContent=t.summary;$('#detailReason').textContent=t.reason;$('#detailProof').textContent=t.proof;renderList();}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400)}
async function rpc(method,params=[]){const res=await fetch(RH_TESTNET.rpcUrl,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:Date.now(),method,params})});if(!res.ok)throw new Error('RPC unavailable');const body=await res.json();if(body.error)throw new Error(body.error.message||'RPC error');return body.result}
function setRegistryLink(id,kind){const el=$(id);if(el)el.href=`${RH_TESTNET.explorerUrl}/${kind}/${kind==='address'?SIGNAL_REGISTRY_ADDRESS:SIGNAL_REGISTRY_DEPLOYMENT_TX}`}
async function inspectRegistry(){const status=$('#registryStatus');try{const [code,head]=await Promise.all([rpc('eth_getCode',[SIGNAL_REGISTRY_ADDRESS,'latest']),rpc('eth_blockNumber')]);if(!code||code==='0x')throw new Error('Registry bytecode missing');$('#registryBlock').textContent=`#${parseInt(head,16).toLocaleString()}`;status.textContent='● LIVE ON TESTNET';status.className='success-text';setRegistryLink('#registryAddressLink','address');setRegistryLink('#registryTxLink','tx')}catch{status.textContent='● RPC CHECK UNAVAILABLE';status.className='danger-text';$('#registryBlock').textContent='Retry from a live connection'}}
$('#searchInput').addEventListener('input',renderList);document.querySelectorAll('.filter-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');activeFilter=btn.dataset.filter;renderList()}));$('#refreshButton').addEventListener('click',()=>{toast('Radar refreshed · 5 demo launches checked');$('#refreshButton').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:500})});$('#loadMoreButton').addEventListener('click',()=>toast('Live indexer connector comes next'));$('#connectButton').addEventListener('click',inspectNetwork);$('#registryCheckButton').addEventListener('click',inspectRegistry);$('#deepScanButton').addEventListener('click',()=>{const btn=$('#deepScanButton');btn.textContent='Scanning…';btn.disabled=true;setTimeout(()=>{btn.textContent='Scan complete';toast('Evidence snapshot prepared for registry');setTimeout(()=>{btn.textContent='Run deep scan';btn.disabled=false},1600)},900)});renderList();selectToken('nova');inspectRegistry();
