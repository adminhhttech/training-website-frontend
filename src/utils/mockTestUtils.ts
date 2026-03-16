/**
 * Utility functions for mock test logic
 */

/**
 * Checks if all modules are 100% complete
 */
export const areAllModulesComplete = (modules: Array<{ completionPercentage?: number }>): boolean => {
  return modules.every((module) => (module.completionPercentage || 0) === 100)
}

/**
 * Checks if a specific module is complete
 */
export const isModuleComplete = (completionPercentage?: number): boolean => {
  return (completionPercentage || 0) === 100
}

/**
 * Counts total completed modules
 */
export const countCompletedModules = (modules: Array<{ completionPercentage?: number }>): number => {
  return modules.filter((m) => isModuleComplete(m.completionPercentage)).length
}

/**
 * Calculates overall course completion percentage
 */
export const calculateOverallCompletion = (modules: Array<{ completionPercentage?: number }>): number => {
  if (modules.length === 0) return 0
  const total = modules.reduce((sum, m) => sum + (m.completionPercentage || 0), 0)
  return Math.round(total / modules.length)
}

export default {
  areAllModulesComplete,
  isModuleComplete,
  countCompletedModules,
  calculateOverallCompletion,
}
