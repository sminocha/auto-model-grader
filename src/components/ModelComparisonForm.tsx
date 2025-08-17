'use client'

import { useState } from 'react'
import { ModelSelector } from './ModelSelector'
import { defaultModels } from '@/lib/models'
import { rubricDefinitions, defaultRubric } from '@/lib/rubrics'
import { RubricType } from '@/types'

interface ModelComparisonFormProps {
  onEvaluate: (prompt: string, selectedModels: string[], rubricType: RubricType) => void
  isLoading: boolean
}

export function ModelComparisonForm({ onEvaluate, isLoading }: ModelComparisonFormProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>(defaultModels)
  const [selectedRubric, setSelectedRubric] = useState<RubricType>(defaultRubric)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onEvaluate(prompt.trim(), selectedModels, selectedRubric)
    }
  }

  const handleModelChange = (index: number, modelId: string) => {
    const newSelectedModels = [...selectedModels]
    newSelectedModels[index] = modelId
    setSelectedModels(newSelectedModels)
  }

  const getExamplePrompts = (rubricType: RubricType) => {
    switch (rubricType) {
      case 'code-generation':
        return [
          "Write a Python function to calculate the Fibonacci sequence",
          "Debug this JavaScript code: const arr = [1,2,3]; arr.map(x => x * 2",
          "Create a React component for a todo list with add/delete functionality",
          "Write a SQL query to find the top 5 customers by revenue"
        ]
      case 'summarization':
        return [
          "Summarize the key points from this 10-page research paper on climate change",
          "Extract the main features from this product documentation",
          "Create a brief overview of quarterly earnings from this financial report",
          "Summarize the customer feedback themes from these 50 reviews"
        ]
      case 'creative-writing':
        return [
          "Explain quantum computing to a 10-year-old",
          "Create a marketing email for a new AI product launch",
          "Write a short story about a robot learning to paint",
          "Compose a professional but friendly rejection email for job applicants"
        ]
      default:
        return [
          "Write a Python function to calculate the Fibonacci sequence",
          "Explain quantum computing to a 10-year-old",
          "Create a marketing email for a new AI product launch",
          "Debug this JavaScript code: const arr = [1,2,3]; arr.map(x => x * 2"
        ]
    }
  }

  const examplePrompts = getExamplePrompts(selectedRubric)

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your prompt to test across multiple AI models
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Type your prompt here... (e.g., '${examplePrompts[0]}')`}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Models to Compare
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModelSelector
                selectedModel={selectedModels[0]}
                onModelChange={(modelId) => handleModelChange(0, modelId)}
                label="Model 1"
                disabled={isLoading}
              />
              <ModelSelector
                selectedModel={selectedModels[1]}
                onModelChange={(modelId) => handleModelChange(1, modelId)}
                label="Model 2"
                disabled={isLoading}
              />
              <ModelSelector
                selectedModel={selectedModels[2]}
                onModelChange={(modelId) => handleModelChange(2, modelId)}
                label="Model 3"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Rubric Selection */}
          <div>
            <label htmlFor="rubric" className="block text-sm font-medium text-gray-700 mb-2">
              Choose Evaluation Rubric
            </label>
            <select
              id="rubric"
              value={selectedRubric}
              onChange={(e) => setSelectedRubric(e.target.value as RubricType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              disabled={isLoading}
            >
              {Object.values(rubricDefinitions).map((rubric) => (
                <option key={rubric.id} value={rubric.id}>
                  {rubric.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {rubricDefinitions[selectedRubric].description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Quick examples:</span>
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {example.substring(0, 30)}...
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-w-[160px] group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="ml-2">Evaluating Models</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Evaluation
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-2">
                How It Works
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                We'll run your prompt against the 3 selected AI models in parallel, then use Claude Haiku as a judge to score each model's response based on a predefined task-specific rubric.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
