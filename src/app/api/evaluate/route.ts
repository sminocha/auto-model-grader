import { NextRequest, NextResponse } from 'next/server'
import { generateText, streamText } from 'ai'
import { ModelResult } from '@/types'
import { createGateway } from '@ai-sdk/gateway'
import { modelConfig, defaultModels } from '@/lib/models'

// Vercel AI Gateway configuration
const gateway = createGateway({
    apiKey: process.env.AI_GATEWAY_API_KEY, // the default environment variable for the API key
    baseURL: 'https://ai-gateway.vercel.sh/v1/ai', // the default base URL
})

async function callModel(modelId: string, prompt: string) {
    const startTime = Date.now()
    let firstTokenTime: number | null = null
    
    try {
        // Using shared model config from lib/models.ts

        const config = modelConfig[modelId as keyof typeof modelConfig] || { 
            name: modelId, 
            provider: 'Unknown',
            gatewayId: modelId
        }
        
        // Use streamText instead of generateText for real-time token tracking
        const result = await streamText({
            model: gateway(config.gatewayId), // Use the proper provider/model format
            prompt: prompt,
            maxOutputTokens: 500,
            temperature: 0.7,
        })

        // Collect the full response while tracking TTFT
        let fullResponse = ''
        let tokenCount = 0
        
        // Process the stream to get accurate TTFT
        for await (const chunk of result.textStream) {
            // Record the exact time when the first token arrives
            if (firstTokenTime === null && chunk.length > 0) {
                firstTokenTime = Date.now()
                console.log(`First token for ${config.name} arrived after ${firstTokenTime - startTime}ms`)
            }
            
            fullResponse += chunk
            // Rough token count (more accurate would be to use a tokenizer)
            tokenCount += Math.ceil(chunk.length / 4)
        }
        
        const endTime = Date.now()
        
        // If no tokens were received (shouldn't happen but good to check)
        if (firstTokenTime === null) {
            firstTokenTime = endTime
        }
        
        // Get usage data if available (some providers include this)
        const usage = await result.usage
        if (usage?.totalTokens) {
            tokenCount = usage.totalTokens
        }
        
        return {
            modelName: config.name,
            provider: config.provider,
            response: fullResponse,
            metrics: {
                timeToFirstToken: firstTokenTime - startTime,  // Actual measurement!
                totalGenerationTime: endTime - startTime,
                tokenCount: tokenCount
            }
        }
    } catch (error) {
        console.error(`Error calling model ${modelId}:`, error)
        
        // Fallback to mock data if gateway fails
        console.log("GATEWAY CALL FAILED, FALLING BACK TO MOCK DATA");
        const modelConfig = {
            'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI' },
            'gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'OpenAI' },
            'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
            'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', provider: 'Anthropic' },
            'llama-3.1-70b-instruct': { name: 'Llama 3.1 70B', provider: 'Meta' },
            'llama-3.1-8b-instruct': { name: 'Llama 3.1 8B', provider: 'Meta' }
        }
        
        const config = modelConfig[modelId as keyof typeof modelConfig] || { 
            name: modelId, 
            provider: 'Unknown' 
        }
        
        // Mock data with realistic TTFT values for different models
        const mockTTFT = {
            'gpt-4o': Math.round(Math.random() * 200 + 150),  // 150-350ms
            'gpt-4o-mini': Math.round(Math.random() * 150 + 100),  // 100-250ms
            'claude-3-5-sonnet-20241022': Math.round(Math.random() * 250 + 200),  // 200-450ms
            'claude-3-haiku-20240307': Math.round(Math.random() * 100 + 50),  // 50-150ms
            'llama-3.1-70b-instruct': Math.round(Math.random() * 300 + 250),  // 250-550ms
            'llama-3.1-8b-instruct': Math.round(Math.random() * 150 + 100),  // 100-250ms
        }
        
        return {
            modelName: config.name,
            provider: config.provider,
            response: generateMockResponse(prompt, modelId),
            metrics: {
                timeToFirstToken: mockTTFT[modelId as keyof typeof mockTTFT] || Math.round(Math.random() * 300 + 100),
                totalGenerationTime: Math.round(Math.random() * 3000 + 1000),
                tokenCount: Math.round(Math.random() * 300 + 100)
            }
        }
    }
}

