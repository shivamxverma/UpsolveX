"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/app/store/theme";
import Navbar from "@/components/Navbar";

// Type Definitions
interface Contest {
  creator: string;
  problemLinks: string[];
  duration: number;
  endTime: number;
}

interface Submission {
  userId: string;
  problemIndex: number;
  status: "accepted" | "wrong" | "pending";
  code: string;
}

interface LeaderboardEntry {
  userId: string;
  solved: number;
  score: number; // Could be time-based or points
}

export default function ContestPage({ params }: { params: { contestId: string } }) {
  const { theme } = useThemeStore();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [contest, setContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number>(0);
  const [code, setCode] = useState<string>("");

  // WebSocket Setup
  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8080/contest/${params.contestId}?userId=user1`);

    websocket.onopen = () => {
      console.log("Connected to contest WebSocket");
      websocket.send(JSON.stringify({ type: "get_contest" }));
    };

    websocket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "contest_data":
          setContest(data.contest);
          break;
        case "submission_result":
          setSubmissions(prev => [...prev.filter(s => !(s.userId === data.userId && s.problemIndex === data.problemIndex)), data]);
          break;
        case "leaderboard_update":
          setLeaderboard(data.leaderboard);
          break;
      }
    };

    websocket.onerror = (error) => console.error("WebSocket error:", error);
    websocket.onclose = () => console.log("WebSocket closed");
    setWs(websocket);

    return () => websocket.close();
  }, [params.contestId]);

  // Handle code submission
  const handleSubmitCode = () => {
    if (ws && ws.readyState === WebSocket.OPEN && contest && code.trim()) {
      ws.send(
        JSON.stringify({
          type: "submit_code",
          problemIndex: selectedProblemIndex,
          code,
        })
      );
      setCode(""); // Clear code after submission (optional)
    }
  };

  if (!contest) return <div className="text-center py-20">Loading contest...</div>;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-900"
      }`}
    >
      <Navbar className="fixed top-0 left-0 right-0 z-50 shadow-lg" />
      <main className="pt-24 pb-12 px-4 md:px-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Half: Question Display and List */}
        <div className="lg:w-1/2 space-y-6">
          {/* Question List */}
          <div className={`rounded-2xl shadow-xl p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
              Contest Questions
            </h2>
            <ul className="space-y-3">
              {contest.problemLinks.map((link, index) => {
                const status = submissions.find(s => s.userId === "user1" && s.problemIndex === index)?.status;
                return (
                  <li
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedProblemIndex === index
                        ? theme === "dark"
                          ? "bg-indigo-700"
                          : "bg-indigo-100"
                        : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    } ${
                      status === "accepted"
                        ? "border-l-4 border-green-500"
                        : status === "wrong"
                        ? "border-l-4 border-red-500"
                        : "border-l-4 border-transparent"
                    }`}
                    onClick={() => setSelectedProblemIndex(index)}
                  >
                    <span className="font-medium">Problem {index + 1}</span>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-sm truncate ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"} hover:underline`}
                      onClick={e => e.stopPropagation()} // Prevent link click from changing selection
                    >
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Selected Question */}
          <div className={`rounded-2xl shadow-xl p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
              Problem {selectedProblemIndex + 1}
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              View the problem statement on the original platform:
            </p>
            <a
              href={contest.problemLinks[selectedProblemIndex]}
              target="_blank"
              rel="noopener noreferrer"
              className={`block mt-2 text-lg underline truncate ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
            >
              {contest.problemLinks[selectedProblemIndex]}
            </a>
          </div>
        </div>

        {/* Right Half: Coding Environment and Leaderboard */}
        <div className="lg:w-1/2 space-y-6">
          {/* Coding Environment */}
          <div className={`rounded-2xl shadow-xl p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
              Code Your Solution
            </h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono text-sm resize-none ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Write your code here..."
            />
            <button
              onClick={handleSubmitCode}
              className={`mt-4 w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              }`}
            >
              Submit Code
            </button>
          </div>

          {/* Leaderboard */}
          <div className={`rounded-2xl shadow-xl p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
              Leaderboard
            </h2>
            {leaderboard.length > 0 ? (
              <ul className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {index + 1}. {entry.userId}
                    </span>
                    <span className={theme === "dark" ? "text-green-400" : "text-green-600"}>
                      {entry.solved} Solved ({entry.score} pts)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No rankings yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}