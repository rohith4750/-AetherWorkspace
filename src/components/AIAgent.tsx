import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Table, 
  FileText, 
  Plus 
} from 'lucide-react';
import type { Widget, ChatMessage, GlobalParams } from '../types';
import './ai-agent.css';

interface AIAgentProps {
  activeWidgets: Widget[];
  globalParams: GlobalParams;
  suggestedPrompts: string[];
  onAddWidget: (widget: Omit<Widget, 'id'>) => void;
}

const INITIAL_MESSAGES = (ticker: string): ChatMessage[] => [
  {
    id: 'welcome',
    sender: 'assistant',
    text: `Hello! I am your Aether AI Workspace Agent. I'm connected directly to your workspace grid. I can see the widgets you have open, query their contents, run comparative analyses, and generate new charts or tables.

What asset would you like to analyze today? You can search any ticker like **AAPL**, **TSLA**, **NVDA**, or **BTC** in the global control panel. Currently, you have **${ticker}** active in your workspace.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const AIAgent: React.FC<AIAgentProps> = ({
  activeWidgets,
  globalParams,
  suggestedPrompts,
  onAddWidget
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES(globalParams.ticker));
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle message sending
  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Simulate Agent Thinking and Response
    setTimeout(() => {
      const response = generateAIResponse(textToSend, globalParams.ticker, activeWidgets);
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        artifact: response.artifact
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1200);
  };

  const handleAddArtifactToDashboard = (artifact: NonNullable<ChatMessage['artifact']>) => {
    onAddWidget({
      title: artifact.title,
      description: 'AI Generated Analysis',
      type: artifact.type,
      category: 'AI',
      isLinked: false,
      customContent: artifact.content,
      customData: artifact.data
    });
  };

  // Response Generator Logic
  const generateAIResponse = (
    query: string, 
    ticker: string, 
    widgets: Widget[]
  ): { text: string; artifact?: ChatMessage['artifact'] } => {
    const lowerQuery = query.toLowerCase();
    const widgetNames = widgets.map(w => w.title);
    
    // 1. Peer Comparison Table Query
    if (lowerQuery.includes('compare') || lowerQuery.includes('peer') || lowerQuery.includes('competitor')) {
      const peerData = ticker === 'BTC' || ticker === 'ETH' 
        ? {
            title: `Crypto Peer Comparison: ${ticker} vs Peers`,
            headers: ['Asset', 'Price', '24h Vol', 'Market Cap', 'AI Outlook'],
            rows: [
              [ticker, ticker === 'BTC' ? '$67,450' : '$3,520', '$28.4B', ticker === 'BTC' ? '$1.3T' : '$420B', 'Bullish Outperform'],
              [ticker === 'BTC' ? 'ETH' : 'BTC', ticker === 'BTC' ? '$3,520' : '$67,450', '$14.2B', ticker === 'BTC' ? '$420B' : '$1.3T', 'Neutral Accumulate'],
              ['SOL', '$172.50', '$4.1B', '$78B', 'Bullish Growth'],
              ['ADA', '$0.46', '$620M', '$16B', 'Consolidating']
            ]
          }
        : {
            title: `Equity Peer Comparison: ${ticker} vs Industry Peers`,
            headers: ['Company', 'P/E Ratio', 'Operating Margin', 'YoY Growth', 'AI Score'],
            rows: [
              [ticker, '28.4x', '22.4%', '+12.5%', '8.8 / 10'],
              ['MSFT', '32.1x', '43.2%', '+14.0%', '9.1 / 10'],
              ['GOOGL', '21.5x', '29.8%', '+15.2%', '8.5 / 10'],
              ['AAPL', '27.8x', '30.1%', '+8.4%', '8.0 / 10']
            ]
          };

      return {
        text: `I have compiled a peer comparison analysis for **${ticker}** comparing it against top competitors in the sector.

The generated table highlights key valuations, margins, and my proprietary AI scoring matrices based on current filings and market pricing. You can add this comparison table directly to your workspace.`,
        artifact: {
          title: `${ticker} Peer Comparison Table`,
          type: 'ai_artifact',
          data: {
            title: `${ticker} vs Peers`,
            analysis: 'Comparative overview of valuations and metrics relative to industry benchmarks.',
            table: peerData
          }
        }
      };
    }

    // 2. Earnings and Financial Summary Query
    if (lowerQuery.includes('financial') || lowerQuery.includes('earnings') || lowerQuery.includes('revenue') || lowerQuery.includes('margins')) {
      const summaryHTML = `
        <div style="font-family: var(--font-sans)">
          <h3 style="color: var(--primary); margin-bottom: 8px;">${ticker} Financial Diagnostics</h3>
          <p style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 12px;">Automated deep-dive of recent financial statements.</p>
          <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem;">
            <li style="border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
              <strong style="color: var(--text-primary)">Revenue Trajectory:</strong> High stability with consistent product-line traction.
            </li>
            <li style="border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
              <strong style="color: var(--text-primary)">Margin Analysis:</strong> Net profit margins are holding strong at optimal ranges.
            </li>
            <li style="border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
              <strong style="color: var(--text-primary)">Capital Allocation:</strong> Aggressive investments in R&D and strategic AI infrastructure.
            </li>
          </ul>
        </div>
      `;

      return {
        text: `I've performed a financial health diagnostics audit on **${ticker}**. 

Based on my review of the balance sheet, capital margins, and current cash flows:
1. **Capitalization structure** remains highly robust.
2. **Gross operating leverage** indicates sustainable margins despite recent input headwinds.

Here is the financial diagnostics card. Click the button to add it to your dashboard.`,
        artifact: {
          title: `${ticker} Financial Diagnostics Summary`,
          type: 'ai_artifact',
          content: summaryHTML,
          data: {}
        }
      };
    }

    // 3. News Sentiment Query
    if (lowerQuery.includes('sentiment') || lowerQuery.includes('news') || lowerQuery.includes('bullish') || lowerQuery.includes('bearish')) {
      const sentimentHTML = `
        <div>
          <h3 style="color: var(--color-success)">${ticker} Sentiment Breakdown</h3>
          <p style="color: var(--text-secondary); margin-bottom: 10px;">AI news impact assessment over 30 days.</p>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <div style="flex: 1; text-align: center; background: rgba(16,185,129,0.1); border-radius: 6px; padding: 6px;">
              <div style="color: var(--color-success); font-weight: 700; font-size: 1rem;">72%</div>
              <div style="font-size: 0.65rem; color: var(--text-muted);">Bullish</div>
            </div>
            <div style="flex: 1; text-align: center; background: rgba(239,68,68,0.1); border-radius: 6px; padding: 6px;">
              <div style="color: var(--color-danger); font-weight: 700; font-size: 1rem;">18%</div>
              <div style="font-size: 0.65rem; color: var(--text-muted);">Bearish</div>
            </div>
            <div style="flex: 1; text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px;">
              <div style="color: var(--text-secondary); font-weight: 700; font-size: 1rem;">10%</div>
              <div style="font-size: 0.65rem; color: var(--text-muted);">Neutral</div>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
            Mainstream articles highlight strong demand for core products. Bearish notes relate primarily to microeconomic cost pressures.
          </p>
        </div>
      `;

      return {
        text: `I have analyzed news feeds and social buzz metrics for **${ticker}**. 

The overall index registers a **Bullish Bias** of **72%**. Public sentiment is highly receptive to the company's recent technology integrations.

I've generated a Sentiment Breakdown card detailing these ratios.`,
        artifact: {
          title: `${ticker} AI Sentiment Ratios`,
          type: 'ai_artifact',
          content: sentimentHTML,
          data: {}
        }
      };
    }

    // 4. Default Ticker Analysis response
    const widgetListText = widgets.length > 0 
      ? `I see you currently have the following widgets on your canvas: **${widgetNames.join(', ')}**.`
      : `Your dashboard is currently empty.`;

    const generalHTML = `
      <div>
        <h3 style="color: var(--primary);">${ticker} Strategic Overview</h3>
        <p style="color: var(--text-secondary); margin-bottom: 8px;">Context: Ticker active in workspace.</p>
        <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
          <strong>Target Price Matrix:</strong> $${(ticker === 'BTC' ? 74000 : ticker === 'TSLA' ? 260 : 180).toLocaleString()} (AI Consensus)<br/>
          <strong>Risk Rating:</strong> Moderate volatility thresholds.<br/>
          <strong>Investment Thesis:</strong> Competitive advantages secure strong baseline returns.
        </p>
      </div>
    `;

    return {
      text: `I've analyzed your active workspace environment. ${widgetListText}

For **${ticker}** (priced in the range of ${globalParams.dateRange}), I recommend focusing on current margin resilience. Since you are active in this workflow, I've compiled an automated Strategic Overview briefing note. 

Would you like to add it to your dashboard?`,
      artifact: {
        title: `${ticker} Strategic Overview Note`,
        type: 'ai_artifact',
        content: generalHTML,
        data: {}
      }
    };
  };

  return (
    <div className="agent-sidebar">
      {/* Header Container */}
      <div className="agent-header">
        <div className="agent-title-row">
          <h2 className="agent-title">
            <Bot size={18} style={{ color: 'var(--primary)' }} />
            AI Workspace Agent
          </h2>
          <div className="agent-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>
        
        {/* Seen Active Widgets Context */}
        <div className="agent-context-info">
          <span>Active Context ({activeWidgets.length} widgets seen):</span>
          <div className="context-widgets-container">
            <div className="context-widget-badge" style={{ color: 'var(--primary)', borderColor: 'rgba(0,242,254,0.2)' }}>
              Ticker: {globalParams.ticker}
            </div>
            <div className="context-widget-badge" style={{ color: 'var(--accent)', borderColor: 'rgba(168,85,247,0.2)' }}>
              Range: {globalParams.dateRange}
            </div>
            {activeWidgets.map((w) => (
              <div key={w.id} className="context-widget-badge">
                {w.type.includes('chart') && <TrendingUp size={10} />}
                {w.type.includes('table') && <Table size={10} />}
                {w.type.includes('news') && <FileText size={10} />}
                {w.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="agent-chat-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
            <span className="chat-sender-label">
              {msg.sender === 'user' ? 'You' : 'Aether AI'} • {msg.timestamp}
            </span>
            <div className="chat-bubble">
              {msg.text}
            </div>
            
            {/* If message has an actionable AI artifact */}
            {msg.sender === 'assistant' && msg.artifact && (
              <div className="chat-artifact-card">
                <div className="chat-artifact-header">
                  <span className="chat-artifact-title">{msg.artifact.title}</span>
                  <button 
                    onClick={() => handleAddArtifactToDashboard(msg.artifact!)}
                    className="btn-primary"
                    style={{ padding: '4px 8px', fontSize: '0.65rem', borderRadius: '4px' }}
                  >
                    <Plus size={10} />
                    Add to Dashboard
                  </button>
                </div>
                <div className="chat-artifact-preview">
                  {msg.artifact.content ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.artifact.content }} style={{ transform: 'scale(0.95)', transformOrigin: 'top left' }} />
                  ) : msg.artifact.data?.table ? (
                    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <Table size={12} style={{ color: 'var(--primary)' }} />
                      Comparison Grid data compiled.
                    </span>
                  ) : (
                    <span>Analysis report compiled.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Thinking State Loader */}
        {isThinking && (
          <div className="chat-bubble-wrapper assistant">
            <span className="chat-sender-label">Aether AI</span>
            <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Sparkles size={14} className="pulse-glow" style={{ color: 'var(--primary)' }} />
              Agent is analyzing workspace data...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Inputs panel */}
      <div className="agent-input-panel">
        {/* Suggestion Prompts list */}
        <div className="suggestion-prompts-row">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="suggestion-prompt-btn"
              onClick={() => handleSend(prompt)}
              disabled={isThinking}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="agent-input-row">
          <textarea
            className="agent-textarea"
            placeholder={`Ask about ${globalParams.ticker} financials, news, or trends...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputText);
              }
            }}
            disabled={isThinking}
          />
          <button
            className="agent-send-btn"
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isThinking}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
