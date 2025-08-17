import { RubricDefinition, RubricType } from '@/types'

export const rubricDefinitions: Record<RubricType, RubricDefinition> = {
  'code-generation': {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Uses syntactic correctness (# of compile errors), style, completeness, and conciceseness as grading criteria.',
    criteria: {
      syntacticCorrectness: {
        name: 'Syntactic Correctness',
        description: 'Does the code appear syntactically valid and free of obvious compile errors like mismatched brackets or typos?',
        prompt: 'Analyze the following code snippet. On a scale of 1-5, how likely is it to be syntactically correct and compile without errors?'
      },
      readabilityAndStyle: {
        name: 'Readability & Style',
        description: 'Does the code adhere to community best practices? Is it well-structured, properly named, and easy for another developer to understand?',
        prompt: 'Evaluate the code\'s readability and adherence to idiomatic style for its language. Is it clean and maintainable?'
      },
      completenessAndAccuracy: {
        name: 'Completeness & Accuracy',
        description: 'Does the generated code fully implement the logic requested in the prompt? Does it handle potential edge cases mentioned or implied?',
        prompt: 'Compare the code against the original prompt. Does it successfully solve the entire problem requested, or are parts missing or incorrect?'
      },
      efficiencyAndConciseness: {
        name: 'Efficiency & Conciseness',
        description: 'Does the code use efficient algorithms and data structures for the task? Is it concise without being obscure?',
        prompt: 'Evaluate the code\'s efficiency and conciseness. Does it use appropriate algorithms and avoid unnecessary complexity?'
      }
    }
  },
  'summarization': {
    id: 'summarization',
    name: 'Summarization / Data Extraction',
    description: 'Uses factual fidelity, coverage, and brevity as grading criteria.',
    criteria: {
      factualFidelity: {
        name: 'Factual Fidelity',
        description: 'Does the summary accurately reflect the source document without adding fabricated information (hallucinations)?',
        prompt: 'Compare the summary to the source text. Does the summary contain any information that is not present in the original? Rate its factual fidelity.'
      },
      coverage: {
        name: 'Coverage',
        description: 'Does the summary include all the key points and critical information from the source?',
        prompt: 'Did the summary successfully extract all the most important concepts from the source text, or did it miss something critical?'
      },
      brevity: {
        name: 'Brevity',
        description: 'Is the summary appropriately concise and free of redundant phrasing?',
        prompt: 'Evaluate the conciseness of the summary. Is it succinct and to the point?'
      }
    }
  },
  'creative-writing': {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Uses instruction adherence, coherence, and creativity as grading criteria.',
    criteria: {
      instructionAdherence: {
        name: 'Instruction Adherence',
        description: 'Did the model follow all constraints like tone, style, format, and keywords? This is the most important criterion for creative tasks.',
        prompt: 'Review the prompt\'s constraints (tone, style, keywords). How well did the generated text adhere to every single instruction?'
      },
      coherenceAndFlow: {
        name: 'Coherence & Flow',
        description: 'Is the text well-structured and easy to read? Do the sentences and paragraphs flow logically?',
        prompt: 'Assess the logical flow and coherence of the text. Is it well-organized and easy to follow?'
      },
      engagementAndCreativity: {
        name: 'Engagement & Creativity',
        description: 'Is the output generic and boring, or is it interesting, novel, and engaging for a human reader?',
        prompt: 'Rate the creativity and engagement level of this text. Is it more than just a generic response?'
      }
    }
  }
}

export const defaultRubric: RubricType = 'code-generation'
