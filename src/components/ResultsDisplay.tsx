'use client'

import { useState } from 'react'
import { ModelResult } from '@/types'

interface ResultsDisplayProps {
  results: ModelResult[]
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  
  // Sort results by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score.rating - a.score.rating)

  const toggleExpanded = (modelName: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(modelName)) {
      newExpanded.delete(modelName)
    } else {
      newExpanded.add(modelName)
    }
    setExpandedCards(newExpanded)
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-50'
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getRankBadge = (index: number) => {
    const badges = [
      'bg-yellow-400 text-yellow-900', // 1st - Gold
      'bg-gray-400 text-gray-900',     // 2nd - Silver  
      'bg-orange-400 text-orange-900'  // 3rd - Bronze
    ]
    
    if (index < 3) {
      return (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[index]}`}>
          #{index + 1}
        </div>
      )
    }
    
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
        #{index + 1}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Results</h2>
        <p className="text-gray-600">
          Models ranked by AI judge score. Click on any result to see detailed analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedResults.map((result, index) => (
          <div key={result.modelName} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.modelName}
                  </h3>
                  {getRankBadge(index)}
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {result.provider}
                </span>
              </div>
              
              {/* Score */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score.rating)}`}>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {result.score.rating.toFixed(1)}/5.0
              </div>
            </div>

            {/* Metrics */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">TTFT</span>
                  <p className="font-medium">{formatTime(result.metrics.timeToFirstToken)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Time</span>
                  <p className="font-medium">{formatTime(result.metrics.totalGenerationTime)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tokens</span>
                  <p className="font-medium">{result.metrics.tokenCount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tokens/sec</span>
                  <p className="font-medium">
                    {(result.metrics.tokenCount / (result.metrics.totalGenerationTime / 1000)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Preview */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Response</h4>
                {result.response.length > 200 && (
                  <button
                    onClick={() => toggleExpanded(result.modelName)}
                    className="flex items-center text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                  >
                    {expandedCards.has(result.modelName) ? (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        View Full Response
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className={`bg-gray-50 rounded-lg p-3 text-sm text-gray-700 transition-all duration-300 ${
                expandedCards.has(result.modelName) ? 'max-h-none' : 'max-h-32 overflow-hidden'
              }`}>
                {expandedCards.has(result.modelName) || result.response.length <= 200
                  ? result.response
                  : `${result.response.substring(0, 200)}...`
                }
              </div>
              
              {/* Judge Reasoning */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">AI Judge Analysis</h4>
                <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  {result.score.reasoning}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Avg Score</span>
            <p className="text-xl font-bold text-gray-900">
              {(results.reduce((sum, r) => sum + r.score.rating, 0) / results.length).toFixed(1)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Fastest TTFT</span>
            <p className="text-xl font-bold text-gray-900">
              {formatTime(Math.min(...results.map(r => r.metrics.timeToFirstToken)))}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Avg Tokens</span>
            <p className="text-xl font-bold text-gray-900">
              {Math.round(results.reduce((sum, r) => sum + r.metrics.tokenCount, 0) / results.length)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Total Time</span>
            <p className="text-xl font-bold text-gray-900">
              {formatTime(Math.max(...results.map(r => r.metrics.totalGenerationTime)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
