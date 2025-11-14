# PumpFun Mayhem Volume Bot 📊

[![GitHub](https://img.shields.io/badge/GitHub-gigi0500-blue)](https://github.com/gigi0500/pumpfun-mayhem-volume-bot)
[![Telegram](https://img.shields.io/badge/Telegram-Contact-blue)](https://t.me/gigi0500)

A high-performance volume tracking bot for PumpFun tokens on Solana. Monitor trading volume in real-time, detect volume spikes, and track volume metrics across multiple timeframes.

## Sample Transaction

- [Sample TX 1](https://solscan.io/tx/4xgM3HYYSWawWKf7W12QpEQVWRvZsKu9VWbJ3AS5DSYXHEVDrYq9FQTbNoGLnTbfpdR7m48yhRoXfHRz6JeKk91r)
- [Sample TX 2](https://solscan.io/tx/5KEpE5PhPeUvRx3tX6U3dKC98BXud6XfWZ4bJKeyDA5XZyGTgHpemAejtNRbs2mta2Egi3KJrT5WsvLbu2NP2TVZ)
- [Sample TX 3](https://solscan.io/tx/https://solscan.io/tx/3MNks2vVteeYc8myYqg4U94Bsq51YbpDRjyipg5EtK4nJ3Hazq3P2WyfGr3boMCtuJUxUfoYroYL1P4ZYWfhTdNd)
- [Sample TX 4](https://solscan.io/tx/5sgDeVqvyAbRHpzuiTRyhyhhAQV1FMJDzc9a4poFJkHfJv1uyZ7wZmoXgC19s5ZkHESbr5UxEXwJ1VGh9C5HFGBq)
- [Sample TX 5](https://solscan.io/tx/3qBNQzFVcUxJ9YmU1B3ENPCERTgecafnJTYuEiSkoURATvwwo26VbQQ2CSLhdhTvdN2FHXGhTJjufgVickZjdDXJ)
- [Sample TX 6](https://solscan.io/tx/5scychJMzfw7UtYQR9Jkn9n71QF3UgfjCPB7ZzAFiJjuNqQcWUVsxaxWP5Jo3qZF5Hr5aB5iPuLM4z6yHXHTyk1a)

## Features

- **Real-Time Volume Tracking**: Monitor trading volume for PumpFun tokens continuously
- **Multi-Timeframe Analysis**: Track volume across 5-minute, 1-hour, and 24-hour periods
- **Volume Spike Detection**: Automatically detect unusual volume increases
- **Organic Strategy Detection**: Identify organic vs inorganic trading patterns
- **Wash Trading Detection**: Filter out artificial volume manipulation
- **Multi-Token Support**: Track volume for multiple tokens simultaneously
- **Volume Alerts**: Get notified when volume exceeds configured thresholds
- **Historical Data**: Maintain volume history for trend analysis
- **REST API**: Access volume data via HTTP endpoints
- **WebSocket Support**: Real-time volume updates via WebSocket
- **Token2022 Support**: Full volume tracking for Token2022 standard tokens
- **Raydium Integration**: Monitor volume across PumpFun and Raydium DEX

## Integrations

### Token2022 Support
This bot fully supports volume tracking for tokens using Solana's Token2022 standard:
- **Transfer Fees**: Accurate volume tracking including transfer fees
- **Confidential Transfers**: Volume tracking for privacy-enhanced tokens
- **Transfer Hooks**: Support for tokens with custom transfer logic
- **Metadata Extensions**: Enhanced metadata for volume analysis
- **Permanent Delegate**: Track volume for tokens with permanent delegate authority

### Raydium Integration
Native integration with Raydium DEX provides:
- **Cross-Platform Tracking**: Monitor volume across both PumpFun and Raydium
- **Pool Analytics**: Track volume across multiple Raydium pools
- **Migration Volume**: Monitor volume during PumpFun to Raydium migrations
- **Liquidity Volume**: Track liquidity provision and removal volume
- **Real-Time Data**: Live volume feeds from Raydium DEX

## Advantages

- **Early Detection**: Identify high-volume tokens before they pump
- **Data-Driven Decisions**: Make trading decisions based on volume metrics
- **Organic Filtering**: Focus on real trading activity, not manipulation
- **24/7 Monitoring**: Continuous volume tracking without downtime
- **Performance**: Efficient volume calculation and storage
- **Scalability**: Handle multiple tokens efficiently
- **Real-Time Updates**: Get instant notifications on volume changes

## Requirements

- Node.js 20+
- Solana RPC endpoint (public or private)
- Understanding of volume analysis concepts

## Installation

```bash
git clone https://github.com/gigi0500/pumpfun-mayhem-volume-bot.git
cd pumpfun-mayhem-volume-bot
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Set your Solana RPC endpoint
3. Configure volume tracking parameters
4. Set volume thresholds and alert settings
5. Configure update intervals

## Usage

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/volume/status` - Get bot status
- `GET /api/volume/tokens` - Get all tracked tokens
- `GET /api/volume/token/:address` - Get volume data for specific token
- `GET /api/volume/spikes` - Get recent volume spikes
- `GET /api/volume/organic` - Get tokens with organic volume patterns
- `POST /api/volume/track` - Add token to tracking list
- `POST /api/volume/untrack` - Remove token from tracking list

## Volume Metrics

- **5-Minute Volume**: Short-term volume trends
- **1-Hour Volume**: Medium-term volume analysis
- **24-Hour Volume**: Long-term volume tracking
- **Volume Spikes**: Detected unusual volume increases
- **Volume Trends**: Volume direction and momentum
- **Organic Score**: Percentage of organic trading activity

## Organic Strategy Detection

The bot analyzes trading patterns to identify organic volume:

- **Unique Wallet Count**: Minimum number of unique wallets required
- **Wallet Concentration**: Maximum percentage of volume from single wallet
- **Transaction Distribution**: Even distribution across multiple transactions
- **Wash Trading Detection**: Identify circular trading patterns
- **Pattern Analysis**: Detect natural vs artificial trading patterns

## Security

- **Never share your private keys**
- Use environment variables for sensitive data
- Regularly review volume tracking settings
- Monitor bot activity closely

## Disclaimer

This bot is for educational purposes. Trading cryptocurrencies involves substantial risk. Past performance does not guarantee future results. Use at your own risk and never invest more than you can afford to lose.

## Contact

For support, questions, or custom bot development:

- **Telegram**: [@gigi0500](https://t.me/gigi0500)
- **GitHub**: [gigi0500](https://github.com/gigi0500)

## License

MIT License - See LICENSE file for details

---

**Made with ❤️ for the PumpFun community**

