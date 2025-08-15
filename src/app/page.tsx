'use client'

import { useState } from 'react'
import { ModelComparisonForm } from '@/components/ModelComparisonForm'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { ModelResult } from '@/types'

export default function Home() {
  const [results, setResults] = useState<ModelResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEvaluate = async (prompt: string) => {
    setIsLoading(true)
    setResults(null)
    
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate models')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Error evaluating models:', error)
      // You could add proper error handling here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            AI Model Performance Grader
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Compare multiple AI models side-by-side with automated scoring. 
            Get <span className="font-semibold text-gray-800">data-informed insights</span>, not just vibes.
          </p>
        </div>

        {/* Input Form */}
        <ModelComparisonForm onEvaluate={handleEvaluate} isLoading={isLoading} />

        {/* Results */}
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  )
}
