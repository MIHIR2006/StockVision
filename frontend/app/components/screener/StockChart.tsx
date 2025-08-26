'use client';

import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Line 
} from 'recharts';

export function StockChart({ ticker }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/screener/history/${ticker}`);
      const result = await response.json();
      setData(result.historical.reverse());
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    setLoading(false);
  };

  if (!ticker) {
    return <div>Select a stock to view its chart.</div>;
  }

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" name={ticker} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
