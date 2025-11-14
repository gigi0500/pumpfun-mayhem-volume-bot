import { Router, Request, Response } from 'express';
import { VolumeBot } from '../services/volume.service';

const router = Router();
const volumeBot = new VolumeBot();

router.get('/status', (req: Request, res: Response) => {
  try {
    const status = volumeBot.getStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get status' });
  }
});

router.get('/tokens', (req: Request, res: Response) => {
  try {
    const volumeData = volumeBot.getVolumeData();
    res.json({ success: true, data: volumeData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get tokens' });
  }
});

router.get('/token/:address', (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const volumeData = volumeBot.getVolumeData(address);
    
    if (volumeData.length === 0) {
      return res.status(404).json({ success: false, error: 'Token not found' });
    }
    
    const analysis = volumeBot.getOrganicAnalysis(address);
    res.json({ 
      success: true, 
      data: {
        ...volumeData[0],
        organicAnalysis: analysis,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get token volume' });
  }
});

router.get('/spikes', (req: Request, res: Response) => {
  try {
    const spikes = volumeBot.getVolumeSpikes();
    res.json({ success: true, data: spikes });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get volume spikes' });
  }
});

router.get('/organic', (req: Request, res: Response) => {
  try {
    const organicTokens = volumeBot.getOrganicTokens();
    res.json({ success: true, data: organicTokens });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get organic tokens' });
  }
});

router.get('/history/:address?', (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const history = volumeBot.getVolumeHistory(address);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get volume history' });
  }
});

router.post('/track', (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.body;
    
    if (!tokenAddress) {
      return res.status(400).json({ success: false, error: 'Token address is required' });
    }
    
    volumeBot.trackToken(tokenAddress);
    res.json({ success: true, message: 'Token added to tracking' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to track token' });
  }
});

router.post('/untrack', (req: Request, res: Response) => {
  try {
    const { tokenAddress } = req.body;
    
    if (!tokenAddress) {
      return res.status(400).json({ success: false, error: 'Token address is required' });
    }
    
    volumeBot.untrackToken(tokenAddress);
    res.json({ success: true, message: 'Token removed from tracking' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to untrack token' });
  }
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    await volumeBot.start();
    res.json({ success: true, message: 'Volume bot started' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start bot' });
  }
});

router.post('/stop', (req: Request, res: Response) => {
  try {
    volumeBot.stop();
    res.json({ success: true, message: 'Volume bot stopped' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to stop bot' });
  }
});

export { router as volumeRoutes };

