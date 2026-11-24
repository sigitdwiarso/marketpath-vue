import { describe, it, expect } from "vitest";
import { generateCandles, heroSeries, movingAverage, mulberry32, TIMEFRAMES, ASSETS } from "@/lib/market-data";

describe("market-data generators", () => {
  it("mulberry32 is deterministic for the same seed", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("generateCandles produces the expected candle count per timeframe", () => {
    for (const t of TIMEFRAMES) {
      const candles = generateCandles("stock", t.key);
      expect(candles).toHaveLength(t.candles);
    }
  });

  it("candles are valid OHLC series (high >= max(open, close), low <= min(open, close))", () => {
    const candles = generateCandles("crypto", "1M");
    for (const c of candles) {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.volume).toBeGreaterThan(0);
    }
  });

  it("generateCandles is deterministic for the same asset + timeframe", () => {
    expect(generateCandles("stock", "1Y")).toEqual(generateCandles("stock", "1Y"));
  });

  it("movingAverage yields nulls before the period and averages after", () => {
    const candles = generateCandles("stock", "1D");
    const ma = movingAverage(candles, 7);
    expect(ma.length).toBe(candles.length);
    for (let i = 0; i < 6; i++) expect(ma[i]).toBeNull();
    const manual = candles.slice(0, 7).reduce((s, c) => s + c.close, 0) / 7;
    expect(ma[6]).toBeCloseTo(manual, 1);
  });

  it("heroSeries is deterministic and positive", () => {
    const s1 = heroSeries(42, 90);
    const s2 = heroSeries(42, 90);
    expect(s1).toEqual(s2);
    expect(s1.every((v) => v > 0)).toBe(true);
    expect(ASSETS.stock.ticker).toBe("ACME");
  });
});
