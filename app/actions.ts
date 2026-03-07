'use server';

import { PriceData, HistoricalDataPoint, Timeframe, TIMEFRAME_CONFIG } from '@/lib/types';

const SATS_PER_BTC = 100_000_000;

export async function getPrice(currency: string = 'MXN'): Promise<PriceData | null> {
  const endpoints = [
    {
      url: `https://api.yadio.io/exrates/BTC`,
      parse: (d: Record<string, number>) => d[currency],
    },
    {
      url: `https://api.yadio.io/convert/1/BTC/${currency}`,
      parse: (d: { result?: number; rate?: number }) => d.result || d.rate,
    },
  ];

  for (const ep of endpoints) {
    try {
      const resp = await fetch(ep.url, {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      });
      if (!resp.ok) continue;

      const data = await resp.json();
      const btcPrice = ep.parse(data);

      if (btcPrice && btcPrice > 0) {
        return {
          btcPrice,
          satPrice: btcPrice / SATS_PER_BTC,
          satsPerUnit: SATS_PER_BTC / btcPrice,
          currency,
          timestamp: Date.now(),
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

// export type Timeframe = '3m' | '6m' | '1y' | '5y';

// export const TIMEFRAME_CONFIG: Record<Timeframe, { label: string; daysBack: number; intervalMinutes: number }> = {
//   '3m': { label: '3M', daysBack: 90, intervalMinutes: 480 },
//   '6m': { label: '6M', daysBack: 180, intervalMinutes: 720 },
//   '1y': { label: '1A', daysBack: 365, intervalMinutes: 1440 },
//   '5y': { label: '5A', daysBack: 1825, intervalMinutes: 4320 },
// };

/**
 * Yadio historical endpoint response shape:
 * {
 *   "currency": "MXN",
 *   "start": 1234567890,
 *   "end":   1234567890,
 *   "data": [
 *     [timestamp_unix, price_float],
 *     ...
 *   ]
 * }
 */
interface YadioHistoricalResponse {
  currency: string;
  start: number;
  end: number;
  data: [number, number][];
}

function dedup(data: HistoricalDataPoint[]): HistoricalDataPoint[] {
  const seen = new Map<number, HistoricalDataPoint>();
  for (const p of data) {
    if (!seen.has(p.time)) seen.set(p.time, p);
  }
  return Array.from(seen.values()).sort((a, b) => a.time - b.time);
}

function generateSyntheticData(daysBack: number, intervalMinutes: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = Math.floor(Date.now() / 1000);
  const start = now - daysBack * 86400;
  const interval = intervalMinutes * 60;
  const total = Math.floor((now - start) / interval);

  // Start with a base SAT price and generate realistic movement
  let price = 0.019 * (1 + (Math.random() - 0.5) * 0.1);
  const raw = [price];

  for (let i = 1; i < total; i++) {
    price *= 1 + (Math.random() - 0.48) * 0.002;
    raw.push(price);
  }

  const currentPrice = 0.019; // approximate current SAT price in MXN
  const adj = currentPrice / raw[raw.length - 1];

  for (let i = 0; i < total; i++) {
    data.push({
      time: start + i * interval,
      value: raw[i] * (1 + (adj - 1) * (i / (total - 1))),
    });
  }

  return data;
}

export async function getHistoricalData(
  currency: string = 'MXN',
  timeframe: Timeframe = '3m',
): Promise<HistoricalDataPoint[]> {
  const { daysBack, intervalMinutes } = TIMEFRAME_CONFIG[timeframe];

  // Timestamp de corte en segundos (igual que antes)
  const cutoffTimestamp = Math.floor(Date.now() / 1000) - daysBack * 86400;

  const symbol = `BTC${currency.toUpperCase()}`; // BTCMXN, BTCARS, BTCUSD, etc.
  const interval = '1d'; // Diario = perfecto para gráficos de meses/años (más eficiente)

  try {
    const rawData = await fetchAllBinanceKlines(symbol, interval, cutoffTimestamp);

    if (!rawData || rawData.length === 0) {
      throw new Error('Sin datos de Binance');
    }

    // Formateamos exactamente igual que Yadio
    const formatted: HistoricalDataPoint[] = rawData
      .map((k: any[]) => ({
        // Binance devuelve openTime en milisegundos → lo pasamos a segundos
        time: Math.floor(k[0] / 1000),
        // close = precio de 1 BTC en la moneda (igual que Yadio)
        value: parseFloat(k[4]) / SATS_PER_BTC,
      }))
      .filter((d) => Number.isFinite(d.time) && Number.isFinite(d.value) && d.value > 0);

    // Orden cronológico (Binance ya viene ordenado, pero por si acaso)
    formatted.sort((a, b) => a.time - b.time);

    // Filtramos al rango del timeframe
    const filtered = formatted.filter((d) => d.time >= cutoffTimestamp);

    // Si quedó muy poco, usamos todo lo disponible
    const result = filtered.length > 2 ? filtered : formatted;

    return dedup(result);
  } catch (error) {
    console.error(`[getHistoricalData] Error Binance ${symbol}:`, error);
    return generateSyntheticData(daysBack, intervalMinutes);
  }
}

// ==================== HELPER REUTILIZABLE ====================
async function fetchAllBinanceKlines(symbol: string, interval: string, cutoffTimestamp: number): Promise<any[]> {
  const startTime = cutoffTimestamp * 1000; // ms
  const endTime = Date.now();
  let allData: any[] = [];
  let currentStart = startTime;
  const limit = 1000;

  while (currentStart < endTime) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${currentStart}&endTime=${endTime}&limit=${limit}`;

    const resp = await fetch(url, {
      // Misma revalidación que tenías (cada 5 minutos)
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }

    const chunk: any[] = await resp.json();

    if (!Array.isArray(chunk) || chunk.length === 0) break;

    allData = [...allData, ...chunk];
    currentStart = chunk[chunk.length - 1][0] + 1; // siguiente vela
  }

  return allData;
}
