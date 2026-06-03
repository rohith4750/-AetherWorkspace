import { useState } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Coins, 
  Layers, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Widget, DashboardApp, GlobalParams } from './types';
import Dashboard from './components/Dashboard';
import WidgetLibrary from './components/WidgetLibrary';
import AIAgent from './components/AIAgent';
import './App.css';

// Definition of prebuilt App templates (Workspaces)
const PREBUILT_APPS: DashboardApp[] = [
  {
    id: 'research',
    name: 'Research Workspace',
    description: 'Fundamental equity dashboard',
    icon: 'TrendingUp',
    defaultTicker: 'AAPL',
    defaultDateRange: '3M',
    widgets: [
      {
        id: 'widget_price_chart_init',
        title: 'Asset Price Chart',
        description: 'Historical price AreaChart & volume BarChart',
        type: 'price_chart',
        category: 'Equity',
        isLinked: true,
        customData: { span: 'span-7' }
      },
      {
        id: 'widget_financial_table_init',
        title: 'Financial Metrics Table',
        description: 'Key metrics spreadsheet',
        type: 'financial_table',
        category: 'Equity',
        isLinked: true,
        customData: { span: 'span-5' }
      },
      {
        id: 'widget_news_sentiment_init',
        title: 'News & Sentiment Feed',
        description: 'Headlines & sentiment tags',
        type: 'news_sentiment',
        category: 'Equity',
        isLinked: true,
        customData: { span: 'span-12' }
      }
    ],
    suggestedPrompts: [
      'Summarize AAPL financials',
      'Analyze recent news sentiment',
      'Compare AAPL to tech peers'
    ],
    systemInstruction: 'You are an equity research assistant specializing in asset valuation and sentiment analysis.'
  },
  {
    id: 'macro',
    name: 'Macro & Policy',
    description: 'Global economic tracker',
    icon: 'Globe',
    defaultTicker: 'US',
    defaultDateRange: '1Y',
    widgets: [
      {
        id: 'widget_macro_init',
        title: 'Macroeconomic Indicators',
        description: 'US GDP Growth, CPI & Unemployment',
        type: 'macro_indicators',
        category: 'Economy',
        isLinked: true,
        customData: { span: 'span-7' }
      },
      {
        id: 'widget_note_init',
        title: 'Macro Policy Note',
        description: 'Personal research pad',
        type: 'text_note',
        category: 'General',
        isLinked: false,
        customContent: 'Write macroeconomic findings, rate cut projections, or Federal Reserve announcements here...',
        customData: { span: 'span-5' }
      }
    ],
    suggestedPrompts: [
      'Analyze GDP growth projections',
      'Report inflation changes',
      'How does CPI relate to unemployment?'
    ],
    systemInstruction: 'You are a macroeconomic policy advisor tracking global indexes and Central Bank decisions.'
  },
  {
    id: 'crypto',
    name: 'Crypto Analytics',
    description: 'Digital assets dashboard',
    icon: 'Coins',
    defaultTicker: 'BTC',
    defaultDateRange: '3M',
    widgets: [
      {
        id: 'widget_crypto_chart_init',
        title: 'Crypto Price Chart',
        description: 'Digital asset price and volume',
        type: 'crypto_chart',
        category: 'Crypto',
        isLinked: true,
        customData: { span: 'span-7' }
      },
      {
        id: 'widget_news_sentiment_crypto_init',
        title: 'Crypto News Sentiment',
        description: 'Real-time crypto feeds',
        type: 'news_sentiment',
        category: 'Crypto',
        isLinked: true,
        customData: { span: 'span-5' }
      },
      {
        id: 'widget_note_crypto_init',
        title: 'Portfolio Allocation Notes',
        description: 'Trading ideas',
        type: 'text_note',
        category: 'General',
        isLinked: false,
        customContent: 'Add technical indicators assessment (e.g. RSI, MACD overlays) and positions here...',
        customData: { span: 'span-12' }
      }
    ],
    suggestedPrompts: [
      'Compare BTC with crypto peers',
      'Analyze BTC news sentiment',
      'Create BTC position note'
    ],
    systemInstruction: 'You are a cryptocurrency portfolio manager analyzing volatility, block metrics, and news sentiment.'
  },
  {
    id: 'custom',
    name: 'Custom Canvas',
    description: 'Blank workspace builder',
    icon: 'Layers',
    defaultTicker: 'NVDA',
    defaultDateRange: '3M',
    widgets: [],
    suggestedPrompts: [
      'Compare peer valuations for NVDA',
      'Analyze NVDA financials',
      'Help me set up a new layout'
    ],
    systemInstruction: 'You are a general financial analyst assistant ready to query metrics and design custom workspaces.'
  }
];

