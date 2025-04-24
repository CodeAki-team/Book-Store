'use client';

import { useEffect, useState } from 'react';

export default function MonitoringPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('https://YOUR_PROJECT_ID.supabase.co/rest/v1/logs?order=created_at.desc', {
        headers: {
          apikey: 'YOUR_SUPABASE_API_KEY',
          Authorization: 'Bearer YOUR_SUPABASE_API_KEY',
        },
      });
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">API Error Logs</h1>
      <ul className="space-y-2">
        {logs.map((log: any) => (
          <li key={log.id} className="bg-red-100 p-4 rounded text-sm">
            <p><strong>Endpoint:</strong> {log.endpoint}</p>
            <p><strong>Error:</strong> {log.message}</p>
            <p><strong>Time:</strong> {new Date(log.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
