import { describe, it, expect } from 'vitest'
import { formatCategory } from '../formatters'

describe('formatters', () => {
  describe('formatCategory', () => {
    it('should capitalize first letter of single word category', () => {
      expect(formatCategory('electronics')).toBe('Electronics')
    })

    it('should capitalize first letter of each word in multi-word category', () => {
      expect(formatCategory('men\'s clothing')).toBe('Men\'s Clothing')
      expect(formatCategory('women\'s clothing')).toBe('Women\'s Clothing')
    })

    it('should handle category with apostrophe correctly', () => {
      expect(formatCategory('men\'s clothing')).toBe('Men\'s Clothing')
    })

    it('should handle single word categories', () => {
      expect(formatCategory('jewelery')).toBe('Jewelery')
    })

    it('should handle empty string', () => {
      expect(formatCategory('')).toBe('')
    })

    it('should handle already capitalized categories', () => {
      expect(formatCategory('Electronics')).toBe('Electronics')
    })

    it('should handle categories with multiple spaces', () => {
      expect(formatCategory('men  s  clothing')).toBe('Men  S  Clothing')
    })

    it('should handle categories with hyphens', () => {
      expect(formatCategory('high-tech')).toBe('High-tech')
    })
  })
})
