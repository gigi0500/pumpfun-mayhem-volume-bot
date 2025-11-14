import { logger } from '../utils/logger';
import { config } from '../config';
import { OrganicAnalysis } from '../types';

export interface TransactionData {
  wallet: string;
  amount: number;
  timestamp: number;
  type: 'buy' | 'sell';
}

export interface WalletStats {
  wallet: string;
  totalVolume: number;
  transactionCount: number;
  buyCount: number;
  sellCount: number;
}

export class OrganicStrategyService {
  /**
   * Analyze trading patterns to determine organic score
   */
  analyzeOrganicPattern(
    tokenAddress: string,
    transactions: TransactionData[]
  ): OrganicAnalysis {
    if (transactions.length === 0) {
      return {
        tokenAddress,
        organicScore: 0,
        uniqueWallets: 0,
        transactionCount: 0,
        walletConcentration: 1,
        isWashTrading: true,
        patternScore: 0,
        timestamp: Date.now(),
      };
    }

    const uniqueWallets = new Set(transactions.map(t => t.wallet)).size;
    const walletStats = this.calculateWalletStats(transactions);
    const walletConcentration = this.calculateWalletConcentration(walletStats, transactions);
    const isWashTrading = this.detectWashTrading(transactions, walletStats);
    const patternScore = this.analyzeTradingPatterns(transactions, walletStats);

    // Calculate organic score (0-100)
    let organicScore = 0;

    // Unique wallets factor (0-30 points)
    if (uniqueWallets >= config.organic.minUniqueWallets) {
      organicScore += Math.min(30, (uniqueWallets / config.organic.minUniqueWallets) * 15);
    }

    // Wallet concentration factor (0-25 points)
    if (walletConcentration <= config.organic.maxWalletConcentration) {
      organicScore += 25;
    } else {
      organicScore += Math.max(0, 25 * (1 - walletConcentration));
    }

    // Transaction count factor (0-20 points)
    if (transactions.length >= config.organic.minTransactionCount) {
      organicScore += Math.min(20, (transactions.length / config.organic.minTransactionCount) * 10);
    }

    // Wash trading penalty
    if (isWashTrading) {
      organicScore *= 0.3; // Reduce score by 70% if wash trading detected
    }

    // Pattern analysis factor (0-25 points)
    organicScore += patternScore * 0.25;

    organicScore = Math.min(100, Math.max(0, organicScore));

    return {
      tokenAddress,
      organicScore: Math.round(organicScore * 100) / 100,
      uniqueWallets,
      transactionCount: transactions.length,
      walletConcentration,
      isWashTrading,
      patternScore,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate statistics for each wallet
   */
  private calculateWalletStats(transactions: TransactionData[]): Map<string, WalletStats> {
    const stats = new Map<string, WalletStats>();

    for (const tx of transactions) {
      if (!stats.has(tx.wallet)) {
        stats.set(tx.wallet, {
          wallet: tx.wallet,
          totalVolume: 0,
          transactionCount: 0,
          buyCount: 0,
          sellCount: 0,
        });
      }

      const walletStat = stats.get(tx.wallet)!;
      walletStat.totalVolume += tx.amount;
      walletStat.transactionCount++;
      
      if (tx.type === 'buy') {
        walletStat.buyCount++;
      } else {
        walletStat.sellCount++;
      }
    }

    return stats;
  }

  /**
   * Calculate wallet concentration (percentage of volume from top wallet)
   */
  private calculateWalletConcentration(
    walletStats: Map<string, WalletStats>,
    transactions: TransactionData[]
  ): number {
    if (walletStats.size === 0) return 1;

    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    if (totalVolume === 0) return 1;

    const volumes = Array.from(walletStats.values())
      .map(stat => stat.totalVolume)
      .sort((a, b) => b - a);

    const topWalletVolume = volumes[0];
    return topWalletVolume / totalVolume;
  }

  /**
   * Detect wash trading patterns
   */
  private detectWashTrading(
    transactions: TransactionData[],
    walletStats: Map<string, WalletStats>
  ): boolean {
    if (!config.organic.washTradingDetection) {
      return false;
    }

    // Check for circular trading patterns
    const walletPairs = new Map<string, number>();
    
    for (let i = 0; i < transactions.length - 1; i++) {
      const tx1 = transactions[i];
      const tx2 = transactions[i + 1];
      
      // Check if same wallet trades back and forth quickly
      if (tx1.wallet === tx2.wallet && tx1.type !== tx2.type) {
        const timeDiff = tx2.timestamp - tx1.timestamp;
        if (timeDiff < 60000) { // Within 1 minute
          const pairKey = `${tx1.wallet}-${tx2.wallet}`;
          walletPairs.set(pairKey, (walletPairs.get(pairKey) || 0) + 1);
        }
      }
    }

    // If many rapid back-and-forth trades, likely wash trading
    const rapidTrades = Array.from(walletPairs.values()).filter(count => count > 3);
    if (rapidTrades.length > 0) {
      return true;
    }

    // Check for wallets with only buys or only sells (suspicious)
    for (const stat of walletStats.values()) {
      if (stat.transactionCount > 5 && (stat.buyCount === 0 || stat.sellCount === 0)) {
        return true;
      }
    }

    // Check for very high transaction count relative to unique wallets
    const uniqueWallets = walletStats.size;
    if (uniqueWallets > 0 && transactions.length / uniqueWallets > 20) {
      return true;
    }

    return false;
  }

  /**
   * Analyze trading patterns for natural behavior
   */
  private analyzeTradingPatterns(
    transactions: TransactionData[],
    walletStats: Map<string, WalletStats>
  ): number {
    if (!config.organic.patternAnalysisEnabled) {
      return 0.5; // Neutral score
    }

    let score = 0;
    let factors = 0;

    // Factor 1: Transaction size variance (natural trading has variance)
    const amounts = transactions.map(tx => tx.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length;
    const coefficientOfVariation = Math.sqrt(variance) / avgAmount;
    
    if (coefficientOfVariation > 0.3 && coefficientOfVariation < 2.0) {
      score += 0.3; // Good variance indicates natural trading
    }
    factors++;

    // Factor 2: Time distribution (natural trading is spread out)
    const timeIntervals: number[] = [];
    for (let i = 1; i < transactions.length; i++) {
      timeIntervals.push(transactions[i].timestamp - transactions[i - 1].timestamp);
    }
    
    if (timeIntervals.length > 0) {
      const avgInterval = timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;
      const intervalVariance = timeIntervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / timeIntervals.length;
      
      if (intervalVariance > avgInterval * 0.5) {
        score += 0.3; // Good time distribution
      }
    }
    factors++;

    // Factor 3: Buy/sell ratio (should be somewhat balanced)
    const buyCount = transactions.filter(tx => tx.type === 'buy').length;
    const sellCount = transactions.filter(tx => tx.type === 'sell').length;
    const totalCount = buyCount + sellCount;
    
    if (totalCount > 0) {
      const buyRatio = buyCount / totalCount;
      if (buyRatio > 0.3 && buyRatio < 0.7) {
        score += 0.2; // Balanced trading
      }
    }
    factors++;

    // Factor 4: Wallet diversity in transaction sizes
    const walletVolumeVariance: number[] = [];
    for (const stat of walletStats.values()) {
      if (stat.transactionCount > 1) {
        walletVolumeVariance.push(stat.totalVolume / stat.transactionCount);
      }
    }
    
    if (walletVolumeVariance.length > 1) {
      const avgWalletVolume = walletVolumeVariance.reduce((a, b) => a + b, 0) / walletVolumeVariance.length;
      const walletVariance = walletVolumeVariance.reduce((sum, vol) => sum + Math.pow(vol - avgWalletVolume, 2), 0) / walletVolumeVariance.length;
      
      if (walletVariance > avgWalletVolume * 0.2) {
        score += 0.2; // Good wallet diversity
      }
    }
    factors++;

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Check if token meets organic criteria
   */
  isOrganic(analysis: OrganicAnalysis): boolean {
    return (
      analysis.organicScore >= 50 &&
      analysis.uniqueWallets >= config.organic.minUniqueWallets &&
      analysis.transactionCount >= config.organic.minTransactionCount &&
      analysis.walletConcentration <= config.organic.maxWalletConcentration &&
      !analysis.isWashTrading
    );
  }
}

