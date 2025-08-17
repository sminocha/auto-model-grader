export type RubricType = 'code-generation' | 'summarization' | 'creative-writing'

export interface RubricCriteria {
  [key: string]: {
    score: number
    reasoning: string
  }
}

export interface ModelResult {
  modelName: string
  provider: string
  response: string
  metrics: {
    timeToFirstToken: number
    totalGenerationTime: number
    tokenCount: number
  }
  score: {
    rating: number
    reasoning: string
    criteria?: RubricCriteria
  }
}

export interface EvaluationRequest {
  prompt: string
  models?: string[]
  rubricType?: RubricType
}

export interface EvaluationResponse {
  results: ModelResult[]
}

export interface RubricDefinition {
  id: RubricType
  name: string
  description: string
  criteria: {
    [key: string]: {
      name: string
      description: string
      prompt: string
    }
  }
}
