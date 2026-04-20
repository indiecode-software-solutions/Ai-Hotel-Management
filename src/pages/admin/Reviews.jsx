import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Reviews = () => {
  const stats = [
    { label: 'Overall Rating', value: '4.8', sub: 'Last 30 days', icon: <Star className="text-accent" size={24} /> },
    { label: 'Positive Sentiment', value: '92%', sub: '+2.4% from last month', icon: <ThumbsUp className="text-success" size={24} /> },
    { label: 'Response Rate', value: '100%', sub: 'AI Automated Response active', icon: <MessageSquare className="text-primary" size={24} /> }
  ];

  const reviewColumns = [
    { 
      header: 'Guest', 
      key: 'guest',
      render: (val, item) => (
        <div className="flex items-center">
          <div className="cell-avatar">{val.charAt(0)}</div>
          <div>
            <div className="cell-main">{val}</div>
            <span className="cell-sub">{item.date}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Rating', 
      key: 'rating',
      render: (val) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < val ? "fill-accent text-accent" : "text-muted"} />
          ))}
        </div>
      )
    },
    { 
      header: 'Review', 
      key: 'comment',
      render: (val) => <p className="max-w-md truncate text-sm">{val}</p>
    },
    { 
      header: 'Sentiment', 
      key: 'sentiment',
      render: (val) => {
        const statusMap = { 'Positive': 'success', 'Neutral': 'warning', 'Negative': 'danger' };
        return <Badge status={statusMap[val]}>{val}</Badge>;
      }
    }
  ];

  const reviewsData = [
    { guest: 'Alexander Wright', date: '2 hours ago', rating: 5, comment: 'Incredible stay. The AI-driven check-in was seamless and the room service was lightning fast.', sentiment: 'Positive' },
    { guest: 'Elena Rodriguez', date: 'Oct 15, 2023', rating: 4, comment: 'Beautiful property. The breakfast selection was good, but the gym was a bit crowded during peak hours.', sentiment: 'Neutral' },
    { guest: 'Marcus Chen', date: 'Oct 14, 2023', rating: 5, comment: 'The best hotel experience in Singapore. The staff knows exactly what you need before you even ask.', sentiment: 'Positive' },
    { guest: 'Julian Barnes', date: 'Oct 12, 2023', rating: 2, comment: 'AC was making a loud noise all night. Front desk was polite but couldn\'t fix it immediately.', sentiment: 'Negative' },
    { guest: 'Sophia Laurent', date: 'Oct 10, 2023', rating: 5, comment: 'Pure luxury. The attention to detail is unmatched.', sentiment: 'Positive' },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-extrabold text-5xl tracking-tight mb-2">Reviews & Sentiment</h1>
          <p className="text-muted text-lg">AI-powered feedback analysis to monitor guest satisfaction and brand reputation.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="accent">Download Report</Button>
          <Button variant="primary">AI Response Settings</Button>
        </div>
      </div>

      {/* 📊 SENTIMENT OVERVIEW */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} variant="glass" className="p-8 flex items-center gap-6">
            <div className="p-4 bg-overlay rounded-2xl">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-muted text-sm font-semibold uppercase tracking-widest mb-1">{stat.label}</h3>
              <div className="text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
              <p className="text-xs text-muted font-medium">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* 🤖 AI INSIGHTS: WHAT GUESTS LOVE */}
        <Card variant="solid" className="col-span-1 p-8 border-t-4 border-success">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success bg-opacity-10 rounded-lg text-success">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-bold">Top Positives</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Seamless Check-in', score: 98 },
              { label: 'Staff Professionalism', score: 95 },
              { label: 'Room Cleanliness', score: 92 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-xs text-success">{item.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-overlay rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ⚠️ AI INSIGHTS: AREAS FOR IMPROVEMENT */}
        <Card variant="solid" className="col-span-1 p-8 border-t-4 border-danger">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-danger bg-opacity-10 rounded-lg text-danger">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-xl font-bold">Priority Fixes</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'AC Noise Level', impact: 'High' },
              { label: 'Gym Peak Hours', impact: 'Medium' },
              { label: 'Pool Temperature', impact: 'Low' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-overlay rounded-xl">
                <span className="text-sm font-medium">{item.label}</span>
                <Badge status={item.impact === 'High' ? 'danger' : item.impact === 'Medium' ? 'warning' : 'default'}>
                  {item.impact}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* 📈 SENTIMENT TREND */}
        <Card variant="glass" className="col-span-1 p-8">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent bg-opacity-10 rounded-lg text-accent">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-bold">Sentiment Trend</h3>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {[40, 65, 45, 80, 70, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-accent rounded-t-sm" style={{ height: `${h}%`, opacity: 0.3 + (i * 0.1) }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-muted uppercase tracking-widest font-bold">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </Card>
      </div>

      {/* 📜 REVIEWS TABLE */}
      <Card variant="solid" className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Guest Feedback Ledger</h2>
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Filter reviews..." 
              className="w-full bg-overlay border border-subtle rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
        <Table columns={reviewColumns} data={reviewsData} />
      </Card>
    </DashboardLayout>
  );
};

export default Reviews;
