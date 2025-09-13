export interface TrendingStory {
  title: string;
  traffic: number;
  articleUrl?: string;
  snippet?: string;
}

export interface TrendsData {
  data: {
    allTrendingStories: TrendingStory[];
  };
}

export interface SaaSIdea {
  topic: string;
  name: string;
  problem: string;
  targetAudience: string;
  solution: string;
  monetization: string;
}

export interface ArticleData {
  article: {
    title: string;
    body_markdown: string;
    published: boolean;
    tags: string[];
    canonical_url: string;
    description: string;
  };
}

export interface PublishResult {
  success: boolean;
  url?: string;
  id?: number;
}

export interface AppConfig {
  maxIdeas: number;
  openaiModel: string;
  shouldPublish: boolean;
  geo: string;
  lang: string;
}
