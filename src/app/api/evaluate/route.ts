import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { ModelResult } from '@/types'

// Mock function to simulate Vercel Gateway
// In a real implementation, you'd use the actual Vercel AI Gateway
async function callModel(modelId: string, prompt: string) {
  const startTime = Date.now()
  let firstTokenTime = 0
  
  try {
    // Simulate different providers
    let provider: any
    let modelName: string
    
    if (modelId.includes('gpt')) {
      provider = openai
      modelName = 'GPT-4o'
    } else if (modelId.includes('claude')) {
      provider = anthropic
      modelName = 'Claude 3.5 Sonnet'
    } else {
      // For this demo, we'll simulate Llama 3 with OpenAI
      provider = openai
      modelName = 'Llama 3.1 (via OpenAI)'
    }

    const result = await generateText({
      model: provider(modelId),
      prompt: prompt,
      maxTokens: 500,
    })

    const endTime = Date.now()
    firstTokenTime = startTime + Math.random() * 500 + 100 // Simulate TTFT
    
    return {
      modelName,
      provider: modelId.includes('gpt') ? 'OpenAI' : modelId.includes('claude') ? 'Anthropic' : 'Meta',
      response: result.text,
      metrics: {
        timeToFirstToken: Math.round(firstTokenTime - startTime),
        totalGenerationTime: endTime - startTime,
        tokenCount: result.usage?.totalTokens || Math.floor(result.text.length / 4)
      }
    }
  } catch (error) {
    console.error(`Error with model ${modelId}:`, error)
    
    // Return mock data for demo purposes when API keys aren't available
    return {
      modelName: modelId.includes('gpt') ? 'GPT-4o' : modelId.includes('claude') ? 'Claude 3.5 Sonnet' : 'Llama 3.1',
      provider: modelId.includes('gpt') ? 'OpenAI' : modelId.includes('claude') ? 'Anthropic' : 'Meta',
      response: generateMockResponse(prompt, modelId),
      metrics: {
        timeToFirstToken: Math.round(Math.random() * 500 + 100),
        totalGenerationTime: Math.round(Math.random() * 3000 + 1000),
        tokenCount: Math.round(Math.random() * 300 + 100)
      }
    }
  }
}

function generateMockResponse(prompt: string, modelId: string): string {
  const responses = {
    'gpt-4o': `Here's a comprehensive solution for "${prompt.substring(0, 50)}...":\n\nI'll approach this systematically by breaking down the requirements and implementing a robust solution. Let me start with the core functionality and then add error handling and optimizations.\n\n[This is a demo response - would contain actual GPT-4o output with API key]`,
    'claude-3-5-sonnet-20241022': `I'd be happy to help with "${prompt.substring(0, 50)}..."!\n\nLet me think through this step by step:\n\n1. First, I'll analyze the key requirements\n2. Then I'll design an efficient approach\n3. Finally, I'll implement with best practices\n\n[This is a demo response - would contain actual Claude output with API key]`,
    'llama-3-70b': `For the task "${prompt.substring(0, 50)}...", here's my approach:\n\nI'll provide a clear, practical solution that focuses on efficiency and readability. Let me break this down into manageable steps.\n\n[This is a demo response - would contain actual Llama output with API key]`
  }
  
  return responses[modelId as keyof typeof responses] || `Mock response for ${modelId}: ${prompt.substring(0, 100)}...`
}

async function judgeResponse(prompt: string, response: string, modelName: string) {
  const judgePrompt = `
You are an expert AI evaluator. Rate the following response on a scale of 1-5 based on:
- Instruction following (did it answer what was asked?)
- Quality and accuracy of the response
- Clarity and usefulness
- Completeness

Original Prompt: "${prompt}"

Model: ${modelName}
Response: "${response}"

Provide your rating (1-5) and brief reasoning. Format: Rating: X.X | Reasoning: [your analysis]
`

  try {
    // Use Claude Haiku as the judge (faster and cheaper)
    const result = await generateText({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: judgePrompt,
      maxTokens: 200,
    })

    const text = result.text
    const ratingMatch = text.match(/Rating:\s*([0-5]\.?[0-9]?)/)
    const reasoningMatch = text.match(/Reasoning:\s*(.+)/)
    
    return {
      rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3.5,
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : 'Unable to parse judge reasoning'
    }
  } catch (error) {
    console.error('Error in judging:', error)
    
    // Mock judging for demo
    const mockRatings = [3.2, 3.8, 4.1, 4.5, 2.9, 3.7, 4.3]
    const rating = mockRatings[Math.floor(Math.random() * mockRatings.length)]
    
    return {
      rating,
      reasoning: `Mock judge score for ${modelName}. Response shows ${rating > 4 ? 'excellent' : rating > 3.5 ? 'good' : 'adequate'} quality with clear ${rating > 4 ? 'comprehensive coverage' : rating > 3.5 ? 'adequate coverage' : 'basic coverage'} of the prompt requirements. [Demo mode - would contain actual AI judge analysis]`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    // Define models to test
    const models = [
      'gpt-4o',
      'claude-3-5-sonnet-20241022', 
      'llama-3-70b'
    ]

    // Call all models in parallel
    console.log('Calling models in parallel...')
    const modelPromises = models.map(modelId => callModel(modelId, prompt))
    const modelResponses = await Promise.all(modelPromises)

    // Judge all responses in parallel
    console.log('Judging responses...')
    const judgePromises = modelResponses.map(response => 
      judgeResponse(prompt, response.response, response.modelName)
    )
    const scores = await Promise.all(judgePromises)

    // Combine results
    const results: ModelResult[] = modelResponses.map((response, index) => ({
      ...response,
      score: scores[index]
    }))

    return NextResponse.json({ results })

  } catch (error) {
    console.error('Error in evaluate API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
