import { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import type { Widget } from '../types';
import './widget-library.css';

interface LibraryItem {
  type: Widget['type'];
  category: Widget['category'];
  title: string;
  description: string;
}

interface WidgetLibraryProps {
  onClose: () => void;
  onAddWidget: (type: Widget['type'], title: string, category: Widget['category'], description: string) => void;
}

const AVAILABLE_WIDGETS: LibraryItem[] = [
  {
    type: 'price_chart',
    category: 'Equity',
    title: 'Asset Price Chart',
    description: 'High-fidelity price AreaChart and volume BarChart. Linked to global ticker/range parameters by default.'
  },
  {
    type: 'financial_table',
    category: 'Equity',
    title: 'Financial Metrics Table',
    description: 'Tabular spreadsheet showing Revenue, Net Income, Operating Margins, and EPS with Year-over-Year indicators.'
  },
  {
    type: 'news_sentiment',
    category: 'Equity',
    title: 'News & Sentiment Feed',
    description: 'Real-time market headlines coupled with AI-driven sentiment analysis tagging (Bullish, Bearish, Neutral).'
  },
  {
    type: 'macro_indicators',
    category: 'Economy',
    title: 'Macroeconomic Indicators',
    description: 'Multi-line comparative chart monitoring US GDP Growth, CPI Inflation, and Unemployment rates over time.'
  },
  {
    type: 'crypto_chart',
    category: 'Crypto',
    title: 'Crypto Price Chart',
    description: 'Tailored high-volatility price tracker for digital assets (e.g. BTC, ETH) with responsive volume bars.'
  },
  {
    type: 'text_note',
    category: 'General',
    title: 'Scratch Note Pad',
    description: 'Editable text area canvas designed for notes, investment theses, ideas, and workspace commentary.'
  },
  {
    type: 'code_ide',
    category: 'Developer',
    title: 'Developer Sandbox IDE',
    description: 'Interactive JavaScript and HTML editor. Write custom scripts to process metrics, analyze chartData, and compile visuals.'
  }
];

const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onClose, onAddWidget }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | Widget['category']>('All');

  // Filter items based on tab & query
  const filteredWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="library-overlay" onClick={onClose}>
      <div className="library-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Panel */}
        <div className="library-header">
          <div className="library-title-row">
            <h2 className="library-title">Widget Library</h2>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          
          <input
            type="text"
            className="library-search-input"
            placeholder="Search widgets by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Selection Filter */}
        <div className="library-tabs">
          {(['All', 'Equity', 'Economy', 'Crypto', 'Developer', 'General'] as const).map((tab) => (
            <button
              key={tab}
              className={`library-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Widget Cards List */}
        <div className="library-body">
          {filteredWidgets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No widgets match your search criteria.
            </div>
          ) : (
            filteredWidgets.map((item, idx) => (
              <button
                key={idx}
                className="library-card-item"
                onClick={() => {
                  onAddWidget(item.type, item.title, item.category, item.description);
                  onClose();
                }}
              >
                <div className="library-card-title-row">
                  <span className="library-card-title">{item.title}</span>
                  <span className={`library-card-category ${item.category.toLowerCase()}`}>
                    {item.category}
                  </span>
                </div>
                <p className="library-card-desc">{item.description}</p>
                <div className="library-card-add">
                  <Plus size={12} />
                  <span>Click to add to workspace</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetLibrary;
