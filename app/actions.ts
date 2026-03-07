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

export async function getHistoricalData(
  currency: string = 'MXN',
  timeframe: Timeframe = '3m',
): Promise<HistoricalDataPoint[]> {
  const { daysBack, intervalMinutes } = TIMEFRAME_CONFIG[timeframe];

  // Timestamp de corte en segundos
  const cutoffTimestamp = Math.floor(Date.now() / 1000) - daysBack * 86400;

  // Cache-busting: añadimos el timeframe y un slot de 5 minutos
  // para que el mismo timeframe siempre devuelva el mismo resultado
  // dentro de la ventana de revalidación
  const cacheSlot = Math.floor(Date.now() / (1000 * 60 * 5));
  const url = `https://api.yadio.io/historical/${currency}?_=${cacheSlot}`;

  try {
    const resp = await fetch(url, {
      // Revalidamos cada 5 minutos para evitar inconsistencias entre clicks
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!resp.ok) {
      console.warn(`[getHistoricalData] HTTP ${resp.status} para ${url}`);
      return generateSyntheticData(daysBack, intervalMinutes);
    }

    const json: YadioHistoricalResponse = await resp.json();

    // Validamos que la respuesta tenga la forma esperada
    if (!json?.data || !Array.isArray(json.data) || json.data.length === 0) {
      console.warn('[getHistoricalData] Respuesta inesperada de Yadio:', json);
      return generateSyntheticData(daysBack, intervalMinutes);
    }

    const formatted: HistoricalDataPoint[] = json.data
      .map(([timestamp, price]) => ({
        // Yadio devuelve timestamps en segundos, pero validamos por si acaso
        time: timestamp > 1e12 ? Math.floor(timestamp / 1000) : timestamp,
        // price ya es el valor de 1 BTC en la moneda seleccionada
        // Si tu gráfico trabaja en sats, divides entre SATS_PER_BTC
        // Si trabaja en BTC/moneda directamente, no dividas
        value: price / SATS_PER_BTC,
      }))
      .filter((d) => Number.isFinite(d.time) && Number.isFinite(d.value) && d.value > 0);

    if (formatted.length === 0) {
      return generateSyntheticData(daysBack, intervalMinutes);
    }

    // Ordenamos cronológicamente
    formatted.sort((a, b) => a.time - b.time);

    // Filtramos al rango del timeframe seleccionado
    const filtered = formatted.filter((d) => d.time >= cutoffTimestamp);

    // Si el filtro dejó muy pocos puntos usamos todo el histórico disponible
    const result = filtered.length > 2 ? filtered : formatted;

    return dedup(result);
  } catch (error) {
    console.error('[getHistoricalData] Error al obtener datos:', error);
    return generateSyntheticData(daysBack, intervalMinutes);
  }
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
