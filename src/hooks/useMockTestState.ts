"use client"

import { useState, useCallback } from "react"

interface MockTestState {
  moduleTestsCompleted: Record<string, boolean>
  finalCertificationCompleted: boolean
}

export const useMockTestState = () => {
  const [state, setState] = useState<MockTestState>({
    moduleTestsCompleted: {},
    finalCertificationCompleted: false,
  })

  const completeModuleTest = useCallback((moduleId: string) => {
    setState((prev) => ({
      ...prev,
      moduleTestsCompleted: {
        ...prev.moduleTestsCompleted,
        [moduleId]: true,
      },
    }))
  }, [])

  const completeFinalCertification = useCallback(() => {
    setState((prev) => ({
      ...prev,
      finalCertificationCompleted: true,
    }))
  }, [])

  const resetModuleTest = useCallback((moduleId: string) => {
    setState((prev) => ({
      ...prev,
      moduleTestsCompleted: {
        ...prev.moduleTestsCompleted,
        [moduleId]: false,
      },
    }))
  }, [])

  const resetAllTests = useCallback(() => {
    setState({
      moduleTestsCompleted: {},
      finalCertificationCompleted: false,
    })
  }, [])

  return {
    ...state,
    completeModuleTest,
    completeFinalCertification,
    resetModuleTest,
    resetAllTests,
  }
}

export default useMockTestState
