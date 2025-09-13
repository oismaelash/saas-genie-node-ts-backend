require('dotenv').config();

import { TrendsService } from './services/trends.service';
import { OpenAIService } from './services/openai.service';
import { ForemService } from './services/forem.service';
import { SchedulerService, SchedulerConfig } from './services/scheduler.service';
import { AppConfig } from './types';

export class SaasGenieApp {
  private trendsService!: TrendsService;
  private openaiService!: OpenAIService;
  private foremService?: ForemService;
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.initializeServices();
  }

  private loadConfig(): AppConfig {
    return {
      maxIdeas: parseInt(process.env.MAX_IDEAS || '5'),
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      shouldPublish: process.env.PUBLISH_ARTICLE === 'true',
      geo: process.env.GEO || 'BR',
      lang: process.env.LANG || 'pt'
    };
  }

  private initializeServices(): void {
    this.trendsService = new TrendsService(
      this.config.geo,
      this.config.lang,
      this.config.maxIdeas
    );

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    this.openaiService = new OpenAIService(openaiApiKey, this.config.openaiModel);

    const foremApiKey = process.env.FOREM_API_KEY;
    if (foremApiKey) {
      this.foremService = new ForemService(
        foremApiKey,
        process.env.FOREM_BASE_URL || 'https://dev.to/api'
      );
    }
  }

  async run(): Promise<void> {
    console.log('🚀 Starting SaaS Genie - Trend-Based Idea Generator...\n');

    try {
      // Get trending topics
      const trendingTopics = await this.trendsService.fetchDailyTrends();

      // Generate SaaS ideas based on trending topics
      const saasIdeas = await this.openaiService.generateSaaSIdeas(trendingTopics);

      // Check if article publishing is enabled
      if (this.config.shouldPublish && saasIdeas && this.foremService) {
        console.log('\n📰 Article publishing is enabled...');
        try {
          const publishResult = await this.foremService.publishArticle(saasIdeas, trendingTopics);
          if (publishResult.success) {
            console.log(`\n🎉 Article successfully published! Check it out: ${publishResult.url}`);
          }
        } catch (publishError: any) {
          console.error('⚠️  Article publishing failed, but SaaS ideas were generated successfully');
          console.error('Publishing error:', publishError.message);
        }
      } else if (!this.config.shouldPublish) {
        console.log('\n📰 Article publishing is disabled. Set PUBLISH_ARTICLE=true in .env to enable.');
      } else if (!this.foremService) {
        console.log('\n📰 Forem API key not configured. Set FOREM_API_KEY in .env to enable publishing.');
      }

      console.log('\n✅ Process completed successfully!');
    } catch (error) {
      console.error('❌ Error during execution:', error);
      process.exit(1);
    }
  }

  async runWithRealTimeTrends(): Promise<void> {
    console.log('🚀 Starting SaaS Genie with Real-Time Trends...\n');

    try {
      // Get real-time trending topics
      const trendingTopics = await this.trendsService.fetchRealTimeTrends();

      // Generate SaaS ideas based on trending topics
      const saasIdeas = await this.openaiService.generateSaaSIdeas(trendingTopics);

      // Check if article publishing is enabled
      if (this.config.shouldPublish && saasIdeas && this.foremService) {
        console.log('\n📰 Article publishing is enabled...');
        try {
          const publishResult = await this.foremService.publishArticle(saasIdeas, trendingTopics);
          if (publishResult.success) {
            console.log(`\n🎉 Article successfully published! Check it out: ${publishResult.url}`);
          }
        } catch (publishError: any) {
          console.error('⚠️  Article publishing failed, but SaaS ideas were generated successfully');
          console.error('Publishing error:', publishError.message);
        }
      } else if (!this.config.shouldPublish) {
        console.log('\n📰 Article publishing is disabled. Set PUBLISH_ARTICLE=true in .env to enable.');
      } else if (!this.foremService) {
        console.log('\n📰 Forem API key not configured. Set FOREM_API_KEY in .env to enable publishing.');
      }

      console.log('\n✅ Process completed successfully!');
    } catch (error) {
      console.error('❌ Error during execution:', error);
      process.exit(1);
    }
  }

  async analyzeTrends(): Promise<void> {
    console.log('🚀 Starting Trend Analysis...\n');

    try {
      // Get trending topics
      const trendingTopics = await this.trendsService.fetchDailyTrends();

      // Analyze trends
      const analysis = await this.openaiService.analyzeTrendingTopics(trendingTopics);

      console.log('\n📊 Trend Analysis Results:\n');
      console.log(analysis);

      console.log('\n✅ Trend analysis completed successfully!');
    } catch (error) {
      console.error('❌ Error during trend analysis:', error);
      process.exit(1);
    }
  }
}

// Scheduler execution function
async function runScheduler(): Promise<void> {
  console.log('⏰ Starting SaaS Genie Scheduler...\n');

  const schedulerConfig: SchedulerConfig = {
    cronExpression: process.env.SCHEDULER_CRON || '0 9 * * *', // Default: daily at 9 AM
    timezone: process.env.SCHEDULER_TIMEZONE || 'America/Sao_Paulo',
    enabled: process.env.SCHEDULER_ENABLED === 'true'
  };

  console.log('📋 Scheduler Configuration:');
  console.log(`   - Cron Expression: ${schedulerConfig.cronExpression}`);
  console.log(`   - Timezone: ${schedulerConfig.timezone}`);
  console.log(`   - Enabled: ${schedulerConfig.enabled}\n`);

  const scheduler = new SchedulerService(schedulerConfig);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down scheduler gracefully...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down scheduler gracefully...');
    scheduler.stop();
    process.exit(0);
  });

  // Start the scheduler
  scheduler.start();

  // Keep the process running
  console.log('🔄 Scheduler is running. Press Ctrl+C to stop.');
  
  // Log status every hour
  setInterval(() => {
    const status = scheduler.getStatus();
    console.log(`📊 Scheduler Status: ${status.running ? 'Running' : 'Stopped'}`);
  }, 60 * 60 * 1000); // Every hour
}

// Main execution function
async function main() {
  const app = new SaasGenieApp();
  
  // Check command line arguments for different modes
  const mode = process.argv[2] || 'daily';
  
  switch (mode) {
    case 'realtime':
      await app.runWithRealTimeTrends();
      break;
    case 'analyze':
      await app.analyzeTrends();
      break;
    case 'scheduler':
      await runScheduler();
      break;
    case 'daily':
    default:
      await app.run();
      break;
  }
}

// Run the main function
main().catch(console.error);
