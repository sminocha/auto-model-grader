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
  }
}

export interface EvaluationRequest {
  prompt: string
}

export interface EvaluationResponse {
  results: ModelResult[]
}
