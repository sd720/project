import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch leads', err);
        setLoading(false);
      });
  }, []);

  const maskMobile = (mobile) => {
    if (!mobile || mobile.length !== 10) return mobile;
    return `${mobile.substring(0, 4)}XXXX${mobile.substring(8)}`;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loader" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Admin Dashboard</h2>
        <span className="text-muted">Total Leads: {leads.length}</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Net Weight</th>
              <th>Plan</th>
              <th>Max Loan Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted" style={{ padding: '2rem' }}>
                  No applications found.
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id}>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '500' }}>{lead.customerName}</td>
                  <td style={{ fontFamily: 'monospace' }}>{maskMobile(lead.mobileNumber)}</td>
                  <td>{lead.netWeightGrams} g</td>
                  <td>
                    <span style={{ 
                      background: 'rgba(212, 175, 55, 0.1)', 
                      color: 'var(--primary)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {lead.selectedPlanId === 'PLAN_BULLET_01' ? 'Bullet' : 'EMI'}
                    </span>
                  </td>
                  <td className="text-primary" style={{ fontWeight: '600' }}>
                    {formatCurrency(lead.calculatedMaxLoanAmount)}
                  </td>
                  <td>
                    <span style={{ 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: 'var(--success)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
