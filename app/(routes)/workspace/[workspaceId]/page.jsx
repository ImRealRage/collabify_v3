"use client";

import React, { useEffect, useState } from 'react';
import SideNav from '../_components/SideNav';

function Workspace({ params }) {
  const poems = [
    [
      "In realms of words and endless scroll,",
      "Select a doc to rock and roll.",
      "Your ideas wait to take their flight,",
      "Begin your journey; ignite the light."
    ],
    [
      "Pens poised high, stories untold,",
      "Open a doc, watch dreams unfold.",
      "Pages blank, but not for long,",
      "Your voice is here; it's time for song."
    ],
    [
      "Thoughts entwined in webs of gold,",
      "Write them down, be brave, be bold.",
      "In this space, your mind sets free,",
      "Dive into creativity."
    ]
  ];

  const [displayedText, setDisplayedText] = useState('');
  const [poemIndex, setPoemIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimeout;

    const currentPoem = poems[poemIndex];
    const currentLine = currentPoem[lineIndex];

    if (!isDeleting) {
      if (charIndex < currentLine.length) {
        typingTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev + currentLine[charIndex]);
          setCharIndex(charIndex + 1);
        }, 50); // Typing speed in milliseconds
      } else if (lineIndex < currentPoem.length - 1) {
        // Move to next line
        typingTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev + '\n');
          setLineIndex(lineIndex + 1);
          setCharIndex(0);
        }, 500); // Delay between lines
      } else {
        // Poem finished, start deleting
        typingTimeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1000); // Delay before deleting
      }
    } else {
      // Deleting text
      if (displayedText.length > 0) {
        typingTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, 25); // Deleting speed
      } else {
        // Move to next poem
        setIsDeleting(false);
        setLineIndex(0);
        setCharIndex(0);
        setPoemIndex((poemIndex + 1) % poems.length);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, lineIndex, isDeleting, displayedText, poemIndex, poems]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Side Navigation Panel */}
      <div className="fixed top-0 left-0 h-full z-20">
        <SideNav params={params} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-72 relative flex items-center justify-center">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-pink-50 to-blue-50"></div>

        {/* Centered Poem with Typing Effect */}
        <pre className="relative z-10 text-center whitespace-pre-wrap text-lg font-serif text-gray-800 p-6">
          {displayedText}
        </pre>
      </div>
    </div>
  );
}

export default Workspace;
