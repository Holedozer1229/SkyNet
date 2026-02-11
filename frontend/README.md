# SKYNT Frontend

Production-grade frontend for SKYNT with Oracle overlay, OpenSea integration, and mainnet deployment.

## Features

### 🧠 Sentinel/Oracle Overlay
- Live oracle guidance vectors visualized on Snake-II PoW grid
- Real-time danger/opportunity field indicators
- Color-coded strength indicators (green=reward, red=danger)
- Auto-updates every 3 seconds

### 🏪 OpenSea Integration
- Direct links to NFTs on OpenSea marketplace
- Supports Ethereum and Base chains
- EIP-2981 royalty enforcement
- Secondary market revenue tracking

### 🐳 Docker + Nginx Deployment
- Single-command production deployment
- Nginx reverse proxy for API routing
- Docker multi-stage builds for optimization
- GitHub Actions CI/CD pipeline

## Quick Start

### Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Production (Docker)

```bash
# From repository root
docker-compose up -d
```

Visit http://localhost

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
VITE_OPENSEA_COLLECTION=your-collection-address
VITE_EVM_CHAIN=ethereum # or base
VITE_API_BASE_URL=http://localhost:4000
```

## Component Architecture

### Sentinel Overlay Components

**SentinelOverlay.tsx**
- Renders oracle guidance vectors on grid
- Color-coded by type (danger/reward)
- Opacity represents strength

**SnakePoWGrid.tsx**
- Main grid visualization
- Integrates SentinelOverlay
- Uses `useOracle` hook for real-time data

**useOracle.ts**
- Custom React hook
- Polls `/api/oracle` every 3 seconds
- Returns oracle vector data

### NFT Components

**NFTCard.tsx**
- Displays NFT metadata
- Shows dynamic traits
- Integrates OpenSeaLink

**OpenSeaLink.tsx**
- Generates OpenSea URLs
- Supports multiple chains
- Opens in new tab

## Deployment

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/mainnet.yml`):

1. Builds Docker image
2. Pushes to GitHub Container Registry
3. SSH deploys to production server
4. Restarts with zero downtime

### Required Secrets

Configure in GitHub Settings → Secrets:

- `SERVER_IP`: Production server IP
- `SSH_KEY`: SSH private key for deployment
- `GITHUB_TOKEN`: Automatically provided

### Manual Deploy

```bash
cd frontend
docker build -t skynt-frontend .
docker run -d -p 80:80 --name skynt skynt-frontend
```

## API Integration

Frontend expects API at `/api/oracle`:

**Response Format:**

```json
[
  {
    "x": 5,
    "y": 8,
    "strength": 0.8,
    "type": "reward"
  },
  {
    "x": 12,
    "y": 3,
    "strength": 0.6,
    "type": "danger"
  }
]
```

## OpenSea Integration

NFTs are automatically indexed by OpenSea when:
1. Deployed on Ethereum/Base mainnet
2. ERC-721/1155 compliant
3. Metadata follows OpenSea standards

Royalties are enforced via EIP-2981 in smart contract.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Nginx** - Production web server
- **Docker** - Containerization

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production

```bash
npm run preview
```

## Monitoring

View logs:

```bash
docker logs skynt -f
```

Check status:

```bash
docker ps | grep skynt
```

## Security

- No admin keys or multisig in frontend
- All blockchain interactions client-side
- Environment variables for sensitive config
- HTTPS enforced in production (configure Nginx)

## License

MIT - See LICENSE file
