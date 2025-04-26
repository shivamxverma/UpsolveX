'use client'
import { useState, useEffect } from 'react';
import { WebSocketMessage, ContestHistory } from '../../services/types';

interface ContestListProps {
  ws: WebSocket | null;
}

interface CurrentContest {
  creator: string;
  submissionDeadline?: number;
  votingDeadline?: number;
  submissions: { userId: string; submission: string }[];
  status?: 'submission' | 'voting';
}

export default function ContestList({ ws }: ContestListProps) {
  const [contests, setContests] = useState<ContestHistory[]>([]);
  const [currentContest, setCurrentContest] = useState<CurrentContest | null>(null);
  const [submission, setSubmission] = useState<string>('');

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event: MessageEvent) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        switch (data.type) {
          case 'contest_started':
            setCurrentContest({ creator: data.creator!, submissionDeadline: data.submissionDeadline, submissions: [] });
            break;
          case 'submission_received':
            setSubmission('');
            break;
          case 'voting_started':
            setCurrentContest(prev => prev ? { ...prev, ...data, status: 'voting' } : null);
            break;
          case 'contest_ended':
            if (currentContest) {
              setContests(prev => [...prev, { ...currentContest, results: data.results || [], endedAt: Date.now(), totalParticipants: currentContest.submissions.length }]);
              setCurrentContest(null);
            }
            break;
          case 'contest_history':
            setContests(data.history || []);
            break;
        }
      };
      ws.send(JSON.stringify({ type: 'get_history' }));
    }
  }, [ws]);

  const handleSubmit = () => {
    if (ws && currentContest && submission) {
      ws.send(JSON.stringify({ type: 'submit_contest', submission }));
    }
  };

  const handleVote = (userId: string, score: number) => {
    if (ws && currentContest) {
      ws.send(JSON.stringify({ type: 'vote', targetUserId: userId, score }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {currentContest && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Current Contest</h2>
          <p>Status: {currentContest.status || 'submission'}</p>
          <p>Deadline: {new Date(currentContest[currentContest.status === 'voting' ? 'votingDeadline' : 'submissionDeadline']!).toLocaleString()}</p>
          
          {currentContest.status !== 'voting' ? (
            <div className="mt-4">
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your submission"
              />
              <button
                onClick={handleSubmit}
                className="mt-2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="mt-4">
              {currentContest.submissions.map(({ userId, submission }) => (
                <div key={userId} className="mb-4 p-4 bg-gray-100 rounded-md">
                  <p>{submission}</p>
                  <div className="mt-2">
                    {[1, 5, 10].map(score => (
                      <button
                        key={score}
                        onClick={() => handleVote(userId, score)}
                        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Contest History</h2>
      {contests.map((contest, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg mb-4">
          <p>Ended: {new Date(contest.endedAt).toLocaleString()}</p>
          <p>Creator: {contest.creator}</p>
          <p>Participants: {contest.totalParticipants}</p>
          <h3 className="font-semibold mt-2">Top 3:</h3>
          {contest.results.map((result, i) => (
            <div key={i} className="mt-2">
              <p>{i + 1}. {result.userId} - Score: {result.score}</p>
              <p className="text-gray-600">{result.submission}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}