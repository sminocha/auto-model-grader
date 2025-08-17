'use client'

import { useState } from 'react'
import { ModelResult } from '@/types'
import { rubricDefinitions } from '@/lib/rubrics'

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

  const getProgressBarColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500'
    if (score >= 3.5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const renderStarRating = (score: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isFullStar = i <= Math.floor(score)
      const isHalfStar = i === Math.floor(score) + 1 && score % 1 === 0.5
      
      if (isFullStar) {
        // Full star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (isHalfStar) {
        // Half star - use a container with clipping
        stars.push(
          <div key={i} className="relative w-4 h-4">
            {/* Background empty star */}
            <svg
              className="absolute w-4 h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Half filled star */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )
      } else {
        // Empty star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }
    return <div className="flex items-center space-x-1">{stars}</div>
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

                         {/* Criteria Breakdown */}
             {result.score.criteria && (
               <div className="p-6 border-b border-gray-100">
                 <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                   <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                   Detailed Criteria Scores
                 </h4>
                <div className="space-y-3">
                  {Object.entries(result.score.criteria).map(([criterionKey, criterionResult]) => {
                    // Find the criterion definition to get the display name
                    let criterionName = criterionKey
                    for (const rubric of Object.values(rubricDefinitions)) {
                      if (rubric.criteria[criterionKey]) {
                        criterionName = rubric.criteria[criterionKey].name
                        break
                      }
                    }
                    
                    return (
                      <div key={criterionKey} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{criterionName}</span>
                            <div className="flex items-center space-x-2">
                              {renderStarRating(criterionResult.score)}
                              <span className="text-sm font-bold text-gray-900">
                                {criterionResult.score.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressBarColor(criterionResult.score)}`}
                              style={{ width: `${(criterionResult.score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Performance Metrics
              </h4>
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
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-800 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Response
                </h4>
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
              <div className={`bg-gray-50 rounded-lg p-4 text-sm text-gray-700 transition-all duration-300 whitespace-pre-wrap leading-relaxed ${
                expandedCards.has(result.modelName) ? 'max-h-none' : 'max-h-32 overflow-hidden'
              }`}>
                {expandedCards.has(result.modelName) || result.response.length <= 200
                  ? result.response
                  : `${result.response.substring(0, 200)}...`
                }
              </div>
            </div>

            {/* Judge Reasoning */}
            <div className="p-6">
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Explanation of AI Judge's Grades
                </h4>
                <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg space-y-4 mx-1">
                  <div>
                    <span className="font-medium text-blue-800 text-sm">Overall Assessment:</span>
                    <p className="mt-2 text-gray-700 leading-relaxed">{result.score.reasoning}</p>
                  </div>
                  
                  {/* Detailed criteria reasoning */}
                  {result.score.criteria && (
                    <div>
                      <span className="font-medium text-blue-800 text-sm">Detailed Criteria Analysis:</span>
                      <div className="mt-3 space-y-3">
                        {Object.entries(result.score.criteria).map(([criterionKey, criterionResult]) => {
                          // Find the criterion definition to get the display name
                          let criterionName = criterionKey
                          for (const rubric of Object.values(rubricDefinitions)) {
                            if (rubric.criteria[criterionKey]) {
                              criterionName = rubric.criteria[criterionKey].name
                              break
                            }
                          }
                          
                          return (
                            <div key={criterionKey} className="bg-white/50 rounded p-3">
                              <div className="font-medium text-gray-800 mb-2">{criterionName}</div>
                              <p className="text-gray-700 leading-relaxed text-sm">{criterionResult.reasoning}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
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
