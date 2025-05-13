"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface ChartProps {
  data: any
  options?: any
}

export function BarChart({ data, options = {} }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} />
}

export function LineChart({ data, options = {} }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} />
}

export function PieChart({ data, options = {} }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} />
}

export function DoughnutChart({ data, options = {} }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart instance
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} />
}
