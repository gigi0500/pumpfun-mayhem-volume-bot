import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { volumeRoutes } from './routes/volume.routes';
import { healthRoutes } from './routes/health.routes';
import { VolumeBot } from './services/volume.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/volume', volumeRoutes);

app.use(errorHandler);

const volumeBot = new VolumeBot();

app.listen(PORT, () => {
  logger.info(`📊 Volume Bot server running on port ${PORT}`);
  
  if (process.env.VOLUME_TRACKING_ENABLED === 'true') {
    volumeBot.start().catch((error) => {
      logger.error('Failed to start volume bot:', error);
    });
  }
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  volumeBot.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  volumeBot.stop();
  process.exit(0);
});

export default app;

