'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface Log {
  id: number;
  endpoint: string;
  message: string;
  status_code: number;
  method: string;
  created_at: string;
}

export default function MonitoringPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching logs:', error.message);
        setLoading(false);
        return;
      }

      setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const chartData = Object.values(
    logs.reduce((acc, log) => {
      const code = log.status_code;
      if (!acc[code]) acc[code] = { status_code: code, count: 0 };
      acc[code].count += 1;
      return acc;
    }, {} as Record<number, { status_code: number; count: number }>)
  );

  const totalLogs = logs.length;
  const errorLogs = logs.filter((log) => log.status_code >= 400).length;

  const getChartColor = () => {
    if (errorLogs === 0) return '#34d399';
    if (errorLogs === totalLogs) return '#f87171';
    return '#fbbf24'; 
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📊 API Monitoring Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">⏳ Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">😴 No logs found.</p>
      ) : (
        <>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status_code" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={getChartColor()} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className={`p-4 rounded shadow-sm border-l-4 ${
                  log.status_code >= 400
                    ? 'border-red-500 bg-red-100'
                    : 'border-green-500 bg-green-100'
                }`}
              >
                <p><strong>🛠 Endpoint:</strong> {log.endpoint}</p>
                <p><strong>📶 Status:</strong> {log.status_code}</p>
                <p><strong>📩 Message:</strong> {log.message}</p>
                <p><strong>🧭 Method:</strong> {log.method}</p>
                <p><strong>🕒 Time:</strong> {new Date(log.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