function App() {
  const [activeApp, setActiveApp] = useState<DashboardApp>(PREBUILT_APPS[0]);
  const [globalParams, setGlobalParams] = useState<GlobalParams>({
    ticker: PREBUILT_APPS[0].defaultTicker,
    dateRange: PREBUILT_APPS[0].defaultDateRange
  });
  const [widgets, setWidgets] = useState<Widget[]>(PREBUILT_APPS[0].widgets);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // App switching helper
  const handleSwitchApp = (app: DashboardApp) => {
    setActiveApp(app);
    setGlobalParams({
      ticker: app.defaultTicker,
      dateRange: app.defaultDateRange
    });
    setWidgets(app.widgets);
    if (app.id === 'custom') {
      setIsLibraryOpen(true); // Proactively open library on Custom canvas
    }
  };

  // Update Ticker/Range globally
  const handleUpdateParams = (newParams: Partial<GlobalParams>) => {
    setGlobalParams((prev) => ({
      ...prev,
      ...newParams
    }));
  };

  // Widget management: Add
  const handleAddWidget = (
    type: Widget['type'],
    title: string,
    category: Widget['category'],
    description: string
  ) => {
    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      title,
      description,
      type,
      category,
      isLinked: type !== 'text_note', // link all charts/tables by default
      customData: { span: 'span-6' }
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  // Widget management: Add custom AI artifact
  const handleAddAIWidget = (widgetConfig: Omit<Widget, 'id'>) => {
    const newWidget: Widget = {
      ...widgetConfig,
      id: `widget_${Date.now()}`
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  // Widget management: Delete
  const handleDeleteWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  // Widget management: Parameter Linkage Toggle
  const handleToggleLink = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          // If we are unlinking, capture the current global values so the data stays static
          const nextLink = !w.isLinked;
          return {
            ...w,
            isLinked: nextLink,
            customData: {
              ...w.customData,
              activeTicker: nextLink ? undefined : globalParams.ticker,
              activeDateRange: nextLink ? undefined : globalParams.dateRange
            }
          };
        }
        return w;
      })
    );
  };

  // Widget management: Reorder
  const handleReorderWidgets = (startIndex: number, endIndex: number) => {
    const nextList = [...widgets];
    const [removed] = nextList.splice(startIndex, 1);
    nextList.splice(endIndex, 0, removed);
    setWidgets(nextList);
  };

  // Widget management: Layout spans
  const handleUpdateWidgetSpan = (id: string, newSpan: 'span-4' | 'span-6' | 'span-8' | 'span-12') => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            customData: {
              ...w.customData,
              span: newSpan
            }
          };
        }
        return w;
      })
    );
  };

  // Widget management: Text note update
  const handleUpdateWidgetContent = (id: string, content: string) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            customContent: content
          };
        }
        return w;
      })
    );
  };

  const getNavIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp size={16} className="nav-item-icon" />;
      case 'Globe': return <Globe size={16} className="nav-item-icon" />;
      case 'Coins': return <Coins size={16} className="nav-item-icon" />;
      default: return <Layers size={16} className="nav-item-icon" />;
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <div className="sidebar-panel">
        <div className="logo-container">
          <div className="logo-icon-box">
            <span className="logo-icon-svg" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>A</span>
          </div>
          <span className="logo-text">Aether Workspace</span>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Applications</span>
          <div className="navigation-list">
            {PREBUILT_APPS.map((app) => (
              <button
                key={app.id}
                className={`nav-item ${activeApp.id === app.id ? 'active' : ''}`}
                onClick={() => handleSwitchApp(app)}
              >
                {getNavIcon(app.icon)}
                <div className="nav-item-meta">
                  <span className="nav-item-name">{app.name}</span>
                  <span className="nav-item-desc">{app.description}</span>
                </div>
                <ChevronRight size={12} className="nav-item-icon" style={{ marginLeft: 'auto', opacity: activeApp.id === app.id ? 1 : 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info links */}
        <div className="sidebar-footer">
          <span>Enterprise Secure Sandbox</span>
          <a href="https://aether.finance" target="_blank" rel="noreferrer" className="sidebar-footer-link">
            <span>Visit Aether Portal</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="workspace-panel">
        <Dashboard
          appName={activeApp.name}
          appDescription={activeApp.description}
          widgets={widgets}
          globalParams={globalParams}
          onDeleteWidget={handleDeleteWidget}
          onToggleLink={handleToggleLink}
          onUpdateParams={handleUpdateParams}
          onReorderWidgets={handleReorderWidgets}
          onUpdateWidgetSpan={handleUpdateWidgetSpan}
          onUpdateWidgetContent={handleUpdateWidgetContent}
          onOpenLibrary={() => setIsLibraryOpen(true)}
        />

        <AIAgent
          activeWidgets={widgets}
          globalParams={globalParams}
          suggestedPrompts={activeApp.suggestedPrompts}
          onAddWidget={handleAddAIWidget}
        />
      </div>

      {/* Slide-out Widget Catalog Overlay */}
      {isLibraryOpen && (
        <WidgetLibrary
          onClose={() => setIsLibraryOpen(false)}
          onAddWidget={handleAddWidget}
        />
      )}
    </div>
  );
}

export default App;
