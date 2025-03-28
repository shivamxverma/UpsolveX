"use client";
import Navbar from "@/components/Navbar";
import Course from "@/components/course";
import About from "@/components/About";
import Testimonials from "@/components/Testinomials";
import Link from "next/link";
import { RecoilRoot } from "recoil";
import { useThemeStore } from "@/app/store/theme";
import { useEffect, useState, FormEvent } from "react";

// Type Definitions for Coding Contests
interface WebSocketMessage {
  type: string;
  message?: string;
  userId?: string;
  creator?: string;
  problemLinks?: string[];
  duration?: number;
  history?: ContestHistory[];
  payload?: any;
}

interface ContestHistory {
  endedAt: number;
  creator: string;
  problemLinks: string[];
  duration: number;
  totalParticipants: number;
}

interface CurrentContest {
  creator: string;
  problemLinks: string[];
  duration: number;
  endTime?: number;
}

export default function Home() {
  const { theme } = useThemeStore();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentContest, setCurrentContest] = useState<CurrentContest | null>(null);
  const [contests, setContests] = useState<ContestHistory[]>([]);
  const [contestTitle, setContestTitle] = useState<string>("");
  const [problemLinks, setProblemLinks] = useState<string[]>([""]); // Array for multiple links
  const [contestTime, setContestTime] = useState<number>(60); // Default to 60 minutes
  const [showContestForm, setShowContestForm] = useState<boolean>(false);

  // WebSocket Setup for Contests
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8080/?code=YOUR_JOIN_CODE&userId=user1");

    websocket.onopen = () => console.log("Connected to WebSocket");

    websocket.onmessage = (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case "contest_started":
          setCurrentContest({
            creator: data.creator!,
            problemLinks: data.problemLinks!,
            duration: data.duration!,
            endTime: Date.now() + data.duration!,
          });
          setShowContestForm(false);
          break;
        case "contest_ended":
          if (currentContest) {
            setContests(prev => [
              ...prev,
              { ...currentContest, endedAt: Date.now(), totalParticipants: 1 }, // Adjust participants as needed
            ]);
            setCurrentContest(null);
          }
          break;
        case "contest_history":
          setContests(data.history || []);
          break;
      }
    };

    // websocket.onerror = (error) => console.error("WebSocket error:", error);
    // websocket.onclose = () => console.log("WebSocket closed");
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "get_history" }));
    };

    return () => websocket.close();
  }, []);

  // Handle adding a new problem link input
  const addProblemLink = () => {
    setProblemLinks([...problemLinks, ""]);
  };

  // Handle removing a problem link
  const removeProblemLink = (index: number) => {
    setProblemLinks(problemLinks.filter((_, i) => i !== index));
  };

  // Handle updating a problem link
  const updateProblemLink = (index: number, value: string) => {
    const updatedLinks = [...problemLinks];
    updatedLinks[index] = value;
    setProblemLinks(updatedLinks);
  };

  // Contest Creation Handler
  const handleContestSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validLinks = problemLinks.filter(link => link.trim() !== ""); // Filter out empty links
    if (ws && ws.readyState === WebSocket.OPEN && validLinks.length > 0) {
      ws.send(
        JSON.stringify({
          type: "start_contest",
          problemLinks: validLinks,
          duration: contestTime * 60 * 1000, // Convert minutes to milliseconds
        })
      );
      setContestTitle("");
      setProblemLinks([""]); // Reset to one empty input
      setContestTime(60);
    }
  };

  return (
    <RecoilRoot>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-900"
        }`}
      >
        <Navbar className="fixed top-0 left-0 right-0 z-50 shadow-lg" />

        <main className="pt-24 pb-12 px-4 md:px-8">
          {/* Animated Header */}
          <header className="py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse-slow"></div>
            <h1
              className={`text-5xl md:text-7xl font-extrabold animate-text-reveal ${
                theme === "dark" ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400" : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
            >
              Code & Conquer
            </h1>
            <p className={`text-lg md:text-2xl mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} animate-fade-in-delay`}>
              Learn, Compete, and Excel in Coding!
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/create-course">
                <button
                  className={`flex items-center gap-2 px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 text-xl font-semibold ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  <span className="text-2xl">+</span> Create Course
                </button>
              </Link>
              <button
                onClick={() => setShowContestForm(true)}
                className={`flex items-center gap-2 px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 text-xl font-semibold ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                  }`}
                >
                  <span className="text-2xl">+</span> Create Contest
                </button>
            </div>
          </header>

          {/* Contest Creation Modal */}
          {showContestForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className={`rounded-2xl p-6 max-w-lg w-full transform animate-fade-in-up ${
                  theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
              >
                <h2 className={`text-2xl font-semibold mb-6 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>Create Coding Contest</h2>
                <form onSubmit={handleContestSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Contest Title</label>
                    <input
                      type="text"
                      value={contestTitle}
                      onChange={(e) => setContestTitle(e.target.value)}
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="e.g., Codeforces Sprint"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Problem Links (e.g., Codeforces)</label>
                    {problemLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateProblemLink(index, e.target.value)}
                          className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                            theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder={`Problem ${index + 1} URL`}
                          required={index === 0} // First link is required
                        />
                        {problemLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProblemLink(index)}
                            className={`px-2 py-1 text-sm rounded-md ${
                              theme === "dark" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProblemLink}
                      className={`mt-2 text-sm underline ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                    >
                      + Add Another Problem
                    </button>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Duration (minutes)</label>
                    <input
                      type="number"
                      value={contestTime}
                      onChange={(e) => setContestTime(Math.max(1, Math.min(parseInt(e.target.value), 180)))}
                      min="1"
                      max="180" // Max 3 hours
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                          : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                      }`}
                    >
                      Start Contest
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContestForm(false)}
                      className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                        theme === "dark" ? "bg-gray-600 hover:bg-gray-700 text-gray-100" : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Courses Section */}
          <section className="max-w-7xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} animate-fade-in`}>
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Course name="Course 1" description="Master the fundamentals" image="/course1.jpg" />
              <Course name="Course 2" description="Advanced techniques" image="/course2.jpg" />
              <Course name="Course 3" description="Practical applications" image="/course3.jpg" />
              <Course name="Course 4" description="Expert-level skills" image="/course4.jpg" />
            </div>
          </section>

          {/* Contests Section */}
          <section className="max-w-7xl mx-auto py-12">
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} animate-fade-in`}>
              Active Coding Contests
            </h2>
            {currentContest ? (
              <div className={`rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-all duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-300" : "text-indigo-500"}`}>Current Contest</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Creator: <span className="font-medium">{currentContest.creator}</span></p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Ends: <span className="font-medium">{new Date(currentContest.endTime!).toLocaleString()}</span></p>
                </div>
                <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Problem Links:</p>
                <ul className="mt-2 space-y-2">
                  {currentContest.problemLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-lg underline truncate hover:text-opacity-80 transition-colors ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        Problem {index + 1}: {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No active contest right now.</p>
            )}

            {/* Contest History */}
            <h3 className={`text-2xl font-semibold mt-12 mb-6 text-center ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} animate-fade-in`}>
              Past Contests
            </h3>
            <div className="space-y-6">
              {contests.map((contest, index) => (
                <div key={index} className={`p-4 rounded-lg shadow-inner hover:shadow-md transition ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Ended: <span className="font-medium">{new Date(contest.endedAt).toLocaleString()}</span></p>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Creator: <span className="font-medium">{contest.creator}</span></p>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Participants: <span className="font-medium">{contest.totalParticipants}</span></p>
                  </div>
                  <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Problem Links:</p>
                  <ul className="mt-2 space-y-2">
                    {contest.problemLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg underline truncate hover:text-opacity-80 transition-colors ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          Problem {index + 1}: {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials and About */}
          <section className="max-w-7xl mx-auto py-12">
            <Testimonials />
          </section>
          <section className="max-w-7xl mx-auto py-12">
            <About />
          </section>
        </main>
      </div>
    </RecoilRoot>
  );
}