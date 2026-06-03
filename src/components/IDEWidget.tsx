import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Eye, 
  Code, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import type { Widget, GlobalParams } from '../types';
import { 
  generatePriceChartData, 
  generateFinancialTableData, 
  generateNewsSentimentData, 
  generateMacroIndicatorsData 
} from '../utils/mockData';
import './ide-widget.css';

interface IDEWidgetProps {
  widget: Widget;
  globalParams: GlobalParams;
  onUpdateContent: (content: string) => void;
}

interface CodePreset {
  name: string;
  description: string;
  code: string;
  language: string;
}

const PRESETS: CodePreset[] = [
  {
    name: 'Moving Average Strategy',
    description: 'Calculate 5-period SMA and trigger Bullish/Bearish signals',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. Calculate 5-Day Simple Moving Average.
console.log("Analyzing chart data for " + ticker);

const prices = chartData.map(d => d.price);
console.log("Found " + prices.length + " price data points.");

const sma = [];
for (let i = 0; i < prices.length; i++) {
  if (i < 4) {
    sma.push(null);
  } else {
    const sum = prices.slice(i - 4, i + 1).reduce((sum, p) => sum + p, 0);
    sma.push(sum / 5);
  }
}

const lastPrice = prices[prices.length - 1] || 0;
const lastSMA = sma[sma.length - 1] || 0;
const diff = lastPrice - lastSMA;
const percentDiff = (diff / lastSMA) * 100;

console.log("Current Price: $" + lastPrice);
console.log("5-Day Moving Average: $" + lastSMA.toFixed(2));
console.log("Deviation: " + (percentDiff >= 0 ? "+" : "") + percentDiff.toFixed(2) + "%");

return \`
  <div style="font-family: var(--font-sans); padding: 12px; display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="color: var(--primary); margin: 0; font-size: 1rem;">\${ticker} Moving Average Strategy</h3>
      <span style="font-size: 0.7rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">SMA(5) Indicator</span>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 5px;">
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 8px; border-radius: 6px;">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 2px;">Asset Price</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">$\${lastPrice.toLocaleString()}</div>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 8px; border-radius: 6px;">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 2px;">5-Day SMA</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent);">$\${lastSMA.toFixed(2)}</div>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 8px; border-radius: 6px;">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 2px;">Signal</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: \${percentDiff >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}; font-family: var(--font-display);">
          \${percentDiff >= 0 ? 'BULLISH' : 'BEARISH'}
        </div>
      </div>
    </div>

    <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 4px;">
      Ticker <strong>\${ticker}</strong> is trading at 
      <span style="color: \${percentDiff >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
        \${Math.abs(percentDiff).toFixed(2)}% \${percentDiff >= 0 ? 'above' : 'below'}
      </span> 
      its 5-period moving average.
    </div>
  </div>
\`;`
  },
  {
    name: 'High-Impact Sentiment Filter',
    description: 'Filter headlines by high/medium impact and bullish sentiment',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. Filter news headlines by sentiment.
console.log("Analyzing news headlines for " + ticker + "...");
console.log("Found " + news.length + " news articles in database.");

const positiveArticles = news.filter(item => item.sentiment === 'bullish');
console.log("Found " + positiveArticles.length + " Bullish articles.");

const articleListHTML = positiveArticles.map(item => \`
  <div style="border-bottom: 1px solid var(--border-color); padding: 8px 0; display: flex; flex-direction: column; gap: 4px;">
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem;">
      <span style="color: var(--primary); font-weight: 600;">\${item.source}</span>
      <span style="color: var(--color-success); background: var(--color-success-glow); padding: 1px 4px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">\${item.sentiment}</span>
    </div>
    <div style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary);">\${item.title}</div>
    <div style="font-size: 0.65rem; color: var(--text-muted);">Published \${item.time}</div>
  </div>
\`).join('');

return \`
  <div style="font-family: var(--font-sans); padding: 12px; height: 100%; display: flex; flex-direction: column;">
    <h3 style="color: var(--primary); font-size: 0.95rem; margin: 0 0 10px 0;">\${ticker} Bullish Catalysts</h3>
    <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
      \${articleListHTML || '<div style="color: var(--text-muted); font-size: 0.75rem;">No bullish catalysts found.</div>'}
    </div>
  </div>
\`;`
  },
  {
    name: 'Financial Margin Diagnostics',
    description: 'Calculate net-income-to-revenue efficiency margins',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. Compute margins and growth ratios.
console.log("Analyzing financials table for " + ticker + "...");

const revItem = financials.find(f => f.metric.includes('Revenue'));
const netItem = financials.find(f => f.metric.includes('Net Income'));

if (!revItem || !netItem) {
  console.error("Required financial items not found!");
  return "<div style='color:var(--color-danger); padding:10px;'>Required financials not found for " + ticker + "</div>";
}

const revVal = parseFloat(revItem.value.replace(/[^0-9.]/g, ''));
const netVal = parseFloat(netItem.value.replace(/[^0-9.]/g, ''));

const efficiency = (netVal / revVal) * 100;
console.log("Revenue: $" + revVal + "B");
console.log("Net Income: $" + netVal + "B");
console.log("Efficiency Margin: " + efficiency.toFixed(2) + "%");

return \`
  <div style="font-family: var(--font-sans); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
    <h3 style="color: var(--primary); font-size: 0.95rem; margin: 0;">\${ticker} Efficiency Breakdown</h3>
    <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 4px 0;">Derived from TTM reported statements</p>
    
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
        <span style="color: var(--text-secondary);">Conversion Ratio (Net/Rev):</span>
        <strong style="color: var(--text-primary);">\${efficiency.toFixed(1)}%</strong>
      </div>
      <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
        <div style="width: \${efficiency}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 3px;"></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 6px; border-top: 1px solid var(--border-color); padding-top: 6px;">
        <span style="color: var(--text-secondary);">Revenue YoY:</span>
        <strong style="color: var(--color-success);">\${revItem.yoy}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
        <span style="color: var(--text-secondary);">Net Income YoY:</span>
        <strong style="color: var(--color-success);">\${netItem.yoy}</strong>
      </div>
    </div>
  </div>
\`;`
  },
  {
    name: 'HTML SVG Gauge Visualizer',
    description: 'Render a dynamic SVG dial gauge tracking ticker volatility',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. SVG Gauge Compiler.
console.log("Compiling SVG Dial components for " + ticker);

// Seeded mock volatility calculation
const baseHash = ticker.charCodeAt(0) + (ticker.charCodeAt(1) || 65);
const value = 30 + (baseHash % 55); // value between 30 and 85
console.log("Calculated Momentum Rating: " + value + " / 100");

// Gauge rotation angle (from -90 to +90 degrees)
const rotationAngle = (value / 100) * 180 - 90;

return \`
  <div style="font-family: var(--font-sans); padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
    <div style="font-size: 0.75rem; color: var(--text-muted); align-self: flex-start; margin-bottom: 2px;">\${ticker} Momentum Analytics</div>
    
    <div style="position: relative; width: 140px; height: 80px; display: flex; align-items: flex-end; justify-content: center;">
      <svg width="120" height="70" viewBox="0 0 100 50">
        <!-- Background Arc -->
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" stroke-linecap="round" />
        
        <!-- Highlighted Active Arc -->
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGrad)" stroke-width="8" stroke-linecap="round" 
              stroke-dasharray="125.6" stroke-dashoffset="\${125.6 - (125.6 * (value/100))}" />
              
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--accent)" />
            <stop offset="100%" stop-color="var(--primary)" />
          </linearGradient>
        </defs>
        
        <!-- Dial Needle -->
        <line x1="50" y1="50" x2="50" y2="15" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round"
              transform="rotate(\${rotationAngle} 50 50)" style="transition: transform 0.5s ease-out;" />
        <circle cx="50" cy="50" r="4" fill="var(--text-primary)" />
      </svg>
      
      <div style="position: absolute; bottom: 0; font-size: 1.1rem; font-weight: 800; color: var(--primary);">\${value}%</div>
    </div>
    
    <div style="font-size: 0.65rem; color: var(--text-secondary); text-align: center; margin-top: 4px;">
      Signal indicates <strong>\${value > 70 ? 'High Buying Pressure' : value < 45 ? 'Under-Accumulation' : 'Neutral Range'}</strong>.
    </div>
  </div>
\`;`
  },
  {
    name: 'Pure HTML Code Preview',
    description: 'Render customized HTML layout directly inside the viewport',
    language: 'html',
    code: `<div style="font-family: var(--font-sans); padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%;">
  <h3 style="color: var(--primary); font-size: 1.1rem; margin-bottom: 6px;">HTML Developer Preview</h3>
  <p style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; margin-bottom: 12px;">
    This is static HTML code compile. You can write any CSS styles or HTML tags here.
  </p>
  <div style="display: flex; gap: 8px; justify-content: center;">
    <span style="background: var(--primary-glow); border: 1px solid var(--primary); color: var(--primary); font-size: 0.65rem; padding: 3px 8px; border-radius: 20px;">Fast rendering</span>
    <span style="background: var(--accent-glow); border: 1px solid var(--accent); color: var(--accent); font-size: 0.65rem; padding: 3px 8px; border-radius: 20px;">Zero bundle size</span>
  </div>
</div>`
  }
];

const IDEWidget: React.FC<IDEWidgetProps> = ({ widget, globalParams, onUpdateContent }) => {
  // Current code active inside editor
  const [code, setCode] = useState(widget.customContent || PRESETS[0].code);
  const [language, setLanguage] = useState<'javascript' | 'html'>(widget.customData?.language || 'javascript');
  const [activeTab, setActiveTab] = useState<'editor' | 'console' | 'render'>('editor');
  const [logs, setLogs] = useState<{ text: string; type: 'log' | 'error'; time: string }[]>([]);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [compileStatus, setCompileStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load live mock data inside component scope so it's fresh when compiling
  const activeTicker = useMemo(() => {
    return widget.isLinked ? globalParams.ticker : (widget.customData?.activeTicker || 'AAPL');
  }, [widget.isLinked, globalParams.ticker, widget.customData?.activeTicker]);

  const activeDateRange = useMemo(() => {
    return widget.isLinked ? globalParams.dateRange : (widget.customData?.activeDateRange || '3M');
  }, [widget.isLinked, globalParams.dateRange, widget.customData?.activeDateRange]);

  const chartData = useMemo(() => generatePriceChartData(activeTicker, activeDateRange), [activeTicker, activeDateRange]);
  const financials = useMemo(() => generateFinancialTableData(activeTicker), [activeTicker]);
  const news = useMemo(() => generateNewsSentimentData(activeTicker), [activeTicker]);
  const macroData = useMemo(() => generateMacroIndicatorsData(activeDateRange), [activeDateRange]);

  // Split lines for IDE gutter
  const lineNumbers = useMemo(() => {
    const lines = code.split('\n').length;
    return Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
  }, [code]);

  // Run/compile user code
  const handleRun = () => {
    if (language === 'html') {
      setHtmlOutput(code);
      setCompileStatus('success');
      setLogs([{ text: 'Static HTML compiled successfully.', type: 'log', time: new Date().toLocaleTimeString([], { hour12: false }) }]);
      setActiveTab('render');
      onUpdateContent(code);
      return;
    }

    const runLogs: typeof logs = [];
    const customConsole = {
      log: (...args: any[]) => {
        const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
        runLogs.push({ text, type: 'log', time: new Date().toLocaleTimeString([], { hour12: false }) });
      },
      error: (...args: any[]) => {
        const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
        runLogs.push({ text, type: 'error', time: new Date().toLocaleTimeString([], { hour12: false }) });
      }
    };

    customConsole.log(`Running script on context ticker "${activeTicker}" (${activeDateRange})...`);

    try {
      // Evaluate function safely using JavaScript function sandbox
      const context = {
        ticker: activeTicker,
        dateRange: activeDateRange,
        chartData,
        financials,
        news,
        macroData,
        console: customConsole
      };

      const keys = Object.keys(context);
      const values = Object.values(context);

      const executor = new Function(...keys, `
        try {
          ${code}
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      `);

      const result = executor(...values);

      if (typeof result === 'string') {
        setHtmlOutput(result);
        customConsole.log('Execution success: HTML visual markup compiled.');
        setActiveTab('render');
      } else {
        const resultString = result !== undefined ? JSON.stringify(result, null, 2) : 'undefined';
        setHtmlOutput(`<div style="padding:12px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-secondary);">Execution returned value:<br/><pre style="margin-top:6px; color:var(--primary); font-family:var(--font-mono);">${resultString}</pre></div>`);
        customConsole.log(`Execution success. Returned: ${resultString}`);
        setActiveTab('console');
      }
      setCompileStatus('success');
    } catch (err: any) {
      const errMsg = err.message || String(err);
      runLogs.push({ text: `Runtime Error: ${errMsg}`, type: 'error', time: new Date().toLocaleTimeString([], { hour12: false }) });
      setHtmlOutput(`<div style="padding:12px; color:var(--color-danger); font-family:var(--font-mono); font-size:0.75rem;"><strong>Sandbox Compilation Error:</strong><br/><pre style="margin-top:6px; color:var(--color-danger); font-family:var(--font-mono); white-space:pre-wrap;">${errMsg}</pre></div>`);
      setCompileStatus('error');
      setActiveTab('console');
    }

    setLogs(runLogs);
    onUpdateContent(code);
  };

  // Run on mount
  useEffect(() => {
    handleRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTicker, activeDateRange]);

  // Load preset snippet
  const handleLoadPreset = (preset: CodePreset) => {
    setCode(preset.code);
    setLanguage(preset.language as any);
    setCompileStatus('idle');
  };

  // Reset editor code
  const handleReset = () => {
    setCode('');
    setCompileStatus('idle');
    setLogs([]);
    setHtmlOutput('');
  };

  return (
    <div className="ide-widget-container">
      {/* Top Header Tool Belt */}
      <div className="ide-toolbar">
        {/* Preset snippet picker */}
        <div className="ide-preset-dropdown">
          <div className="ide-dropdown-label">
            <span>Snippets</span>
            <ChevronDown size={10} style={{ opacity: 0.6 }} />
          </div>
          <div className="ide-dropdown-menu">
            {PRESETS.map((p, idx) => (
              <button key={idx} className="ide-dropdown-item" onClick={() => handleLoadPreset(p)}>
                <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{p.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language selector */}
        <div className="ide-language-buttons">
          <button 
            className={`ide-lang-btn ${language === 'javascript' ? 'active' : ''}`}
            onClick={() => setLanguage('javascript')}
          >
            JavaScript
          </button>
          <button 
            className={`ide-lang-btn ${language === 'html' ? 'active' : ''}`}
            onClick={() => setLanguage('html')}
          >
            HTML
          </button>
        </div>

        {/* Compiler Status */}
        <div className="ide-status-indicator">
          {compileStatus === 'success' && (
            <span className="status-badge success">
              <CheckCircle2 size={10} />
              <span>Compiled</span>
            </span>
          )}
          {compileStatus === 'error' && (
            <span className="status-badge error">
              <AlertTriangle size={10} />
              <span>Error</span>
            </span>
          )}
          {compileStatus === 'idle' && (
            <span className="status-badge idle">
              <span className="status-dot"></span>
              <span>Not Run</span>
            </span>
          )}
        </div>
      </div>

      {/* Editor & Gutter Work Area */}
      <div className="ide-editor-viewport">
        {/* Line Gutter */}
        <div className="ide-editor-gutter">
          {lineNumbers.map((n) => (
            <span key={n} className="ide-line-number">{n}</span>
          ))}
        </div>

        {/* Raw text input */}
        <textarea
          className="ide-editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={language === 'javascript' ? '// Write JavaScript logic here...' : '<!-- Write HTML markup here... -->'}
          spellCheck={false}
        />
      </div>

      {/* Controls Button Row */}
      <div className="ide-control-row">
        <button className="btn-primary ide-run-btn" onClick={handleRun}>
          <Play size={12} fill="currentColor" />
          <span>Run Compiler</span>
        </button>
        <button className="btn-secondary" onClick={handleReset} style={{ padding: '6px 12px' }}>
          <RotateCcw size={12} />
          <span>Clear</span>
        </button>
      </div>

      {/* Output Console Tabs */}
      <div className="ide-output-tabs-container">
        <div className="ide-output-tabs">
          <button 
            className={`ide-output-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileCode size={12} />
            <span>Editor</span>
          </button>
          <button 
            className={`ide-output-tab ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            <Terminal size={12} />
            <span>Console ({logs.length})</span>
          </button>
          <button 
            className={`ide-output-tab ${activeTab === 'render' ? 'active' : ''}`}
            onClick={() => setActiveTab('render')}
          >
            <Eye size={12} />
            <span>Render Preview</span>
          </button>
        </div>

        {/* Dynamic viewport panels */}
        <div className="ide-output-panel">
          {activeTab === 'editor' && (
            <div className="ide-tab-info-panel">
              <span className="ide-info-icon"><Code size={16} /></span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>JavaScript Sandboxed Compiler</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  Write JavaScript modules that return an HTML string. You have access to active workspace parameters: 
                  <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.03)', padding: '1px 3px', borderRadius: '3px', marginLeft: '3px' }}>ticker</code>, 
                  <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.03)', padding: '1px 3px', borderRadius: '3px', marginLeft: '3px' }}>chartData</code>, and 
                  <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.03)', padding: '1px 3px', borderRadius: '3px', marginLeft: '3px' }}>financials</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="ide-console-viewport">
              {logs.length === 0 ? (
                <div className="ide-console-empty">Terminal is clear. Execute script to output logs.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`ide-console-line ${log.type}`}>
                    <span className="ide-console-time">[{log.time}]</span>
                    <span className="ide-console-text">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'render' && (
            <div className="ide-render-viewport">
              {htmlOutput ? (
                <div dangerouslySetInnerHTML={{ __html: htmlOutput }} style={{ height: '100%', width: '100%', overflowY: 'auto' }} />
              ) : (
                <div className="ide-render-empty">
                  <span>Render viewport is empty. Return an HTML string to render dynamic visuals.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDEWidget;
