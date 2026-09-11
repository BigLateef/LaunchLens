# LaunchLens

**See the signal before the crowd.**

LaunchLens is a Robinhood Chain launch-intelligence product for fast, explainable first-pass research. It compresses the first ten minutes of token research into a transparent score and an evidence trail.

## Hackathon thesis

New token launches create an information problem: raw deployments, liquidity, permissions and holder data arrive before a human can make sense of them. LaunchLens observes the event, scores the risk factors, and lets anyone verify the signal snapshot later.

## Current MVP

- Responsive dark dashboard for fresh launches
- Search and risk filters
- Explainable score breakdown: liquidity depth, holder spread, permissions and momentum
- Evidence summary and immutable-proof panel
- Deterministic demo data; no wallet or API key required
- Solidity `SignalRegistry` contract with operator controls, score validation, duplicate protection and evidence hashes
- SignalRegistry deployed and confirmed on Robinhood Chain testnet at `0x3546BA7F464e5b209a2054f581fFB4Bd2A438BC2` (block `117730944`)

## Demo

```bash
python3 -m http.server 4310 --directory .
```

Open `http://localhost:4310`, select a launch, then run the deep scan.

## Robinhood Chain target

- Testnet chain ID: `46630` (`0xb626`)
- Testnet RPC: `https://rpc.testnet.chain.robinhood.com`
- Explorer: `https://explorer.testnet.chain.robinhood.com`
- Native gas token: ETH

The public RPC is rate-limited; production indexing should use a provider such as Alchemy. The official testnet faucet supplies 0.01 testnet ETH and stock-token test assets once per 24 hours.

## Next integration steps

1. Connect an indexer for new contract and liquidity events.
2. Replace demo snapshots with real RPC/indexer data.
3. Hash the evidence bundle and record it through the registry.
4. Add a wallet watchlist without requiring custody or user funds.

The demo intentionally separates deterministic UI behavior from the future live indexer and contract adapter.
