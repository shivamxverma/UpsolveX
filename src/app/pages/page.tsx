'use client';
import { useEffect, useState, FormEvent, createContext, useContext } from 'react';
// import '../styles/globals.css'; // Ensure Tailwind is set up

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Type Definitions
interface WebSocketMessage {
  type: string;
  message?: string;
  userId?: string;
  members?: number;
  isAdmin?: boolean;
  creator?: string;
  submissionDeadline?: number;
  votingDeadline?: number;
  submissions?: { userId: string; submission: string }[];
  results?: { userId: string; submission: string; score: number; votesReceived: number }[];
  history?: ContestHistory[];
  targetUserId?: string;
  score?: number;
  by?: string;
  payload?: any;
}

interface ContestHistory {
  endedAt: number;
  creator: string;
  results: { userId: string; submission: string; score: number; votesReceived: number }[];
  totalParticipants: number;
}

interface Member {
  userId: string;
  isAdmin: boolean;
}

interface CurrentContest {
  creator: string;
  submissionDeadline?: number;
  votingDeadline?: number;
  submissions: { userId: string; submission: string }[];
  status?: 'submission' | 'voting';
}

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentContest, setCurrentContest] = useState<CurrentContest | null>(null);
  const [contests, setContests] = useState<ContestHistory[]>([]);
  const [submission, setSubmission] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [submissionTime, setSubmissionTime] = useState<number>(5);
  const [votingTime, setVotingTime] = useState<number>(5);
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // WebSocket Setup
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/?code=YOUR_JOIN_CODE&userId=user1');
    
    websocket.onopen = () => console.log('Connected to WebSocket');
    
    websocket.onmessage = (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case 'welcome':
          setMembers(prev => [...prev, { userId: data.message!.split(' ')[1], isAdmin: !!data.isAdmin }]);
          setIsAdmin(!!data.isAdmin);
          break;
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
        case 'admin_promoted':
        case 'user_kicked':
        case 'user_banned':
          setMembers(prev => prev.map(m => 
            m.userId === data.userId 
              ? { ...m, isAdmin: data.type === 'admin_promoted' }
              : m
          ).filter(m => !['user_kicked', 'user_banned'].includes(data.type) || m.userId !== data.userId));
          break;
        case 'chat':
          setChatMessages(prev => [...prev, `${data.userId}: ${data.message}`]);
          break;
      }
    };
    
    websocket.onerror = (error) => console.error('WebSocket error:', error);
    websocket.onclose = () => console.log('WebSocket closed');
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: 'get_history' }));
    };

    return () => websocket.close();
  }, []);

  // Handlers
  const handleContestSubmit = (e: FormEvent) => {
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

  const handleSubmission = () => {
    if (ws && currentContest && submission) {
      ws.send(JSON.stringify({ type: 'submit_contest', submission }));
    }
  };

  const handleVote = (userId: string, score: number) => {
    if (ws && currentContest) {
      ws.send(JSON.stringify({ type: 'vote', targetUserId: userId, score }));
    }
  };

  const handleAdminAction = (type: string, userId: string) => {
    if (ws && isAdmin) {
      ws.send(JSON.stringify({ type, targetUserId: userId }));
    }
  };

  const sendChatMessage = () => {
    if (ws && chatInput) {
      ws.send(JSON.stringify({ type: 'chat', message: chatInput }));
      setChatInput('');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold animate-fade-in-down">Contest Arena</h1>
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar: Contest Form and Group Management */}
            <div className="space-y-8">
              {/* Contest Form */}
              <div className={`rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Launch New Contest</h2>
                <form onSubmit={handleContestSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                      placeholder="e.g., Best Meme Contest"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Submission Time (min)</label>
                    <input
                      type="number"
                      value={submissionTime}
                      onChange={(e) => setSubmissionTime(Math.min(parseInt(e.target.value), 60))}
                      min="1"
                      max="60"
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Voting Time (min)</label>
                    <input
                      type="number"
                      value={votingTime}
                      onChange={(e) => setVotingTime(Math.min(parseInt(e.target.value), 30))}
                      min="1"
                      max="30"
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'}`}
                  >
                    Start Contest
                  </button>
                </form>
              </div>

              {/* Group Management */}
              <div className={`rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Group Members</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {members.map(member => (
                    <div
                      key={member.userId}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-opacity-80 transition ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {member.userId} {member.isAdmin && <span className="text-xs text-indigo-400">(Admin)</span>}
                      </span>
                      {isAdmin && !member.isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAdminAction('promote_admin', member.userId)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                          >
                            Promote
                          </button>
                          <button
                            onClick={() => handleAdminAction('kick', member.userId)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            Kick
                          </button>
                          <button
                            onClick={() => handleAdminAction('ban', member.userId)}
                            className="px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
                          >
                            Ban
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content: Current Contest and History */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Contest */}
              {currentContest && (
                <div className={`rounded-2xl shadow-xl p-6 animate-fade-in-up ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Current Contest</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Status: <span className="font-medium capitalize">{currentContest.status || 'submission'}</span></p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Deadline: <span className="font-medium">{new Date(currentContest[currentContest.status === 'voting' ? 'votingDeadline' : 'submissionDeadline']!).toLocaleString()}</span></p>
                  </div>
                  
                  {currentContest.status !== 'voting' ? (
                    <div className="space-y-4">
                      <textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Submit your entry here..."
                        rows={4}
                      />
                      <button
                        onClick={handleSubmission}
                        className={`w-full py-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'}`}
                      >
                        Submit Entry
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentContest.submissions.map(({ userId, submission }) => (
                        <div key={userId} className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <p className={theme === 'dark' ? 'text-gray-200 mb-2' : 'text-gray-800 mb-2'}>{submission}</p>
                          <div className="flex space-x-2">
                            {[1, 5, 10].map(score => (
                              <button
                                key={score}
                                onClick={() => handleVote(userId, score)}
                                className={`px-3 py-1 rounded-md hover:scale-105 transition transform ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
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

              {/* Contest History */}
              <div className={`rounded-2xl shadow-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Contest History</h2>
                <div className="space-y-6">
                  {contests.map((contest, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow-inner hover:shadow-md transition ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Ended: <span className="font-medium">{new Date(contest.endedAt).toLocaleString()}</span></p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Creator: <span className="font-medium">{contest.creator}</span></p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Participants: <span className="font-medium">{contest.totalParticipants}</span></p>
                      </div>
                      <h3 className={`text-lg font-semibold mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Top 3:</h3>
                      <div className="mt-2 space-y-2">
                        {contest.results.map((result, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span className={`font-bold text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`}>{i + 1}.</span>
                            <div>
                              <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{result.userId} - <span className="font-medium">Score: {result.score}</span></p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.submission}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:col-span-3">
              <div className={`rounded-2xl shadow-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Group Chat</h2>
                <div className={`h-80 overflow-y-auto mb-6 p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 p-3 rounded-lg max-w-xs break-words animate-fade-in ${theme === 'dark' ? 'bg-indigo-900 text-gray-100' : 'bg-indigo-100 text-gray-800'}`}
                    >
                      <p>{msg}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={sendChatMessage}
                    className={`px-6 py-3 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'}`}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-200 ${theme === 'dark' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}