# AI Model Performance Grader

A Next.js application that compares AI model performance side-by-side with automated scoring. Built for demonstrating modern AI development practices and Vercel platform capabilities.

## Features

- 🚀 **Parallel Model Evaluation**: Test prompts across multiple AI models simultaneously
- 🤖 **AI Judge Scoring**: Automated evaluation using Claude Haiku as a judge
- 📊 **Performance Metrics**: Track TTFT, generation time, and token counts
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- ⚡ **Real-time Results**: Live updates with loading states and animations

## Models Supported

- **GPT-4o** (OpenAI)
- **Claude 3.5 Sonnet** (Anthropic)
- **Llama 3.1** (via Vercel AI Gateway)

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   Add your API keys:
   - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - `ANTHROPIC_API_KEY`: Get from [Anthropic Console](https://console.anthropic.com/)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## How It Works

1. **Input**: Enter any prompt you want to test
2. **Parallel Processing**: The app sends your prompt to multiple AI models using `Promise.all`
3. **Automated Judging**: Claude Haiku evaluates each response on instruction following, quality, and accuracy
4. **Visual Comparison**: Results are displayed in an easy-to-compare format with metrics and rankings

## Technical Highlights

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vercel AI SDK** for model interactions
- **Parallel API calls** for optimal performance
- **Responsive design** for all devices

## Demo Mode

The app includes mock responses when API keys aren't configured, so you can see the full functionality even without API access.

## Deployment

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/model-grader)

## Architecture

```
src/
├── app/
│   ├── api/evaluate/     # API route for model evaluation
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── ModelComparisonForm.tsx
│   └── ResultsDisplay.tsx
└── types/
    └── index.ts          # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
