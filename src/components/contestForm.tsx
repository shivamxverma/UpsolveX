'use client'
import { useState, FormEvent } from 'react';

interface ContestFormProps {
  ws: WebSocket | null;
}

export default function ContestForm({ ws }: ContestFormProps) {
  const [title, setTitle] = useState<string>('');
  const [submissionTime, setSubmissionTime] = useState<number>(5);
  const [votingTime, setVotingTime] = useState<number>(5);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'start_contest',
        duration: submissionTime * 60 * 1000,
        votingDuration: votingTime * 60 * 1000,
      }));
      setTitle('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Contest</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Contest Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contest title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Submission Time (minutes)</label>
          <input
            type="number"
            value={submissionTime}
            onChange={(e) => setSubmissionTime(Math.min(parseInt(e.target.value), 60))}
            min="1"
            max="60"
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Voting Time (minutes)</label>
          <input
            type="number"
            value={votingTime}
            onChange={(e) => setVotingTime(Math.min(parseInt(e.target.value), 30))}
            min="1"
            max="30"
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Start Contest
        </button>
      </form>
    </div>
  );
}