import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Eye, 
  Folder, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle,
  Settings,
  Database,
  FolderOpen
} from 'lucide-react';
import type { GlobalParams } from '../types';
import { 
  generatePriceChartData, 
  generateFinancialTableData, 
  generateNewsSentimentData, 
  generateMacroIndicatorsData 
} from '../utils/mockData';
import './full-page-compiler.css';

interface FullPageCompilerProps {
  initialTicker: string;
  initialDateRange: string;
  onUpdateParams?: (params: Partial<GlobalParams>) => void;
}

interface FileItem {
  name: string;
  path: string;
  description: string;
  language: 'javascript' | 'html';
  code: string;
}

const FILES: FileItem[] = [
  {
    name: 'ma_strategy.js',
    path: 'strategies/ma_strategy.js',
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
  <div style="font-family: var(--font-sans); padding: 16px; display: flex; flex-direction: column; gap: 12px; height: 100%;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="color: var(--primary); margin: 0; font-size: 1.1rem; font-weight: 700;">\${ticker} Moving Average Strategy</h3>
      <span style="font-size: 0.65rem; color: var(--primary); background: var(--primary-glow); border: 1px solid rgba(0,242,254,0.3); padding: 3px 8px; border-radius: 20px;">SMA(5) Active</span>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 5px;">
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 10px; border-radius: 8px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">Asset Price</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">$\${lastPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 10px; border-radius: 8px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">5-Day SMA</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent);">$\${lastSMA.toFixed(2)}</div>
      </div>
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 10px; border-radius: 8px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">Signal</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: \${percentDiff >= 0 ? 'var(--color-success)' : 'var(--color-danger)'};">
          \${percentDiff >= 0 ? 'BULLISH' : 'BEARISH'}
        </div>
      </div>
    </div>

    <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 4px;">
      Ticker <strong>\${ticker}</strong> is trading at 
      <span style="color: \${percentDiff >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 700;">
        \${Math.abs(percentDiff).toFixed(2)}% \${percentDiff >= 0 ? 'above' : 'below'}
      </span> 
      its 5-period moving average. The algorithm recommends a <strong>\${percentDiff >= 0 ? 'Hold / Buy' : 'Short / Wait'}</strong> posture.
    </div>
  </div>
\`;`
  },
  {
    name: 'sentiment_filter.js',
    path: 'filters/sentiment_filter.js',
    description: 'Filter headlines by high/medium impact and bullish sentiment',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. Filter news headlines by sentiment.
console.log("Analyzing news headlines for " + ticker + "...");
console.log("Found " + news.length + " news articles in database.");

const positiveArticles = news.filter(item => item.sentiment === 'bullish');
console.log("Found " + positiveArticles.length + " Bullish articles.");

const articleListHTML = positiveArticles.map(item => \`
  <div style="border-bottom: 1px solid var(--border-color); padding: 10px 0; display: flex; flex-direction: column; gap: 6px;">
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem;">
      <span style="color: var(--primary); font-weight: 600;">\${item.source}</span>
      <span style="color: var(--color-success); background: var(--color-success-glow); padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase; border: 1px solid rgba(16,185,129,0.2);">\${item.sentiment}</span>
    </div>
    <div style="font-size: 0.85rem; font-weight: 500; color: var(--text-primary); line-height: 1.4;">\${item.title}</div>
    <div style="font-size: 0.65rem; color: var(--text-muted);">Published \${item.time}</div>
  </div>
\`).join('');

return \`
  <div style="font-family: var(--font-sans); padding: 16px; height: 100%; display: flex; flex-direction: column;">
    <h3 style="color: var(--primary); font-size: 1.1rem; margin: 0 0 12px 0; font-weight: 700;">\${ticker} Bullish Catalysts Feed</h3>
    <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
      \${articleListHTML || '<div style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 20px;">No bullish catalysts found.</div>'}
    </div>
  </div>
\`;`
  },
  {
    name: 'margin_diagnostics.js',
    path: 'filters/margin_diagnostics.js',
    description: 'Calculate net-income-to-revenue efficiency margins',
    language: 'javascript',
    code: `// Aether Live JS Sandbox. Compute margins and growth ratios.
console.log("Analyzing financials table for " + ticker + "...");

const revItem = financials.find(f => f.metric.includes('Revenue'));
const netItem = financials.find(f => f.metric.includes('Net Income'));

if (!revItem || !netItem) {
  console.error("Required financial items not found!");
  return "<div style='color:var(--color-danger); padding:16px;'>Required financials not found for " + ticker + "</div>";
}

const revVal = parseFloat(revItem.value.replace(/[^0-9.]/g, ''));
const netVal = parseFloat(netItem.value.replace(/[^0-9.]/g, ''));

const efficiency = (netVal / revVal) * 100;
console.log("Revenue: $" + revVal + "B");
console.log("Net Income: $" + netVal + "B");
console.log("Efficiency Margin: " + efficiency.toFixed(2) + "%");

return \`
  <div style="font-family: var(--font-sans); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
    <h3 style="color: var(--primary); font-size: 1.1rem; margin: 0; font-weight: 700;">\${ticker} Efficiency Diagnostics</h3>
    <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 4px 0;">Derived from reported TTM statements</p>
    
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
        <span style="color: var(--text-secondary);">Conversion Ratio (Net/Rev):</span>
        <strong style="color: var(--text-primary);">\${efficiency.toFixed(1)}%</strong>
      </div>
      <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.02);">
        <div style="width: \${efficiency}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px;"></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
        <span style="color: var(--text-secondary);">Revenue Growth YoY:</span>
        <strong style="color: var(--color-success);">\${revItem.yoy}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
        <span style="color: var(--text-secondary);">Net Income Growth YoY:</span>
        <strong style="color: var(--color-success);">\${netItem.yoy}</strong>
      </div>
    </div>
  </div>
\`;`
  },
  {
    name: 'svg_gauge.js',
    path: 'visualizations/svg_gauge.js',
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
  <div style="font-family: var(--font-sans); padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
    <div style="font-size: 0.75rem; color: var(--text-muted); align-self: flex-start; margin-bottom: 8px;">\${ticker} Momentum Dial</div>
    
    <div style="position: relative; width: 160px; height: 90px; display: flex; align-items: flex-end; justify-content: center; margin: 10px 0;">
      <svg width="150" height="85" viewBox="0 0 100 50">
        <!-- Background Arc -->
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8" stroke-linecap="round" />
        
        <!-- Highlighted Active Arc -->
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#fullGaugeGrad)" stroke-width="8" stroke-linecap="round" 
              stroke-dasharray="125.6" stroke-dashoffset="\${125.6 - (125.6 * (value/100))}" />
              
        <defs>
          <linearGradient id="fullGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--accent)" />
            <stop offset="100%" stop-color="var(--primary)" />
          </linearGradient>
        </defs>
        
        <!-- Dial Needle -->
        <line x1="50" y1="50" x2="50" y2="15" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round"
              transform="rotate(\${rotationAngle} 50 50)" style="transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);" />
        <circle cx="50" cy="50" r="4" fill="var(--text-primary)" />
      </svg>
      
      <div style="position: absolute; bottom: 0; font-size: 1.3rem; font-weight: 800; color: var(--primary); text-shadow: 0 0 10px var(--primary-glow);">\${value}%</div>
    </div>
    
    <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 8px;">
      RSI-derived analysis indicates a <strong>\${value > 70 ? 'Strong Bullish Trend' : value < 45 ? 'Consolidating Trend' : 'Standard Accumulation'}</strong>.
    </div>
  </div>
\`;`
  },
  {
    name: 'html_template.html',
    path: 'visualizations/html_template.html',
    description: 'Render static styled HTML directly in preview panel',
    language: 'html',
    code: `<div style="font-family: var(--font-sans); padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
  <div style="width: 48px; height: 48px; background: var(--primary-glow); border: 1.5px solid var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; box-shadow: var(--shadow-glow);">
    <span style="color: var(--primary); font-size: 1.3rem; font-weight: 800;">&lt;&gt;</span>
  </div>
  <h3 style="color: var(--primary); font-size: 1.2rem; margin: 0 0 8px 0; font-weight: 700;">HTML Visual Canvas</h3>
  <p style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; max-width: 280px; margin: 0 0 16px 0;">
    Compile static layouts, grids, descriptions, or visual banners using raw HTML tags and inline CSS variables.
  </p>
  <div style="display: flex; gap: 8px;">
    <span style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.65rem; padding: 4px 10px; border-radius: 20px;">Vanilla CSS</span>
    <span style="background: var(--accent-glow); border: 1px solid var(--accent); color: var(--accent); font-size: 0.65rem; padding: 4px 10px; border-radius: 20px;">Interactive Grid</span>
  </div>
</div>`
  }
];

const FullPageCompiler: React.FC<FullPageCompilerProps> = ({ 
  initialTicker, 
  initialDateRange, 
  onUpdateParams 
}) => {
  const [selectedFile, setSelectedFile] = useState<FileItem>(FILES[0]);
  const [code, setCode] = useState(FILES[0].code);
  const [ticker, setTicker] = useState(initialTicker);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [logs, setLogs] = useState<{ text: string; type: 'log' | 'error'; time: string }[]>([]);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [compileStatus, setCompileStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'render' | 'console'>('render');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'strategies': true,
    'filters': true,
    'visualizations': true
  });

  // Calculate live mock data inside component scope so it's fresh when compiling
  const chartData = useMemo(() => generatePriceChartData(ticker, dateRange), [ticker, dateRange]);
  const financials = useMemo(() => generateFinancialTableData(ticker), [ticker]);
  const news = useMemo(() => generateNewsSentimentData(ticker), [ticker]);
  const macroData = useMemo(() => generateMacroIndicatorsData(dateRange), [dateRange]);

  // Synchronize initial prop variables on app switch
  useEffect(() => {
    setTicker(initialTicker);
  }, [initialTicker]);

  useEffect(() => {
    setDateRange(initialDateRange);
  }, [initialDateRange]);

  // Calculate line numbers
  const lineNumbers = useMemo(() => {
    const lines = code.split('\n').length;
    return Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
  }, [code]);

  // Run compiler
  const handleRun = () => {
    if (selectedFile.language === 'html') {
      setHtmlOutput(code);
      setCompileStatus('success');
      setLogs([{ text: 'Static HTML template compiled successfully.', type: 'log', time: new Date().toLocaleTimeString([], { hour12: false }) }]);
      setActiveTab('render');
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

    customConsole.log(`Compiling sandbox script for ticker "${ticker}" (${dateRange})...`);

    try {
      const context = {
        ticker,
        dateRange,
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
        customConsole.log('Compile Success: Returned layout compiled.');
        setActiveTab('render');
      } else {
        const resultString = result !== undefined ? JSON.stringify(result, null, 2) : 'undefined';
        setHtmlOutput(`<div style="padding:16px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-secondary);">Execution success:<br/><pre style="margin-top:6px; color:var(--primary); font-family:var(--font-mono);">${resultString}</pre></div>`);
        customConsole.log(`Compile Success. Returned value: ${resultString}`);
        setActiveTab('console');
      }
      setCompileStatus('success');
    } catch (err: any) {
      const errMsg = err.message || String(err);
      runLogs.push({ text: `Runtime Error: ${errMsg}`, type: 'error', time: new Date().toLocaleTimeString([], { hour12: false }) });
      setHtmlOutput(`<div style="padding:16px; color:var(--color-danger); font-family:var(--font-mono); font-size:0.75rem;"><strong>Sandbox Error:</strong><br/><pre style="margin-top:6px; color:var(--color-danger); font-family:var(--font-mono); white-space:pre-wrap;">${errMsg}</pre></div>`);
      setCompileStatus('error');
      setActiveTab('console');
    }

    setLogs(runLogs);
  };

  // Run automatically when script or parameters change
  useEffect(() => {
    handleRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, ticker, dateRange]);

  // Load selected file
  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
    setCode(file.code);
    setCompileStatus('idle');
  };

  // Toggle folder open state
  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  // Group files by their parent folder paths
  const strategyFiles = FILES.filter(f => f.path.startsWith('strategies/'));
  const filterFiles = FILES.filter(f => f.path.startsWith('filters/'));
  const visualFiles = FILES.filter(f => f.path.startsWith('visualizations/'));

  return (
    <div className="fullpage-compiler-container animate-fade-in">
      
      {/* 1. Left Snippet Directory File Tree Explorer */}
      <div className="ide-sidebar-explorer">
        <div className="explorer-header">
          <Database size={14} style={{ color: 'var(--primary)' }} />
          <span>Aether Scripts</span>
        </div>
        
        <div className="explorer-body">
          {/* Strategies Folder */}
          <div className="explorer-folder-block">
            <button className="explorer-folder-toggle" onClick={() => toggleFolder('strategies')}>
              {openFolders['strategies'] ? <FolderOpen size={13} /> : <Folder size={13} />}
              <span>strategies</span>
            </button>
            {openFolders['strategies'] && (
              <div className="explorer-folder-contents">
                {strategyFiles.map(f => (
                  <button 
                    key={f.path} 
                    className={`explorer-file-btn ${selectedFile.path === f.path ? 'active' : ''}`}
                    onClick={() => handleSelectFile(f)}
                  >
                    <FileCode2 size={12} className="file-icon js" />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Folder */}
          <div className="explorer-folder-block">
            <button className="explorer-folder-toggle" onClick={() => toggleFolder('filters')}>
              {openFolders['filters'] ? <FolderOpen size={13} /> : <Folder size={13} />}
              <span>filters</span>
            </button>
            {openFolders['filters'] && (
              <div className="explorer-folder-contents">
                {filterFiles.map(f => (
                  <button 
                    key={f.path} 
                    className={`explorer-file-btn ${selectedFile.path === f.path ? 'active' : ''}`}
                    onClick={() => handleSelectFile(f)}
                  >
                    <FileCode2 size={12} className="file-icon js" />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Visualizations Folder */}
          <div className="explorer-folder-block">
            <button className="explorer-folder-toggle" onClick={() => toggleFolder('visualizations')}>
              {openFolders['visualizations'] ? <FolderOpen size={13} /> : <Folder size={13} />}
              <span>visualizations</span>
            </button>
            {openFolders['visualizations'] && (
              <div className="explorer-folder-contents">
                {visualFiles.map(f => (
                  <button 
                    key={f.path} 
                    className={`explorer-file-btn ${selectedFile.path === f.path ? 'active' : ''}`}
                    onClick={() => handleSelectFile(f)}
                  >
                    <FileCode2 size={12} className={`file-icon ${f.language}`} />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System parameters scope info at bottom */}
        <div className="explorer-system-scope">
          <div className="scope-title">
            <Settings size={11} />
            <span>Sandbox context details</span>
          </div>
          <div className="scope-item">
            <span className="scope-name">ticker:</span>
            <span className="scope-val">{ticker}</span>
          </div>
          <div className="scope-item">
            <span className="scope-name">range:</span>
            <span className="scope-val">{dateRange}</span>
          </div>
          <div className="scope-item">
            <span className="scope-name">chartData:</span>
            <span className="scope-val">{chartData.length} records</span>
          </div>
          <div className="scope-item">
            <span className="scope-name">financials:</span>
            <span className="scope-val">{financials.length} records</span>
          </div>
        </div>
      </div>

      {/* 2. Center Panel: Full Editor and Action Controls */}
      <div className="ide-main-editor-area">
        {/* Editor controls ribbon */}
        <div className="ide-editor-header">
          {/* Breadcrumb info */}
          <div className="ide-breadcrumb">
            <span className="breadcrumb-root">workspace</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-file">{selectedFile.path}</span>
          </div>

          {/* Compile Badge Status */}
          <div className="ide-compile-indicator">
            {compileStatus === 'success' && (
              <span className="status-badge success">
                <CheckCircle2 size={11} />
                <span>Compiled</span>
              </span>
            )}
            {compileStatus === 'error' && (
              <span className="status-badge error">
                <AlertTriangle size={11} />
                <span>Runtime Error</span>
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

        {/* Global execution scope params toolbar */}
        <div className="ide-params-bar">
          <div className="param-item">
            <span className="param-label">Target Ticker:</span>
            <input 
              type="text" 
              className="param-input"
              value={ticker}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setTicker(val);
                if (onUpdateParams) onUpdateParams({ ticker: val });
              }}
              placeholder="AAPL"
            />
          </div>

          <div className="param-item">
            <span className="param-label">Date Range:</span>
            <div className="param-range-buttons">
              {['1M', '3M', '6M', '1Y'].map(r => (
                <button 
                  key={r}
                  className={`param-range-btn ${dateRange === r ? 'active' : ''}`}
                  onClick={() => {
                    setDateRange(r);
                    if (onUpdateParams) onUpdateParams({ dateRange: r });
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="ide-action-buttons">
            <button className="btn-primary run-button" onClick={handleRun}>
              <Play size={13} fill="currentColor" />
              <span>Compile & Run</span>
            </button>
            <button className="btn-secondary reset-button" onClick={() => setCode(selectedFile.code)}>
              <RotateCcw size={13} />
              <span>Reset Code</span>
            </button>
          </div>
        </div>

        {/* Code Canvas Textarea */}
        <div className="ide-fullscreen-editor">
          <div className="ide-gutter">
            {lineNumbers.map(n => (
              <span key={n} className="ide-line-no">{n}</span>
            ))}
          </div>
          <textarea
            className="ide-fullscreen-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder={selectedFile.language === 'javascript' ? '// Write logic code here...' : '<!-- Write markup here... -->'}
          />
        </div>
      </div>

      {/* 3. Right Panel: Dynamic split preview outputs */}
      <div className="ide-main-outputs-area">
        {/* Output tab header */}
        <div className="ide-outputs-header">
          <button 
            className={`ide-tab-btn ${activeTab === 'render' ? 'active' : ''}`}
            onClick={() => setActiveTab('render')}
          >
            <Eye size={13} />
            <span>Visual Render</span>
          </button>
          <button 
            className={`ide-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            <Terminal size={13} />
            <span>Terminal Logs ({logs.length})</span>
          </button>
        </div>

        {/* Output Content */}
        <div className="ide-outputs-body">
          {activeTab === 'render' ? (
            <div className="ide-render-panel">
              {htmlOutput ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlOutput }} 
                  style={{ height: '100%', width: '100%', overflow: 'auto' }} 
                />
              ) : (
                <div className="ide-empty-pane">
                  <Eye size={24} style={{ opacity: 0.3 }} />
                  <span>Execute the compiler to render markup visualization.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="ide-console-panel">
              {logs.length === 0 ? (
                <div className="ide-empty-pane">
                  <Terminal size={24} style={{ opacity: 0.3 }} />
                  <span>Console log list is empty. Run compilation to execute stdout logs.</span>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`ide-console-row ${log.type}`}>
                    <span className="console-timestamp">[{log.time}]</span>
                    <span className="console-text">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default FullPageCompiler;
