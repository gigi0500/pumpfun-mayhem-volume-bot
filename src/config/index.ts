import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3007', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    privateKey: process.env.SOLANA_PRIVATE_KEY || '',
    publicKey: process.env.SOLANA_PUBLIC_KEY || '',
  },
  volume: {
    enabled: process.env.VOLUME_TRACKING_ENABLED === 'true',
    updateInterval: parseInt(process.env.UPDATE_INTERVAL || '5000', 10),
    minVolumeThreshold: parseFloat(process.env.MIN_VOLUME_THRESHOLD || '1000'),
    trackMultipleTokens: process.env.TRACK_MULTIPLE_TOKENS === 'true',
    track24hVolume: process.env.TRACK_24H_VOLUME === 'true',
    track1hVolume: process.env.TRACK_1H_VOLUME === 'true',
    track5mVolume: process.env.TRACK_5M_VOLUME === 'true',
    volumeAlertThreshold: parseFloat(process.env.VOLUME_ALERT_THRESHOLD || '10000'),
    volumeSpikeMultiplier: parseFloat(process.env.VOLUME_SPIKE_MULTIPLIER || '2.0'),
  },
  pumpfun: {
    programId: process.env.PUMPFUN_PROGRAM_ID || '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
    apiUrl: process.env.PUMPFUN_API_URL || 'https://frontend-api.pump.fun',
  },
  organic: {
    enabled: process.env.ORGANIC_STRATEGY_ENABLED === 'true',
    minUniqueWallets: parseInt(process.env.MIN_UNIQUE_WALLETS || '10', 10),
    maxWalletConcentration: parseFloat(process.env.MAX_WALLET_CONCENTRATION || '0.3'),
    minTransactionCount: parseInt(process.env.MIN_TRANSACTION_COUNT || '5', 10),
    washTradingDetection: process.env.WASH_TRADING_DETECTION === 'true',
    patternAnalysisEnabled: process.env.PATTERN_ANALYSIS_ENABLED === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/volume.log',
  },
};

