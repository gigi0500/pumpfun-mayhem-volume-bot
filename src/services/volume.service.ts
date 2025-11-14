import { Connection } from '@solana/web3.js';
import { config } from '../config';
import { logger } from '../utils/logger';
import { TokenVolume, VolumeSpike, VolumeHistory, BotStatus, OrganicAnalysis } from '../types';
import { OrganicStrategyService, TransactionData } from './organic-strategy.service';

export class VolumeBot {
  private connection: Connection;
  private isRunning: boolean = false;
  private trackedTokens: Set<string> = new Set();
  private volumeData: Map<string, TokenVolume> = new Map();
  private volumeHistory: VolumeHistory[] = [];
  private volumeSpikes: VolumeSpike[] = [];
  private organicAnalyses: Map<string, OrganicAnalysis> = new Map();
  private organicStrategyService: OrganicStrategyService;
  private startTime: number = 0;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connection = new Connection(config.solana.rpcUrl, 'confirmed');
    this.organicStrategyService = new OrganicStrategyService();
    logger.info('Volume bot initialized');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Volume bot is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();
    logger.info('📊 Volume bot started');

    this.updateVolume().catch((error) => {
      logger.error('Error in volume update:', error);
    });
  }

  stop(): void {
    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    logger.info('⏹️ Volume bot stopped');
  }

  getStatus(): BotStatus {
    const organicTokens = Array.from(this.organicAnalyses.values())
      .filter(analysis => this.organicStrategyService.isOrganic(analysis)).length;

    return {
      isRunning: this.isRunning,
      trackedTokens: this.trackedTokens.size,
      totalVolumeSpikes: this.volumeSpikes.length,
      organicTokensDetected: organicTokens,
      lastUpdate: this.volumeHistory.length > 0 
        ? this.volumeHistory[this.volumeHistory.length - 1].timestamp 
        : 0,
      startTime: this.startTime,
      updateInterval: config.volume.updateInterval,
    };
  }

  getVolumeData(tokenAddress?: string): TokenVolume[] {
    if (tokenAddress) {
      const volume = this.volumeData.get(tokenAddress);
      return volume ? [volume] : [];
    }
    return Array.from(this.volumeData.values());
  }

  getVolumeSpikes(): VolumeSpike[] {
    return this.volumeSpikes.slice(-100); // Return last 100 spikes
  }

  getVolumeHistory(tokenAddress?: string): VolumeHistory[] {
    if (tokenAddress) {
      return this.volumeHistory.filter(h => h.tokenAddress === tokenAddress);
    }
    return this.volumeHistory.slice(-1000); // Return last 1000 entries
  }

  getOrganicTokens(): TokenVolume[] {
    return Array.from(this.volumeData.values()).filter(volume => {
      const analysis = this.organicAnalyses.get(volume.address);
      return analysis && this.organicStrategyService.isOrganic(analysis);
    });
  }

  getOrganicAnalysis(tokenAddress: string): OrganicAnalysis | null {
    return this.organicAnalyses.get(tokenAddress) || null;
  }

  trackToken(tokenAddress: string): void {
    this.trackedTokens.add(tokenAddress);
    logger.info(`Added token to tracking: ${tokenAddress}`);
  }

  untrackToken(tokenAddress: string): void {
    this.trackedTokens.delete(tokenAddress);
    this.volumeData.delete(tokenAddress);
    this.organicAnalyses.delete(tokenAddress);
    logger.info(`Removed token from tracking: ${tokenAddress}`);
  }

  private async updateVolume(): Promise<void> {
    while (this.isRunning) {
      try {
        // TODO: Implement volume tracking logic
        // - Fetch transaction data for tracked tokens from PumpFun
        // - Calculate volume for different timeframes
        // - Detect volume spikes
        // - Analyze organic patterns
        // - Update volume data
        
        if (config.organic.enabled) {
          // Analyze organic patterns for tracked tokens
          for (const tokenAddress of this.trackedTokens) {
            // TODO: Fetch actual transaction data
            const mockTransactions: TransactionData[] = [];
            
            if (mockTransactions.length > 0) {
              const analysis = this.organicStrategyService.analyzeOrganicPattern(
                tokenAddress,
                mockTransactions
              );
              this.organicAnalyses.set(tokenAddress, analysis);
              
              // Update volume data with organic score
              const volume = this.volumeData.get(tokenAddress);
              if (volume) {
                volume.organicScore = analysis.organicScore;
                volume.uniqueWallets = analysis.uniqueWallets;
                volume.transactionCount = analysis.transactionCount;
              }
            }
          }
        }
        
        await this.sleep(config.volume.updateInterval);
      } catch (error) {
        logger.error('Error in volume update:', error);
        await this.sleep(config.volume.updateInterval);
      }
    }
  }

  private detectVolumeSpike(tokenAddress: string, currentVolume: number, previousVolume: number, timeframe: '5m' | '1h' | '24h'): boolean {
    if (previousVolume === 0) return false;
    
    const multiplier = currentVolume / previousVolume;
    if (multiplier >= config.volume.volumeSpikeMultiplier) {
      const analysis = this.organicAnalyses.get(tokenAddress);
      const isOrganic = analysis ? this.organicStrategyService.isOrganic(analysis) : false;
      
      const spike: VolumeSpike = {
        tokenAddress,
        previousVolume,
        currentVolume,
        spikeMultiplier: multiplier,
        timeframe,
        timestamp: Date.now(),
        isOrganic,
      };
      
      this.volumeSpikes.push(spike);
      logger.info(`Volume spike detected: ${tokenAddress} - ${timeframe} volume increased ${multiplier.toFixed(2)}x (Organic: ${isOrganic})`);
      
      // Keep only last 1000 spikes
      if (this.volumeSpikes.length > 1000) {
        this.volumeSpikes.shift();
      }
      
      return true;
    }
    
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

