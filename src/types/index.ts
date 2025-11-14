export interface TokenVolume {
  address: string;
  symbol?: string;
  name?: string;
  volume5m: number;
  volume1h: number;
  volume24h: number;
  price: number;
  timestamp: number;
  organicScore?: number;
  uniqueWallets?: number;
  transactionCount?: number;
}

export interface VolumeSpike {
  tokenAddress: string;
  symbol?: string;
  previousVolume: number;
  currentVolume: number;
  spikeMultiplier: number;
  timeframe: '5m' | '1h' | '24h';
  timestamp: number;
  isOrganic?: boolean;
}

export interface VolumeHistory {
  tokenAddress: string;
  timestamp: number;
  volume5m: number;
  volume1h: number;
  volume24h: number;
  price: number;
  organicScore?: number;
}

export interface OrganicAnalysis {
  tokenAddress: string;
  organicScore: number;
  uniqueWallets: number;
  transactionCount: number;
  walletConcentration: number;
  isWashTrading: boolean;
  patternScore: number;
  timestamp: number;
}

export interface BotStatus {
  isRunning: boolean;
  trackedTokens: number;
  totalVolumeSpikes: number;
  organicTokensDetected: number;
  lastUpdate: number;
  startTime: number;
  updateInterval: number;
}

