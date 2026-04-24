import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Sparkles, 
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const Pricing = () => {
  const chartData = [
    { name: 'Mon', occupancy: 65, revenue: 14500 },
    { name: 'Tue', occupancy: 70, revenue: 15200 },
    { name: 'Wed', occupancy: 68, revenue: 14800 },
    { name: 'Thu', occupancy: 85, revenue: 19500 },
    { name: 'Fri', occupancy: 95, revenue: 24800 },
    { name: 'Sat', occupancy: 98, revenue: 26500 },
    { name: 'Sun', occupancy: 88, revenue: 21200 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-subtle p-4 rounded-xl shadow-xl backdrop-blur-md">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm text-muted">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.name === 'Revenue' ? `₹${entry.value.toLocaleString()}` : `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const pricingSuggestions = [
    {
      roomType: 'Temple View Suite',
      current: 28000,
      suggested: 34500,
      change: '+23.2%',
      reason: 'Hampi Utsav (Nov 3-5) - Regional demand spike for heritage sites.',
      confidence: 96,
      trend: 'up'
    },
    {
      roomType: 'Executive Estate Villa',
      current: 82000,
      suggested: 72500,
      change: '-11.6%',
      reason: 'Heavy Monsoon in Coorg. Competitors reducing rates by 15%.',
      confidence: 89,
      trend: 'down'
    },
    {
      roomType: 'Heritage Superior',
      current: 15000,
      suggested: 15000,
      change: '0%',
      reason: 'Optimal occupancy reached for business segment in Bangalore/Hyd.',
      confidence: 98,
      trend: 'stable'
    }
  ];

  const rateColumns = [
    { header: 'Room Category', key: 'roomType', render: (val) => <span className="cell-main">{val}</span> },
    { header: 'Current Rate', key: 'current', render: (val) => <span className="text-muted">₹{val.toLocaleString()}</span> },
    { 
      header: 'AI Suggested', 
      key: 'suggested', 
      render: (val, item) => (
        <span className={`font-bold ${item.trend === 'up' ? 'text-success' : item.trend === 'down' ? 'text-danger' : 'text-primary'}`}>
          ₹{val.toLocaleString()}
        </span>
      ) 
    },
    { 
      header: 'Change', 
      key: 'change',
      render: (val, item) => (
        <div className="flex items-center gap-2">
          {item.trend === 'up' ? <TrendingUp size={16} className="text-success" /> : item.trend === 'down' ? <TrendingDown size={16} className="text-danger" /> : null}
          <span className={item.trend === 'up' ? 'text-success' : item.trend === 'down' ? 'text-danger' : 'text-muted'}>
            {val}
          </span>
        </div>
      )
    },
    {
      header: 'Confidence',
      key: 'confidence',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-overlay rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${val}%` }}></div>
          </div>
          <span className="text-xs text-muted">{val}%</span>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-extrabold text-5xl tracking-tight mb-2">AI Pricing Engine</h1>
          <p className="text-muted text-lg">Dynamic rate optimization based on real-time market demand and competitor analysis.</p>
        </div>
        <div className="flex gap-4">
          <Badge status="ai" className="px-4 py-2 text-sm">
            <Zap size={14} className="mr-2" /> Live Market Tracking
          </Badge>
        </div>
      </div>

      {/* 📈 MARKET TRENDS & REVENUE CHART */}
      <Card variant="glass" className="p-8 mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Activity className="text-accent" size={24} /> 
              Occupancy vs. Revenue
            </h2>
            <p className="text-muted text-sm">7-Day trailing performance & optimization opportunities.</p>
          </div>
          <div className="flex items-center gap-4 bg-overlay px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-sm font-medium">Occupancy</span>
            </div>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 400 }} className="mt-4">
          <ResponsiveContainer width="99%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                tickFormatter={(value) => `₹${value/1000}k`}
                dx={-10}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                tickFormatter={(value) => `${value}%`}
                dx={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="left" 
                dataKey="revenue" 
                name="Revenue" 
                fill="var(--accent)" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="occupancy" 
                name="Occupancy" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: 'var(--surface)' }} 
                activeDot={{ r: 8 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-accent" size={24} /> 
          AI Rate Suggestions
        </h2>
        <Button variant="ghost" className="text-sm">View Algorithm Details</Button>
      </div>

      {/* 🚀 AI INSIGHT CARDS */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {pricingSuggestions.map((suggestion, i) => (
          <Card key={i} variant="glass" className="p-8 border-l-4" style={{ 
            borderLeftColor: suggestion.trend === 'up' ? '#10b981' : suggestion.trend === 'down' ? '#ef4444' : 'var(--action-accent)' 
          }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-overlay rounded-xl">
                <Sparkles size={20} className="text-accent" />
              </div>
              <Badge status={suggestion.trend === 'up' ? 'success' : suggestion.trend === 'down' ? 'danger' : 'ai'}>
                {suggestion.change}
              </Badge>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{suggestion.roomType}</h3>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl text-muted line-through">₹{suggestion.current.toLocaleString()}</span>
              <ArrowRight size={20} className="text-muted" />
              <span className="text-4xl font-extrabold text-primary">₹{suggestion.suggested.toLocaleString()}</span>
            </div>

            <p className="text-muted text-sm leading-relaxed mb-6">
              {suggestion.reason}
            </p>

            <Button variant="accent" className="w-full">Apply Rate</Button>
          </Card>
        ))}
      </div>

      {/* 📊 DETAILED RATE LEDGER */}
      <Card variant="solid" className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Rate Ledger</h2>
          <div className="flex gap-4">
            <Button variant="ghost" className="border border-subtle">History</Button>
            <Button variant="primary">Bulk Update</Button>
          </div>
        </div>
        <Table columns={rateColumns} data={pricingSuggestions} />
      </Card>
    </DashboardLayout>
  );
};

export default Pricing;
