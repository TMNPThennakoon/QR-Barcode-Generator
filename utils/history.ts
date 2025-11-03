import { GeneratedCode } from '@/types'

const STORAGE_KEY = 'qr-code-generator-history'
const MAX_HISTORY_ITEMS = 50

export function saveToHistory(code: Omit<GeneratedCode, 'id'>): void {
  try {
    const history = getHistory()
    const newCode: GeneratedCode = {
      ...code,
      id: Date.now().toString(),
    }

    const updatedHistory = [newCode, ...history].slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Failed to save to history:', error)
  }
}

export function getHistory(): GeneratedCode[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to get history:', error)
    return []
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear history:', error)
  }
}

export function removeFromHistory(id: string): void {
  try {
    const history = getHistory()
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Failed to remove from history:', error)
  }
}

