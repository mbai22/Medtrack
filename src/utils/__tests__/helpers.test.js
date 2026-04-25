import { describe, it, expect } from 'vitest'
import { getAge, formatDate, formatDateShort, getInitials } from '../helpers'

describe('Helper Functions', () => {
  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = '1990-01-01'
      const currentYear = new Date().getFullYear()
      const expectedAge = currentYear - 1990
      expect(getAge(birthDate)).toBe(expectedAge)
    })

    it('should handle leap years', () => {
      const birthDate = '2000-02-29'
      const age = getAge(birthDate)
      expect(age).toBeGreaterThan(0)
    })
  })

  describe('formatDate', () => {
    it('should format date in French', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toContain('janvier')
      expect(formatted).toContain('2024')
    })

    it('should handle empty date', () => {
      expect(formatDate('')).toBe('')
      expect(formatDate(null)).toBe('')
    })
  })

  describe('formatDateShort', () => {
    it('should format date as dd/mm/yyyy', () => {
      const date = '2024-01-15'
      const formatted = formatDateShort(date)
      expect(formatted).toBe('15/01/2024')
    })
  })

  describe('getInitials', () => {
    it('should return initials correctly', () => {
      expect(getInitials('Dupont', 'Jean')).toBe('DJ')
      expect(getInitials('Martin', 'Sophie')).toBe('MS')
    })

    it('should handle empty values', () => {
      expect(getInitials('', 'Jean')).toBe('J')
      expect(getInitials('Dupont', '')).toBe('D')
    })
  })
})
