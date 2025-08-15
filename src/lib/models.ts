export interface ModelConfig {
  name: string
  provider: string
  gatewayId: string
}

export const modelConfig: Record<string, ModelConfig> = {
  'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI', gatewayId: 'openai/gpt-4o' },
  'gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'OpenAI', gatewayId: 'openai/gpt-4o-mini' },
  'gpt-5': { name: 'GPT-5', provider: 'OpenAI', gatewayId: 'openai/gpt-5' },
  'claude-3-7-sonnet': { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', gatewayId: 'anthropic/claude-3-7-sonnet' },
  'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', gatewayId: 'anthropic/claude-3-5-sonnet-20241022' },
  'claude-3-5-haiku': { name: 'Claude 3.5 Haiku', provider: 'Anthropic', gatewayId: 'anthropic/claude-3-5-haiku' },
  'llama-3.1-8b': { name: 'Llama 3.1 8B', provider: 'Meta', gatewayId: 'meta/llama-3.1-8b' },
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', provider: 'Google', gatewayId: 'google/gemini-2.5-flash' }
}

export const getAvailableModels = (): Array<{id: string, config: ModelConfig}> => {
  return Object.entries(modelConfig).map(([id, config]) => ({ id, config }))
}

export const defaultModels = [
  'gpt-4o',
  'claude-3-7-sonnet', 
  'claude-3-5-haiku'
]
