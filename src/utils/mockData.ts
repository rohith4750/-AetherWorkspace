// Seed-based pseudo-random helper to make data consistent for a given ticker
const getSeededRandom = (seedStr: string) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
};

export interface PricePoint {
  date: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
}

export interface FinancialMetric {
  metric: string;
  value: string;
  yoy: string;
  status: 'positive' | 'negative' | 'neutral';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

export interface MacroIndicator {
  date: string;
  gdp: number;
  inflation: number;
  unemployment: number;
}

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generatePriceChartData = (ticker: string, dateRange: string): PricePoint[] => {
  const rand = getSeededRandom(ticker);
  let days = 30;
  if (dateRange === '3M') days = 90;
  else if (dateRange === '6M') days = 180;
  else if (dateRange === '1Y') days = 365;

  let basePrice = 150;
  if (ticker === 'TSLA') basePrice = 220;
  else if (ticker === 'MSFT') basePrice = 420;
  else if (ticker === 'NVDA') basePrice = 120;
  else if (ticker === 'BTC') basePrice = 67000;
  else if (ticker === 'ETH') basePrice = 3500;
  else {
    // Custom ticker
    basePrice = 50 + rand() * 450;
  }

  const data: PricePoint[] = [];
  const now = new Date();
  
  let currentPrice = basePrice;
  const priceChangeFactor = ticker === 'BTC' || ticker === 'ETH' ? 0.04 : 0.02;

  // Generate historical data
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const change = currentPrice * (rand() - 0.48) * priceChangeFactor; // slight upward drift
    const open = currentPrice;
    currentPrice = Math.max(1, currentPrice + change);
    const close = currentPrice;
    
    const volatility = currentPrice * 0.015 * (rand() + 0.5);
    const high = Math.max(open, close) + volatility;
    const low = Math.max(0.1, Math.min(open, close) - volatility);
    const volume = Math.floor((100000 + rand() * 900000) * (basePrice > 1000 ? 0.1 : 10));

    data.push({
      date: formatDate(date),
      price: parseFloat(close.toFixed(2)),
      volume,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2))
    });
  }

  return data;
};

export const generateFinancialTableData = (ticker: string): FinancialMetric[] => {
  const rand = getSeededRandom(ticker + '_financials');
  
  const mult = ticker === 'NVDA' ? 1.8 : ticker === 'TSLA' ? 1.1 : ticker === 'MSFT' ? 1.15 : 1.05;
  const rev = (50 + rand() * 100) * mult;
  const netInc = rev * (0.15 + rand() * 0.15);
  const eps = (2 + rand() * 8) * mult;
  const pRatio = 15 + rand() * 40;

  return [
    {
      metric: 'Revenue (TTM)',
      value: `$${rev.toFixed(1)}B`,
      yoy: `+${(rand() * 25 * mult).toFixed(1)}%`,
      status: 'positive'
    },
    {
      metric: 'Net Income (TTM)',
      value: `$${netInc.toFixed(1)}B`,
      yoy: `+${(rand() * 20 * mult).toFixed(1)}%`,
      status: 'positive'
    },
    {
      metric: 'Operating Margin',
      value: `${(15 + rand() * 25).toFixed(1)}%`,
      yoy: `${(rand() * 4 - 2).toFixed(1)}%`,
      status: rand() > 0.4 ? 'positive' : 'negative'
    },
    {
      metric: 'Diluted EPS',
      value: `$${eps.toFixed(2)}`,
      yoy: `+${(rand() * 15).toFixed(1)}%`,
      status: 'positive'
    },
    {
      metric: 'P/E Ratio',
      value: pRatio.toFixed(1),
      yoy: 'N/A',
      status: 'neutral'
    },
    {
      metric: 'Free Cash Flow',
      value: `$${(netInc * (0.8 + rand() * 0.4)).toFixed(1)}B`,
      yoy: `+${(rand() * 30).toFixed(1)}%`,
      status: 'positive'
    },
    {
      metric: 'Debt to Equity',
      value: `${(0.2 + rand() * 1.5).toFixed(2)}`,
      yoy: 'N/A',
      status: 'neutral'
    }
  ];
};

export const generateNewsSentimentData = (ticker: string): NewsItem[] => {
  const rand = getSeededRandom(ticker + '_news');
  const templates = [
    {
      title: 'unveils new enterprise AI integrations aiming to boost productivity',
      sentiment: 'bullish' as const,
      impact: 'high' as const
    },
    {
      title: 'faces supply chain headwinds heading into Q3, analysts warn',
      sentiment: 'bearish' as const,
      impact: 'medium' as const
    },
    {
      title: 'announced a strategic partnership to expand distribution channels',
      sentiment: 'bullish' as const,
      impact: 'medium' as const
    },
    {
      title: 'stock target raised by major investment banks citing strong margin growth',
      sentiment: 'bullish' as const,
      impact: 'high' as const
    },
    {
      title: 'regulatory compliance audit completed successfully with no major findings',
      sentiment: 'neutral' as const,
      impact: 'low' as const
    },
    {
      title: 'launches sustainable green-energy initiative for production facilities',
      sentiment: 'neutral' as const,
      impact: 'low' as const
    },
    {
      title: 'insider transaction reports show minor selloff by executives',
      sentiment: 'bearish' as const,
      impact: 'low' as const
    }
  ];

  // Shuffle templates based on seed
  const newsList: NewsItem[] = [];
  const sources = ['Bloomberg', 'Reuters', 'MarketWatch', 'TechCrunch', 'WSJ', 'CNBC'];

  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(rand() * templates.length);
    const template = templates[idx];
    const source = sources[Math.floor(rand() * sources.length)];
    const hr = Math.floor(rand() * 23) + 1;
    
    newsList.push({
      id: `${ticker}_news_${i}`,
      title: `${ticker} ${template.title}`,
      source,
      time: `${hr} hours ago`,
      sentiment: template.sentiment,
      impact: template.impact
    });
  }

  return newsList;
};

export const generateMacroIndicatorsData = (dateRange: string): MacroIndicator[] => {
  const rand = getSeededRandom('macro_indicators');
  let intervals = 12;
  if (dateRange === '3M') intervals = 6;
  else if (dateRange === '6M') intervals = 12;
  else if (dateRange === '1Y') intervals = 24;

  const data: MacroIndicator[] = [];
  const now = new Date();
  
  let gdp = 2.4;
  let inflation = 3.2;
  let unemployment = 3.8;

  for (let i = intervals; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    
    // Smooth transitions
    gdp = Math.max(0.5, gdp + (rand() - 0.5) * 0.4);
    inflation = Math.max(1.0, inflation + (rand() - 0.5) * 0.3);
    unemployment = Math.max(2.5, unemployment + (rand() - 0.5) * 0.2);

    data.push({
      date: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      gdp: parseFloat(gdp.toFixed(1)),
      inflation: parseFloat(inflation.toFixed(1)),
      unemployment: parseFloat(unemployment.toFixed(1))
    });
  }

  return data;
};
