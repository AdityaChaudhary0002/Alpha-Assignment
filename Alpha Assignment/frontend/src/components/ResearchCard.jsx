import React, { useState } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to assign company names
function getCompanyName(personId, personName) {
  if (personName === "DF") return "DF Company";
  const companies = [
    "Alpha Corp", "Beta Solutions", "Gamma Industries", "Delta Ventures",
    "Epsilon LLC", "Zeta Group", "Theta Technologies", "Lambda Labs",
    "Sigma Systems", "Omicron Inc."
  ];
  // If personId is a string UUID, generate index from its char codes
  let sum = 0;
  for (let i = 0; i < personId.length; i++) {
    sum += personId.charCodeAt(i);
  }
  return companies[sum % companies.length];
}

function ResearchCard({ person }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runResearch = async () => {
    setLoading(true);
    setProgress([]);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/enrich/${person.id}`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to enqueue research job');

      const socket = io(API_URL, {
        query: { companyId: person.companyId },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('🟢 Connected to WebSocket');
      });

      socket.on('progress', (msg) => {
        if (msg?.message || msg?.progress) {
          setProgress((prev) => [...prev, msg.message || `Progress: ${msg.progress}%`]);
        }
      });

      socket.on('complete', async () => {
        socket.disconnect();
        try {
          const response = await fetch(`${API_URL}/api/context-snippets/${person.companyId}`);
          const data = await response.json();
          setResult(JSON.stringify(data, null, 2));
        } catch {
          setError('Failed to fetch context snippet');
        }
        setLoading(false);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ WebSocket error', err);
        setError('WebSocket connection failed');
        setLoading(false);
      });

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-xl border border-gray-200 mb-4">
      <div className="flex flex-col items-center text-center gap-2 w-full mb-2">
        <div className="text-xl font-semibold text-gray-900">
          {person.name || "Demo Name"}
        </div>
        <div className="text-base font-medium text-blue-700">
          {getCompanyName(person.id, person.name)}
        </div>
        <div className="text-sm text-gray-500">
          {person.email || "demo@email.com"}
        </div>
      </div>

      <button
        onClick={runResearch}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? 'Researching...' : 'Research'}
      </button>

      {progress.length > 0 && (
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          {progress.map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>
      )}

      {result && (
        <pre className="mt-3 p-3 bg-gray-900 text-green-200 rounded overflow-x-auto text-xs">
          {result}
        </pre>
      )}

      {error && (
        <div className="text-red-500 mt-2 text-sm">{error}</div>
      )}
    </div>
  );
}

export default ResearchCard;
