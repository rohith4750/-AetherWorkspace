import { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Link, 
  Link2Off, 
  Trash2, 
  Maximize2, 
  Layout, 
  FileText,
  DollarSign
} from 'lucide-react';
import type { Widget, GlobalParams } from '../types';
import WidgetComponent from './Widget.tsx';
import './dashboard.css';

interface DashboardProps {
  appName: string;
  appDescription: string;
  widgets: Widget[];
  globalParams: GlobalParams;
  onDeleteWidget: (id: string) => void;
  onToggleLink: (id: string) => void;
  onUpdateParams: (params: Partial<GlobalParams>) => void;
  onReorderWidgets: (startIndex: number, endIndex: number) => void;
  onUpdateWidgetSpan: (id: string, newSpan: 'span-4' | 'span-6' | 'span-8' | 'span-12') => void;
  onUpdateWidgetContent: (id: string, content: string) => void;
  onOpenLibrary: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  appName,
  appDescription,
  widgets,
  globalParams,
  onDeleteWidget,
  onToggleLink,
  onUpdateParams,
  onReorderWidgets,
  onUpdateWidgetSpan,
  onUpdateWidgetContent,
  onOpenLibrary
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [tempTicker, setTempTicker] = useState(globalParams.ticker);

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTicker.trim()) {
      onUpdateParams({ ticker: tempTicker.toUpperCase() });
    }
  };

  const handleTickerBlur = () => {
    if (tempTicker.trim()) {
      onUpdateParams({ ticker: tempTicker.toUpperCase() });
    }
  };

  const handleDateRangeChange = (range: string) => {
    onUpdateParams({ dateRange: range });
  };

  // Synchronize internal input with external parameter updates
  useEffect(() => {
    setTempTicker(globalParams.ticker);
  }, [globalParams.ticker]);

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderWidgets(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  const cycleSpan = (widget: Widget) => {
    const currentSpan = widget.customData?.span || 'span-6';
    let nextSpan: 'span-4' | 'span-6' | 'span-8' | 'span-12' = 'span-6';
    if (currentSpan === 'span-4') nextSpan = 'span-6';
    else if (currentSpan === 'span-6') nextSpan = 'span-8';
    else if (currentSpan === 'span-8') nextSpan = 'span-12';
    else if (currentSpan === 'span-12') nextSpan = 'span-4';
    
    onUpdateWidgetSpan(widget.id, nextSpan);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Navigation Control Panel */}
      <div className="dashboard-header">
        <div className="dashboard-meta">
          <h1 className="dashboard-title">
            <Layout size={18} className="glow-text" style={{ color: 'var(--primary)' }} />
            {appName}
          </h1>
          <span className="dashboard-desc">{appDescription}</span>
        </div>

        <div className="dashboard-controls">
          {/* Ticker Input Control */}
          <div className="control-group">
            <span className="control-label">Ticker</span>
            <form onSubmit={handleTickerSubmit} className="ticker-input-wrapper">
              <input
                type="text"
                value={tempTicker}
                onChange={(e) => setTempTicker(e.target.value)}
                onBlur={handleTickerBlur}
                className="ticker-input"
                placeholder="AAPL"
              />
            </form>
          </div>

          {/* Date Range Control */}
          <div className="control-group">
            <span className="control-label">Range</span>
            <div className="range-buttons">
              {['1M', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`range-btn ${globalParams.dateRange === range ? 'active' : ''}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Add Widget Button */}
          <button onClick={onOpenLibrary} className="btn-primary">
            <Plus size={16} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>

      {/* Dashboard Grid Workspace */}
      <div className="dashboard-body">
        {widgets.length === 0 ? (
          <div className="dashboard-empty glass-panel animate-fade-in">
            <Layout size={48} className="dashboard-empty-icon" />
            <h2 className="dashboard-empty-title">Your Dashboard is empty</h2>
            <p className="dashboard-empty-text">
              Add widgets from the widget library or ask the AI agent on the right to research an asset and generate visual analysis widgets for you.
            </p>
            <button onClick={onOpenLibrary} className="btn-primary">
              <Plus size={16} />
              Open Widget Library
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {widgets.map((widget, index) => {
              const widgetSpan = widget.customData?.span || 'span-6';
              return (
                <div
                  key={widget.id}
                  className={`widget-card glass-panel ${widgetSpan} animate-fade-in`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    opacity: draggedIndex === index ? 0.4 : 1,
                    border: draggedIndex === index ? '1px dashed var(--primary)' : undefined
                  }}
                >
                  {/* Widget Card Header */}
                  <div className="widget-header">
                    <div className="widget-info">
                      {widget.type.includes('chart') && <TrendingUp size={14} className="widget-icon" />}
                      {widget.type.includes('table') && <DollarSign size={14} className="widget-icon" />}
                      {widget.type.includes('news') && <FileText size={14} className="widget-icon" />}
                      {!widget.type.includes('chart') && !widget.type.includes('table') && !widget.type.includes('news') && (
                        <FileText size={14} className="widget-icon" />
                      )}
                      
                      <div className="widget-title-container">
                        <span className="widget-title">
                          {widget.title}
                          {widget.isLinked && ` (${widget.customData?.activeTicker || globalParams.ticker})`}
                        </span>
                        <span className="widget-source">{widget.description}</span>
                      </div>
                    </div>

                    <div className="widget-actions" onClick={(e) => e.stopPropagation()}>
                      {/* Parameter linkage button */}
                      {widget.type !== 'text_note' && widget.type !== 'ai_artifact' && (
                        <button
                          onClick={() => onToggleLink(widget.id)}
                          className={`widget-link-indicator ${widget.isLinked ? 'linked' : 'unlinked'}`}
                          title={widget.isLinked ? 'Linked to global parameters' : 'Unlinked from global parameters'}
                        >
                          {widget.isLinked ? <Link size={12} /> : <Link2Off size={12} />}
                        </button>
                      )}

                      {/* Resize Toggle button */}
                      <button
                        onClick={() => cycleSpan(widget)}
                        className="btn-icon"
                        style={{ width: 24, height: 24 }}
                        title="Resize widget layout"
                      >
                        <Maximize2 size={12} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => onDeleteWidget(widget.id)}
                        className="btn-icon"
                        style={{ width: 24, height: 24, color: 'var(--color-danger)' }}
                        title="Remove widget"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Widget Card Body */}
                  <div className="widget-body">
                    <WidgetComponent
                      widget={widget}
                      globalParams={globalParams}
                      onUpdateContent={(content) => onUpdateWidgetContent(widget.id, content)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