// Alternative: If you want to show partial results in real-time to users
async function callModelWithProgressCallback(
    modelId: string, 
    prompt: string,
    onFirstToken?: (ttft: number) => void,
    onProgress?: (partialText: string) => void
) {
    const startTime = Date.now()
    let firstTokenTime: number | null = null
    
    try {
        const modelConfig = {
            'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI' },
            'gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'OpenAI' },
            'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
            'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', provider: 'Anthropic' },
            'llama-3.1-70b-instruct': { name: 'Llama 3.1 70B', provider: 'Meta' },
            'llama-3.1-8b-instruct': { name: 'Llama 3.1 8B', provider: 'Meta' }
    
        }

        const config = modelConfig[modelId as keyof typeof modelConfig] || { 
            name: modelId, 
            provider: 'Unknown' 
        }
        
        const result = await streamText({
            model: gateway(modelId),
            prompt: prompt,
            maxOutputTokens: 500,
            temperature: 0.7,
        })

        let fullResponse = ''
        let tokenCount = 0
        
        for await (const chunk of result.textStream) {
            if (firstTokenTime === null && chunk.length > 0) {
                firstTokenTime = Date.now()
                const ttft = firstTokenTime - startTime
                
                // Callback to update UI with TTFT immediately
                if (onFirstToken) {
                    onFirstToken(ttft)
                }
            }
            
            fullResponse += chunk
            tokenCount += Math.ceil(chunk.length / 4)
            
            // Callback to update UI with partial response
            if (onProgress) {
                onProgress(fullResponse)
            }
        }
        
        const endTime = Date.now()
        
        if (firstTokenTime === null) {
            firstTokenTime = endTime
        }
        
        const usage = await result.usage
        if (usage?.totalTokens) {
            tokenCount = usage.totalTokens
        }
        
        return {
            modelName: config.name,
            provider: config.provider,
            response: fullResponse,
            metrics: {
                timeToFirstToken: firstTokenTime - startTime,
                totalGenerationTime: endTime - startTime,
                tokenCount: tokenCount
            }
        }
    } catch (error) {
        // ... same error handling as above
        throw error
    }
}

// Mock function to simulate Vercel Gateway, use as fallback if call to Vercel gateway fails
// TODO: DELETE ONE OF THESE FALLBACK FUNCTIONS
async function callModelFallback(modelId: string, prompt: string) {
  const startTime = Date.now()
  let firstTokenTime = 0
  
  try {
    // Simulate different providers
    let provider: any
    let modelName: string
    
    if (modelId.includes('gpt')) {
      provider = 'OpenAI'
      modelName = 'GPT-4o'
    } else if (modelId.includes('claude')) {
      provider = 'Anthropic'
      modelName = 'Claude 3.5 Sonnet'
    } else {
      // For this demo, we'll simulate Llama 3 with OpenAI
      provider = 'OpenAI'
      modelName = 'Llama 3.1 (via OpenAI)'
    }

    const result = await generateText({
      model: provider(modelId),
      prompt: prompt,
      maxOutputTokens: 500,
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
    // TODO: add rubrics from gemini??
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
            model: gateway('anthropic/claude-3-5-haiku'),
            prompt: judgePrompt,
            maxOutputTokens: 200,
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
        const body = await request.json()
        const { prompt, models: requestModels } = body

        if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
        }

        // Use models from request or fall back to defaults
        const models = requestModels || defaultModels

        // Call all models in parallel
        console.log('Calling models in parallel...')
        const modelPromises = models.map((modelId: string) => callModel(modelId, prompt))
        const modelResponses = await Promise.all(modelPromises)

        // Judge all responses in parallel
        console.log('Judging responses...')
        const judgePromises = modelResponses.map((response: any) => 
        judgeResponse(prompt, response.response, response.modelName)
        )
        const scores = await Promise.all(judgePromises)

        // Combine results
        const results: ModelResult[] = modelResponses.map((response: any, index: number) => ({
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
