'use client'

import { useState, useRef, useEffect } from 'react'
import { getAvailableModels } from '@/lib/models'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  label: string
  disabled?: boolean
}

export function ModelSelector({ selectedModel, onModelChange, label, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const availableModels = getAvailableModels()
  const selectedModelConfig = availableModels.find(model => model.id === selectedModel)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'border-blue-400 ring-2 ring-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {selectedModelConfig?.config.name || 'Select Model'}
              </span>
              {selectedModelConfig && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {selectedModelConfig.config.provider}
                </span>
              )}
            </div>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {availableModels.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onModelChange(model.id)
                setIsOpen(false)
              }}
              className={`
                w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                ${selectedModel === model.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{model.config.name}</div>
                  <div className="text-sm text-gray-500">{model.config.provider}</div>
                </div>
                {selectedModel === model.id && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
