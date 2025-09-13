const axios = require('axios');
import { ArticleData, PublishResult } from '../types';

export class ForemService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://dev.to/api') {
    if (!apiKey) {
      throw new Error('FOREM_API_KEY not found in environment variables');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async publishArticle(content: string, trendingTopics: string[]): Promise<PublishResult> {
    try {
      console.log('\n📝 Starting article publication to Forem (Dev.to)...');

      const articleData = this.createArticleData(content, trendingTopics);

      console.log('📤 Publishing article to Dev.to...');
      
      const response = await axios.post(`${this.baseUrl}/articles`, articleData, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.url) {
        console.log('✅ Article published successfully!');
        console.log(`🔗 Article URL: ${response.data.url}`);
        return {
          success: true,
          url: response.data.url,
          id: response.data.id
        };
      } else {
        throw new Error('Unexpected response format from Forem API');
      }

    } catch (error: any) {
      console.error('❌ Error publishing article to Forem:', error.response?.data || error.message);
      throw error;
    }
  }

  async publishDraft(content: string, trendingTopics: string[]): Promise<PublishResult> {
    try {
      console.log('\n📝 Starting draft publication to Forem (Dev.to)...');

      const articleData = this.createArticleData(content, trendingTopics, false);

      console.log('📤 Creating draft on Dev.to...');
      
      const response = await axios.post(`${this.baseUrl}/articles`, articleData, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.id) {
        console.log('✅ Draft created successfully!');
        console.log(`🔗 Draft ID: ${response.data.id}`);
        return {
          success: true,
          id: response.data.id
        };
      } else {
        throw new Error('Unexpected response format from Forem API');
      }

    } catch (error: any) {
      console.error('❌ Error creating draft on Forem:', error.response?.data || error.message);
      throw error;
    }
  }

  async getArticle(articleId: number): Promise<any> {
    try {
      console.log(`📖 Fetching article ${articleId} from Dev.to...`);
      
      const response = await axios.get(`${this.baseUrl}/articles/${articleId}`, {
        headers: {
          'api-key': this.apiKey
        }
      });

      console.log('✅ Article fetched successfully!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching article:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateArticle(articleId: number, content: string, trendingTopics: string[]): Promise<PublishResult> {
    try {
      console.log(`📝 Updating article ${articleId} on Dev.to...`);

      const articleData = this.createArticleData(content, trendingTopics);

      const response = await axios.put(`${this.baseUrl}/articles/${articleId}`, articleData, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.url) {
        console.log('✅ Article updated successfully!');
        console.log(`🔗 Article URL: ${response.data.url}`);
        return {
          success: true,
          url: response.data.url,
          id: response.data.id
        };
      } else {
        throw new Error('Unexpected response format from Forem API');
      }

    } catch (error: any) {
      console.error('❌ Error updating article:', error.response?.data || error.message);
      throw error;
    }
  }

  private createArticleData(content: string, trendingTopics: string[], published: boolean = true): ArticleData {
    // Create article title based on trending topics
    const title = `💡 Ideias de SaaS Baseadas nas Tendências: ${trendingTopics.slice(0, 3).join(', ')}`;

    // Format the content for Dev.to
    const articleContent = `# ${title}

${content}

---

*Este artigo foi gerado automaticamente pelo SaaS Genie, uma ferramenta que identifica tendências e gera ideias de negócios SaaS inovadores.*

**Tópicos em alta analisados:** ${trendingTopics.join(', ')}

#saas #startup #tendencias #negocios #inovacao`;

    return {
      article: {
        title: title,
        body_markdown: articleContent,
        published: published,
        tags: ['saas', 'startup', 'tendencias', 'negocios'],
        canonical_url: '',
        description: `Ideias inovadoras de SaaS baseadas nas tendências atuais: ${trendingTopics.slice(0, 3).join(', ')}`
      }
    };
  }

  async getUserArticles(username?: string): Promise<any[]> {
    try {
      const endpoint = username 
        ? `${this.baseUrl}/articles?username=${username}`
        : `${this.baseUrl}/articles/me`;
        
      console.log('📖 Fetching user articles from Dev.to...');
      
      const response = await axios.get(endpoint, {
        headers: {
          'api-key': this.apiKey
        }
      });

      console.log(`✅ Fetched ${response.data.length} articles successfully!`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching user articles:', error.response?.data || error.message);
      throw error;
    }
  }
}
