import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Printer,
  Calendar,
} from 'lucide-react';

const ReportsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);

  const generateReport = useCallback(async () => {
    try {
      const [yearStr, monthStr] = selectedMonth.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;

      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

      const [activitiesRes, goalsRes] = await Promise.all([
        apiClient(`/api/activities?startDate=${startDate}&endDate=${endDate}&limit=500`),
        apiClient('/api/goals'),
      ]);

      const activities = activitiesRes.data || [];
      const totalEmissions = activities.reduce((sum, a) => sum + (a.carbonFootprint || 0), 0);
      const roundedTotal = Math.round(totalEmissions * 100) / 100;

      // Unique days
      const days = new Set(activities.map((a) => new Date(a.date).toISOString().slice(0, 10)));
      const activeDays = Math.max(1, days.size);
      const dailyAverage = Math.round((roundedTotal / activeDays) * 100) / 100;

      // Category breakdown
      const breakdown = {
        Transportation: 0,
        Electricity: 0,
        Cooking: 0,
        Food: 0,
        Shopping: 0,
      };

      // Preserved emission factors for breakdown
      const emissionFactors = {
        transport: { None: 0, Car: 0.21, Bus: 0.09, Train: 0.04, Bike: 0, Motorcycle: 0.11, 'Electric Car': 0.05 },
        electricity: 0.5,
        cooking: { None: 0, Gas: 2.0, Electric: 1.2, Induction: 0.4 },
        food: { None: 0, Beef: 3.3, Chicken: 1.4, Vegetarian: 0.8, Vegan: 0.5, Fish: 1.8, Pork: 2.0 },
        shopping: { None: 0, Clothes: 15.0, Electronics: 50.0, Furniture: 80.0, Plastic: 2.0, Groceries: 5.0 },
      };

      activities.forEach((act) => {
        breakdown.Transportation += (act.transportUnitKm || 0) * (emissionFactors.transport[act.transportType] || 0);
        breakdown.Electricity += (act.electricityUnitKwh || 0) * emissionFactors.electricity;
        breakdown.Cooking += emissionFactors.cooking[act.cookingType] || 0;
        breakdown.Food += emissionFactors.food[act.foodType] || 0;
        breakdown.Shopping += emissionFactors.shopping[act.shopping] || 0;
      });

      Object.keys(breakdown).forEach((k) => {
        breakdown[k] = Math.round(breakdown[k] * 100) / 100;
      });

      // Find monthly goal if set
      const matchingGoal = goalsRes.data?.find((g) => g.monthYear === selectedMonth);

      setReportData({
        monthYear: selectedMonth,
        activitiesCount: activities.length,
        totalEmissions: roundedTotal,
        dailyAverage,
        breakdown,
        goal: matchingGoal || null,
        activities,
      });
    } catch (err) {
      console.error('Error generating report:', err);
      showToast('Error generating monthly report', 'error');
    }
  }, [selectedMonth, showToast]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Control bar - Hidden on print */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar size={18} style={{ color: '#059669' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
            Select Month:
          </span>
          <input
            type="month"
            className="form-control"
            style={{ width: 'auto' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <button
          onClick={handlePrint}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Printer size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Report Document */}
      <div
        className="card"
        id="printable-report"
        style={{
          padding: 40,
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        {/* Report Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingBottom: 24,
            borderBottom: '2px solid #e2e8f0',
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', marginBottom: 4 }}>
              <FileText size={22} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>EcoTrack Carbon Audit Report</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Monthly Environmental Sustainability Assessment
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* User Details Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            padding: 16,
            backgroundColor: '#f8fafc',
            borderRadius: 10,
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
              Account Holder
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {user?.name || 'Verified User'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
              Email
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
              {user?.email}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
              Location
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
              {user?.location || 'Unspecified'}
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
              Total Emissions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
              {reportData?.totalEmissions || 0}{' '}
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>kg CO₂</span>
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
              Daily Average
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {reportData?.dailyAverage || 0}{' '}
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>kg/day</span>
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
              Activities Logged
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {reportData?.activitiesCount || 0}
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
              Goal Compliance
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: reportData?.goal?.status === 'Exceeded' ? '#e11d48' : '#059669' }}>
              {reportData?.goal ? reportData.goal.status : 'No Target Set'}
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
          Category-Wise Emission Inventory
        </h3>
        <table className="modern-table" style={{ marginBottom: 32 }}>
          <thead>
            <tr>
              <th>Sector</th>
              <th>Emissions (kg CO₂)</th>
              <th>Share of Monthly Footprint</th>
              <th>Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.breakdown &&
              Object.entries(reportData.breakdown).map(([category, val]) => {
                const total = reportData.totalEmissions;
                const percentage = total > 0 ? Math.round((val / total) * 100) : 0;
                return (
                  <tr key={category}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{category}</td>
                    <td>{val} kg</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 999, maxWidth: 100 }}>
                          <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: '#059669', borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${percentage > 35 ? 'badge-red' : percentage > 20 ? 'badge-orange' : 'badge-green'}`}>
                        {percentage > 35 ? 'Critical' : percentage > 20 ? 'Moderate' : 'Low Impact'}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Monthly Footprint Notes */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
          <p>
            <strong>Methodology Note:</strong> Calculations follow standard IPCC emission factors adapted for personal carbon accounting. Transportation calculations apply fuel averages per passenger-kilometer; residential electricity uses a standard 0.50 kg CO₂/kWh grid average.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
