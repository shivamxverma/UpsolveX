'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getZustandValue } from 'nes-zustand';
import { StreakCount } from '@/app/store/count';

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  topicName: string;
  difficulty?: string;
  question: string;
  options: QuestionOption[];
}

const StreakPage = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const count = getZustandValue(StreakCount);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get('/api/question');
        console.log('API Response:', response.data);
        setQuestion(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load today’s question');
        setLoading(false);
      }
    };
    fetchQuestion();
  }, []);

  const handleOptionClick = (index: number) => {
    if (selectedOption === null) { 
      setSelectedOption(index);
    }
  };

  return (
    <div className="p-5">
      <h1 className="mt-16 font-bold text-2xl py-2">Today’s Question</h1>
      <p>Streak Count: {count}</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {question && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{question.question}</h2>
          <p className="text-sm text-gray-500">
            Topic: {question.topicName}
            {question.difficulty ? ` | Difficulty: ${question.difficulty}` : ''}
          </p>
          <ul className="mt-2 space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = option.isCorrect;
              let bgColor = '';
              if (isSelected) {
                bgColor = isCorrect ? 'bg-green-100' : 'bg-red-100'; 
              }

              return (
                <li
                  key={index}
                  className={`p-2 border rounded ${bgColor} ${isSelected ? 'font-semibold' : ''}`}
                >
                  <button
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null} 
                    className="w-full text-left"
                  >
                    {option.text}
                  </button>
                </li>
              );
            })}
          </ul>
          {selectedOption !== null && (
            <p className="mt-2">
              {question.options[selectedOption].isCorrect
                ? 'Correct! Well done!'
                : 'Wrong answer. Try again tomorrow!'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakPage;