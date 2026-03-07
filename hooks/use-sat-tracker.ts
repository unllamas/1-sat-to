'use client'

import { useState, useEffect, useCallback } from 'react'
import { getPrice, getHistoricalData } from '@/app/actions'
import { PriceData, HistoricalDataPoint, Timeframe, TIMEFRAME_CONFIG, DEFAULT_CURRENCY } from '@/lib/types'

interface UseSatTrackerOptions {
  currency: string
  initialTimeframe?: Timeframe
}

export function useSatTracker({ currency, initialTimeframe = '3m' }: UseSatTrackerOptions) {
  const [price, setPrice] = useState<PriceData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [timeframe, setTimeframe] = useState<Timeframe>(initialTimeframe)
  const [isLoading, setIsLoading] = useState(true)
  const [priceChange, setPriceChange] = useState<number | null>(null)

  const fetchPrice = useCallback(async () => {
    const newPrice = await getPrice(currency)
    if (newPrice) {
      setPrice(newPrice)
    }
  }, [currency])

  const fetchHistorical = useCallback(async (tf: Timeframe) => {
    setIsLoading(true)
    const data = await getHistoricalData(currency, tf)
    setHistoricalData(data)
    setIsLoading(false)
    
    // Calculate price change
    if (data.length > 0 && price) {
      const firstPrice = data[0].value
      const change = ((price.satPrice - firstPrice) / firstPrice) * 100
      setPriceChange(change)
    }
  }, [currency, price])

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      await fetchPrice()
      await fetchHistorical(timeframe)
    }
    init()
  }, [currency]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update price change when historical data or price changes
  useEffect(() => {
    if (historicalData.length > 0 && price) {
      const firstPrice = historicalData[0].value
      const change = ((price.satPrice - firstPrice) / firstPrice) * 100
      setPriceChange(change)
    }
  }, [historicalData, price])

  // Refetch price every minute
  useEffect(() => {
    const interval = setInterval(fetchPrice, 60000)
    return () => clearInterval(interval)
  }, [fetchPrice])

  // Refetch historical data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchHistorical(timeframe), 300000)
    return () => clearInterval(interval)
  }, [fetchHistorical, timeframe])

  const changeTimeframe = useCallback(async (tf: Timeframe) => {
    setTimeframe(tf)
    await fetchHistorical(tf)
  }, [fetchHistorical])

  return {
    price,
    historicalData,
    timeframe,
    timeframeLabel: TIMEFRAME_CONFIG[timeframe].label,
    isLoading,
    priceChange,
    changeTimeframe,
    refresh: fetchPrice,
  }
}
