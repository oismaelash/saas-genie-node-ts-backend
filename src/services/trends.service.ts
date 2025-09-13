const { dailyTrends, realTimeTrends, autocomplete } = require('@shaivpidadi/trends-js');
import { TrendingStory, TrendsData } from '../types';

export class TrendsService {
  private geo: string;
  private lang: string;
  private maxIdeas: number;

  constructor(geo: string = 'BR', lang: string = 'pt', maxIdeas: number = 5) {
    this.geo = geo;
    this.lang = lang;
    this.maxIdeas = maxIdeas;
  }

  async fetchDailyTrends(): Promise<string[]> {
    try {
      console.log('🔍 Starting search for trending topics...');
      const data: TrendsData = await dailyTrends({ geo: this.geo, lang: this.lang });

      // order by traffic (most traffic) and get top results
      const sortedData = data.data.allTrendingStories
        .sort((a: TrendingStory, b: TrendingStory) => b.traffic - a.traffic)
        .slice(0, this.maxIdeas);

      // extract just the titles for idea generation
      const trendingTopics = sortedData.map((item: TrendingStory) => item.title);

      console.log('✅ Trending topics found:', trendingTopics);
      return trendingTopics;
    } catch (error) {
      console.error('❌ Error fetching trends:', error);
      throw new Error('Failed to get trending topics from Google Trends');
    }
  }

  async fetchRealTimeTrends(): Promise<string[]> {
    try {
      console.log('🔍 Starting search for real-time trending topics...');
      const data: TrendsData = await realTimeTrends({ geo: this.geo, lang: this.lang });

      // order by traffic (most traffic) and get top results
      const sortedData = data.data.allTrendingStories
        .sort((a: TrendingStory, b: TrendingStory) => b.traffic - a.traffic)
        .slice(0, this.maxIdeas);

      // extract just the titles for idea generation
      const trendingTopics = sortedData.map((item: TrendingStory) => item.title);

      console.log('✅ Real-time trending topics found:', trendingTopics);
      return trendingTopics;
    } catch (error) {
      console.error('❌ Error fetching real-time trends:', error);
      throw new Error('Failed to get real-time trending topics from Google Trends');
    }
  }

  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    try {
      console.log(`🔍 Getting autocomplete suggestions for: ${query}`);
      const suggestions = await autocomplete(query, { geo: this.geo, lang: this.lang });
      
      console.log('✅ Autocomplete suggestions found:', suggestions);
      return suggestions;
    } catch (error) {
      console.error('❌ Error fetching autocomplete suggestions:', error);
      throw new Error('Failed to get autocomplete suggestions from Google Trends');
    }
  }
}
