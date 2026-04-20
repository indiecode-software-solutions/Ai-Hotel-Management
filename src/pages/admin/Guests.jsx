import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { Search, UserPlus } from 'lucide-react';

export const Guests = () => {
  const columns = [
    {
      header: 'Guest Details',
      key: 'name',
      render: (val, item) => (
        <div className="flex items-center">
          <div className="cell-avatar">{val.charAt(0)}</div>
          <div>
            <div className="cell-main">{val}</div>
            <span className="cell-sub">{item.location}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Stay History',
      key: 'stays',
      render: (val) => <span className="font-semibold text-primary">{val} Visits</span>
    },
    {
      header: 'Tier',
      key: 'tier',
      render: (val) => {
        const statusMap = {
          'Diamond': 'ai',
          'Gold': 'warning',
          'Silver': 'primary',
          'Standard': 'default'
        };
        return <Badge status={statusMap[val] || 'default'}>{val}</Badge>;
      }
    },
    { header: 'Last Stay', key: 'lastStay' },
    {
      header: 'Total Spend',
      key: 'spend',
      render: (val) => <span className="font-bold text-accent">${val}</span>
    }
  ];

  const guestsData = [
    { name: 'Alexander Wright', location: 'London, UK', stays: 12, tier: 'Diamond', lastStay: 'Oct 12, 2023', spend: '14,250' },
    { name: 'Elena Rodriguez', location: 'Madrid, ES', stays: 4, tier: 'Gold', lastStay: 'Oct 13, 2023', spend: '3,450' },
    { name: 'Marcus Chen', location: 'Singapore, SG', stays: 28, tier: 'Diamond', lastStay: 'Oct 14, 2023', spend: '42,800' },
    { name: 'Sophia Laurent', location: 'Paris, FR', stays: 1, tier: 'Standard', lastStay: 'Oct 15, 2023', spend: '5,500' },
    { name: 'Julian Barnes', location: 'New York, US', stays: 6, tier: 'Silver', lastStay: 'Aug 22, 2023', spend: '2,200' },
    { name: 'Isabella Rossi', location: 'Milan, IT', stays: 15, tier: 'Diamond', lastStay: 'Sep 30, 2023', spend: '18,700' },
    { name: 'Liam Wilson', location: 'Sydney, AU', stays: 3, tier: 'Silver', lastStay: 'Jul 15, 2023', spend: '1,850' },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-extrabold text-5xl tracking-tight mb-2">Guest Directory</h1>
          <p className="text-muted text-lg">Maintain detailed profiles and loyalty records for your clientele.</p>
        </div>
        <Button variant="primary">
          <UserPlus size={18} className="mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
          <Input placeholder="Search by name, email, or location..." className="pl-12" />
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="border border-subtle">All Tiers</Button>
          <Button variant="ghost" className="border border-subtle">VIP Only</Button>
        </div>
      </div>

      <Table columns={columns} data={guestsData} />
    </DashboardLayout>
  );
};

export default Guests;
