import * as cron from 'node-cron';
import { SaasGenieApp } from '../index';

export interface SchedulerConfig {
  cronExpression: string;
  timezone?: string;
  enabled: boolean;
}

export class SchedulerService {
  private config: SchedulerConfig;
  private app: SaasGenieApp;
  private task?: cron.ScheduledTask;

  constructor(config: SchedulerConfig) {
    this.config = config;
    this.app = new SaasGenieApp();
  }

  /**
   * Starts the cron job scheduler
   */
  public start(): void {
    if (!this.config.enabled) {
      console.log('⏸️  Scheduler is disabled. Set SCHEDULER_ENABLED=true to enable.');
      return;
    }

    if (!cron.validate(this.config.cronExpression)) {
      throw new Error(`Invalid cron expression: ${this.config.cronExpression}`);
    }

    console.log(`⏰ Starting scheduler with cron expression: ${this.config.cronExpression}`);
    
    if (this.config.timezone) {
      console.log(`🌍 Timezone: ${this.config.timezone}`);
    }

    this.task = cron.schedule(
      this.config.cronExpression,
      async () => {
        console.log('\n🕐 Scheduled execution started...');
        try {
          await this.app.run();
          console.log('✅ Scheduled execution completed successfully!');
        } catch (error) {
          console.error('❌ Scheduled execution failed:', error);
        }
      },
      {
        timezone: this.config.timezone
      }
    );
    console.log('✅ Scheduler started successfully!');
    console.log('📅 Next execution will be according to the cron schedule.');
  }

  /**
   * Stops the cron job scheduler
   */
  public stop(): void {
    if (this.task) {
      this.task.stop();
      console.log('⏹️  Scheduler stopped.');
    }
  }

  /**
   * Gets the status of the scheduler
   */
  public getStatus(): { running: boolean; nextExecution?: Date } {
    if (!this.task) {
      return { running: false };
    }

    return {
      running: this.task.getStatus() === 'scheduled',
      nextExecution: this.getNextExecution()
    };
  }

  /**
   * Gets the next scheduled execution time
   */
  private getNextExecution(): Date | undefined {
    // This is a simplified calculation - in a real scenario you might want to use
    // a more sophisticated library like 'cron-parser' for precise next execution times
    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // For daily execution, assume it runs at the same time tomorrow
      // You can enhance this with more sophisticated logic
      return tomorrow;
    } catch (error) {
      console.warn('Could not calculate next execution time:', error);
      return undefined;
    }
  }

  /**
   * Runs the job immediately (useful for testing)
   */
  public async runNow(): Promise<void> {
    console.log('🚀 Running scheduled job immediately...');
    try {
      await this.app.run();
      console.log('✅ Immediate execution completed successfully!');
    } catch (error) {
      console.error('❌ Immediate execution failed:', error);
      throw error;
    }
  }
}
