"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [poems, setPoems] = useState([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // Simulate fetching AI-generated poems
    const generatedPoems = [
      {
        title: "Whispers of the Wind",
        content: `The wind whispers secrets through the trees,
A melody carried over distant seas.
Leaves dance to the rhythm of the air,
A symphony played everywhere.`,
      },
      {
        title: "Sunrise Serenity",
        content: `Golden hues paint the morning sky,
Chasing away the night's dark sigh.
Birds awaken with a joyful song,
Embracing a day where hearts belong.`,
      },
      {
        title: "Echoes of Time",
        content: `Footprints fade on the sands of time,
Yet memories linger, sweet and sublime.
Echoes of laughter, shadows of tears,
Weaving the tapestry of bygone years.`,
      },
      {
        title: "Moonlit Dreams",
        content: `Under the moon's soft, silvery light,
Dreams take flight in the still of night.
Stars wink secrets from realms afar,
Guiding wishes upon a falling star.`,
      },
    ];

    // Simulate an API call delay
    setTimeout(() => {
      setPoems(generatedPoems);
    }, 1000);
  }, []);

  // Typing effect logic for displaying words one by one
  useEffect(() => {
    if (poems.length === 0 || currentPoemIndex >= poems.length) return;

    const currentPoem = poems[currentPoemIndex];
    const words = currentPoem.content.split(/(\s+|\n)/);

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[wordIndex]]);
        setWordIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayedWords([]);
          setWordIndex(0);
          setCurrentPoemIndex((prev) => (prev + 1) % poems.length);
        }, 3000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [poems, currentPoemIndex, wordIndex]);

  // Function to add gradient effect to random words in the poem
  const getGradientWords = (text) => {
    const words = text.replace(/[.,!?]/g, "").split(/\s+/);
    const numGradientWords = Math.max(1, Math.floor(words.length / 6));
    const gradientWordsSet = new Set();
    while (gradientWordsSet.size < numGradientWords) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      if (randomWord.length > 3) gradientWordsSet.add(randomWord);
    }
    return Array.from(gradientWordsSet);
  };

  const currentPoem = poems[currentPoemIndex];
  const gradientWords = currentPoem ? getGradientWords(currentPoem.content) : [];

  return (
    <div className="auth-background flex items-center justify-center h-screen">
      {poems.length === 0 ? (
        <p className="text-gray-500 text-center">Loading poems...</p>
      ) : (
        <div className="text-center max-w-2xl mx-auto px-6 space-y-8">
          {/* Introduction Message */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
            Welcome to Collabiy
          </h1>
          <p className="text-lg text-gray-600 mb-6 font-roboto">
            Collaborate in real-time and generate inspiring documents together!
          </p>

          {/* Poem Display */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentPoem?.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {displayedWords.map((word, index) => {
                const cleanWord = word.replace(/[.,!?]/g, "");
                const isGradient = gradientWords.includes(cleanWord);
                return (
                  <span
                    key={index}
                    className={
                      isGradient
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
                        : ""
                    }
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-colors">
              Sign Up
            </Link>
            <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold border border-blue-600 hover:bg-gray-100 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
