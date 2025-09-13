const OpenAI = require('openai');
import { SaaSIdea } from '../types';

export class OpenAIService {
  private client: any;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateSaaSIdeas(trendingTopics: string[]): Promise<string> {
    try {
      console.log('\n🤖 Starting SaaS idea generation with ChatGPT...');

      const prompt = this.createPrompt(trendingTopics);

      console.log('📝 Sending prompt to ChatGPT...');
      console.log(`🤖 Using model: ${this.model}`);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }]
      });

      console.log('\n💡 SaaS ideas based on trends:\n');
      console.log(response.choices[0].message.content);

      return response.choices[0].message.content;
    } catch (error) {
      console.error('❌ Error generating SaaS ideas:', error);
      throw error;
    }
  }

  async generateCustomIdeas(prompt: string): Promise<string> {
    try {
      console.log('\n🤖 Starting custom idea generation with ChatGPT...');

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }]
      });

      console.log('\n💡 Custom ideas generated:\n');
      console.log(response.choices[0].message.content);

      return response.choices[0].message.content;
    } catch (error) {
      console.error('❌ Error generating custom ideas:', error);
      throw error;
    }
  }

  async analyzeTrendingTopics(trendingTopics: string[]): Promise<string> {
    try {
      console.log('\n🤖 Starting trend analysis with ChatGPT...');

      const prompt = `
Analise os seguintes tópicos em alta no Brasil: ${trendingTopics.join(', ')}.
Forneça uma análise detalhada incluindo:
- Por que esses tópicos estão em alta
- Oportunidades de negócio identificadas
- Tendências de mercado relacionadas
- Recomendações para empreendedores
`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }]
      });

      console.log('\n📊 Trend analysis completed:\n');
      console.log(response.choices[0].message.content);

      return response.choices[0].message.content;
    } catch (error) {
      console.error('❌ Error analyzing trends:', error);
      throw error;
    }
  }

  private createPrompt(trendingTopics: string[]): string {
    return `
Os seguintes tópicos estão em alta no Brasil: ${trendingTopics.join(', ')}.
Crie até 5 ideias de projetos SaaS inovadores que aproveitem essas tendências.
Para cada ideia, descreva:
- Tópico em alta
- Nome do SaaS
- Problema que resolve
- Público-alvo
- Solução
- Modelo de monetização
`;
  }

  async parseSaaSIdeas(content: string): Promise<SaaSIdea[]> {
    try {
      console.log('\n🤖 Parsing SaaS ideas with ChatGPT...');

      const prompt = `
Parse o seguinte conteúdo e extraia as ideias de SaaS em formato JSON.
Para cada ideia, extraia: topic, name, problem, targetAudience, solution, monetization.
Retorne apenas um array JSON válido.

Conteúdo:
${content}
`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }]
      });

      const jsonString = response.choices[0].message.content;
      const ideas: SaaSIdea[] = JSON.parse(jsonString);

      console.log(`✅ Parsed ${ideas.length} SaaS ideas`);
      return ideas;
    } catch (error) {
      console.error('❌ Error parsing SaaS ideas:', error);
      throw error;
    }
  }
}
