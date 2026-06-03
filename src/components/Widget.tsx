import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import type { Widget, GlobalParams } from '../types';
import { 
  generatePriceChartData, 
  generateFinancialTableData, 
  generateNewsSentimentData, 
  generateMacroIndicatorsData 
} from '../utils/mockData';
import './widget.css';
import IDEWidget from './IDEWidget';

interface WidgetComponentProps {
  widget: Widget;
  globalParams: GlobalParams;
  onUpdateContent: (content: string) => void;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  globalParams,
  onUpdateContent
}) => {
  // Determine ticker and range based on linkage status
  const activeTicker = useMemo(() => {
    return widget.isLinked ? globalParams.ticker : (widget.customData?.activeTicker || 'AAPL');
  }, [widget.isLinked, globalParams.ticker, widget.customData?.activeTicker]);

  const activeDateRange = useMemo(() => {
    return widget.isLinked ? globalParams.dateRange : (widget.customData?.activeDateRange || '3M');
  }, [widget.isLinked, globalParams.dateRange, widget.customData?.activeDateRange]);

  // Load Mock Data
  const chartData = useMemo(() => {
    if (widget.type === 'price_chart' || widget.type === 'crypto_chart') {
      return generatePriceChartData(activeTicker, activeDateRange);
    }
    return [];
  }, [widget.type, activeTicker, activeDateRange]);

  const tableData = useMemo(() => {
    if (widget.type === 'financial_table') {
      return generateFinancialTableData(activeTicker);
    }
    return [];
  }, [widget.type, activeTicker]);

  const newsData = useMemo(() => {
    if (widget.type === 'news_sentiment') {
      return generateNewsSentimentData(activeTicker);
    }
    return [];
  }, [widget.type, activeTicker]);

  const macroData = useMemo(() => {
    if (widget.type === 'macro_indicators') {
      return generateMacroIndicatorsData(activeDateRange);
    }
    return [];
  }, [widget.type, activeDateRange]);

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-label">{data.date}</div>
          <div className="tooltip-value" style={{ color: 'var(--primary)' }}>
            Price: ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          {data.volume && (
            <div className="tooltip-value" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
              Vol: {data.volume.toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Macro Tooltip
  const CustomMacroTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-label">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="tooltip-value" style={{ color: entry.color, fontSize: '0.75rem', marginTop: '2px' }}>
              {entry.name}: {entry.value}%
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render content based on widget type
  switch (widget.type) {
    case 'price_chart':
    case 'crypto_chart': {
      if (!chartData || chartData.length === 0) return <div>No data available</div>;
      
      const lastPoint = chartData[chartData.length - 1];
      const firstPoint = chartData[0];
      const isUp = lastPoint.price >= firstPoint.price;
      const gradientId = `colorPrice_${widget.id}`;
      const lineColor = isUp ? 'var(--color-success)' : 'var(--color-danger)';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          {/* Header Metric Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
                ${lastPoint.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span 
                className={`yoy-indicator ${isUp ? 'positive' : 'negative'}`} 
                style={{ marginLeft: '8px', transform: 'translateY(-2px)' }}
              >
                {isUp ? '+' : ''}{((lastPoint.price - firstPoint.price) / firstPoint.price * 100).toFixed(2)}%
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Range: {firstPoint.date} to {lastPoint.date}
            </span>
          </div>

          {/* Price Area Chart */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="70%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lineColor} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={lineColor} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 9 }} 
                  axisLine={false} 
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 9 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={lineColor} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#${gradientId})`} 
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Volume Bar Chart */}
            <ResponsiveContainer width="100%" height="30%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip" style={{ padding: '6px 10px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Volume: {payload[0]?.value?.toLocaleString()}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="volume" 
                  fill={isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'} 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case 'financial_table': {
      return (
        <div className="widget-table-container">
          <table className="widget-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>YoY %</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.metric}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.value}</td>
                  <td>
                    {item.yoy !== 'N/A' ? (
                      <span className={`yoy-indicator ${item.yoy.startsWith('+') ? 'positive' : 'negative'}`}>
                        {item.yoy}
                      </span>
                    ) : (
                      <span className="yoy-indicator neutral">{item.yoy}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'news_sentiment': {
      return (
        <div className="news-list">
          {newsData.map((item) => (
            <div key={item.id} className="news-card">
              <div className="news-card-header">
                <div className="news-meta-left">
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                <span className={`sentiment-badge ${item.sentiment}`}>
                  {item.sentiment}
                </span>
              </div>
              <span className="news-title">{item.title}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'macro_indicators': {
      if (!macroData || macroData.length === 0) return <div>No data available</div>;
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="95%">
            <LineChart data={macroData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--text-muted)', fontSize: 9 }} 
                axisLine={false}
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: 'var(--text-muted)', fontSize: 9 }} 
                axisLine={false}
                tickLine={false} 
              />
              <Tooltip content={<CustomMacroTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconSize={10} 
                wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }} 
              />
              <Line 
                name="GDP Growth Rate" 
                type="monotone" 
                dataKey="gdp" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Line 
                name="Inflation Rate (CPI)" 
                type="monotone" 
                dataKey="inflation" 
                stroke="var(--accent)" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Line 
                name="Unemployment Rate" 
                type="monotone" 
                dataKey="unemployment" 
                stroke="var(--color-warning)" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    case 'text_note': {
      return (
        <textarea
          className="text-note-area"
          value={widget.customContent || ''}
          onChange={(e) => onUpdateContent(e.target.value)}
          placeholder="Click here to type notes about your active research, ideas, investment thesis, or reminders..."
        />
      );
    }

    case 'ai_artifact': {
      return (
        <div className="ai-widget-content">
          {widget.customContent ? (
            <div dangerouslySetInnerHTML={{ __html: widget.customContent }} />
          ) : widget.customData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ color: 'var(--primary)' }}>{widget.customData.title}</h3>
              <p>{widget.customData.analysis}</p>
              
              {/* Optional dynamic table if AI outputted mock table */}
              {widget.customData.table && (
                <div className="widget-table-container" style={{ marginTop: '8px' }}>
                  <table className="widget-table">
                    <thead>
                      <tr>
                        {widget.customData.table.headers.map((h: string, i: number) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {widget.customData.table.rows.map((row: any[], i: number) => (
                        <tr key={i}>
                          {row.map((cell: any, ci: number) => (
                            <td key={ci} style={{ fontFamily: typeof cell === 'number' ? 'monospace' : 'inherit' }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>Empty AI Analysis Artifact</div>
          )}
        </div>
      );
    }

    case 'code_ide': {
      return (
        <IDEWidget
          widget={widget}
          globalParams={globalParams}
          onUpdateContent={onUpdateContent}
        />
      );
    }

    default:
      return <div>Unsupported Widget Type</div>;
  }
};

export default WidgetComponent;
