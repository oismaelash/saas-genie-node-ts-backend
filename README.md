# SaaS Genie 🚀

SaaS Genie is a tool that identifies current trends and generates innovative SaaS business ideas based on those trends.

## 🏗️ Modular Architecture

The application has been divided into separate modules for better organization and maintainability:

### 📁 File Structure

```
src/
├── index.ts                    # Main application entry point
├── types.ts                    # TypeScript interfaces and types
└── services/
    ├── trends.service.ts       # Service for fetching Google Trends data
    ├── openai.service.ts       # Service for generating ideas using OpenAI
    ├── forem.service.ts        # Service for publishing articles to Dev.to
    └── scheduler.service.ts    # Service for automatic execution via cron
```

### 🔧 Modules

#### 1. **Types (`types.ts`)**
Defines all TypeScript interfaces and types used in the application:
- `TrendingStory`: Data structure for trending topics
- `SaaSIdea`: Structure for SaaS ideas
- `PublishResult`: Result of article publication
- `AppConfig`: Application configuration

#### 2. **Trends Service (`services/trends.service.ts`)**
Responsible for fetching trends from Google Trends:
- `fetchDailyTrends()`: Fetches daily trends
- `fetchRealTimeTrends()`: Fetches real-time trends
- `getAutocompleteSuggestions()`: Gets autocomplete suggestions

#### 3. **OpenAI Service (`services/openai.service.ts`)**
Manages idea generation using AI:
- `generateSaaSIdeas()`: Generates SaaS ideas based on trends
- `generateCustomIdeas()`: Generates custom ideas
- `analyzeTrendingTopics()`: Analyzes trending topics
- `parseSaaSIdeas()`: Converts ideas to structured format

#### 4. **Forem Service (`services/forem.service.ts`)**
Manages article publishing on Dev.to:
- `publishArticle()`: Publishes article directly
- `publishDraft()`: Creates draft
- `updateArticle()`: Updates existing article
- `getArticle()`: Fetches specific article
- `getUserArticles()`: Lists user articles

#### 5. **Scheduler Service (`services/scheduler.service.ts`)**
Manages automatic execution via cron job:
- `start()`: Starts the scheduler
- `stop()`: Stops the scheduler
- `getStatus()`: Gets current status
- `runNow()`: Executes immediately (for testing)

#### 6. **Main App (`index.ts`)**
Main class that coordinates all services:
- `SaasGenieApp`: Main application class
- `run()`: Executes main flow with daily trends
- `runWithRealTimeTrends()`: Executes with real-time trends
- `analyzeTrends()`: Executes trend analysis

## 🚀 How to Use

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file with the following variables:
```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
FOREM_API_KEY=your_dev_to_key
FOREM_BASE_URL=https://dev.to/api
PUBLISH_ARTICLE=false
MAX_IDEAS=5
GEO=BR
LANG=pt
SCHEDULER_ENABLED=true
SCHEDULER_CRON=0 9 * * *
SCHEDULER_TIMEZONE=America/Sao_Paulo
```

### Execution

#### Default Mode (Daily Trends)
```bash
npm run dev
# or
npm run build && npm start
```

#### Real-time Mode
```bash
npm run dev:realtime
# or
npm run build && npm run start:realtime
```

#### Analysis Mode
```bash
npm run dev:analyze
# or
npm run build && npm run start:analyze
```

#### Scheduler Mode (Automatic Execution)
```bash
npm run dev:scheduler
# or
npm run build && npm run start:scheduler
```

> 📅 **New!** The scheduler mode automatically runs once per day via cron job. See [SCHEDULER.md](./SCHEDULER.md) for detailed configuration.

## 🎯 Features

### 1. **Trend Search**
- Daily Google Trends
- Real-time trends
- Support for different countries and languages
- Sorting by traffic volume

### 2. **Idea Generation**
- SaaS ideas based on current trends
- Business opportunity analysis
- Target audience and monetization suggestions
- Multiple AI models supported

### 3. **Automatic Publishing**
- Direct publishing to Dev.to
- Draft creation
- Existing article updates
- Automatic formatting with hashtags

## 🔧 Advanced Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `FOREM_API_KEY` | Dev.to API key | Optional |
| `PUBLISH_ARTICLE` | Automatically publish articles | `false` |
| `MAX_IDEAS` | Maximum number of ideas | `5` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` |
| `GEO` | Country for trends | `US` |
| `LANG` | Language for trends | `en` |
| `FOREM_BASE_URL` | Forem API base URL | `https://dev.to/api` |
| `SCHEDULER_ENABLED` | Enable scheduler mode | `false` |
| `SCHEDULER_CRON` | Cron expression for scheduling | `0 9 * * *` |
| `SCHEDULER_TIMEZONE` | Timezone for execution | `America/New_York` |

### Available Scripts

```bash
npm run build            # Compiles TypeScript
npm run start            # Runs default mode
npm run start:realtime   # Runs real-time mode
npm run start:analyze    # Runs analysis mode
npm run start:scheduler  # Runs scheduler mode
npm run dev              # Development default mode
npm run dev:realtime     # Development real-time mode
npm run dev:analyze      # Development analysis mode
npm run dev:scheduler    # Development scheduler mode
npm run clean            # Cleans compiled files
```

## 🏆 Benefits of Modular Architecture

1. **Maintainability**: Each module has a single responsibility
2. **Testability**: Modules can be tested independently
3. **Reusability**: Services can be reused in other projects
4. **Scalability**: Easy to add new services and features
5. **Organization**: Well-structured code that's easy to navigate

## 🔮 Next Steps

- [ ] Add unit tests for each service
- [ ] Implement cache for trends
- [ ] Add support for more publishing platforms
- [ ] Create web interface
- [ ] Add metrics and analytics
- [ ] Implement publication scheduling