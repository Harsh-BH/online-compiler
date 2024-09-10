// pages/index.js (or Home component)
"use client"
import React, { useState, useEffect } from 'react';
import CodeEditor from '../app/components/CodeEditor';

const initialCode = {
  javascript: 'console.log("hello");',
  python: 'print("hello")',
  cpp: `#include <iostream>

int main() {
    std::cout << "hello";
    return 0;
}`,
};

export default function Home() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(initialCode.cpp);
  const [output, setOutput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 30 ? prevSize + 2 : prevSize));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 10 ? prevSize - 2 : prevSize));
  };

  const runCode = async () => {
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });

      if (response.ok) {
        const result = await response.text();
        setOutput(result);
      } else {
        const errorText = await response.text();
        setOutput(`Error: ${errorText}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-center text-white animate-fade-in-down">Online Compiler</h1>
        <button
          onClick={toggleDarkMode}
          className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={decreaseFontSize}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded"
        >
          A-
        </button>
        <button
          onClick={increaseFontSize}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded"
        >
          A+
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[70%,30%] gap-12 min-h-[calc(100vh-10rem)]">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 shadow-xl rounded-lg flex flex-col justify-between">
          <div className="mb-6">
            <label htmlFor="language" className="block text-lg font-semibold text-gray-700 dark:text-gray-200">Choose Language:</label>
            <select
              id="language"
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(initialCode[e.target.value]);
              }}
              value={language}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C/C++</option>
            </select>
          </div>
          <CodeEditor language={language} code={code} setCode={setCode} fontSize={fontSize} />
          <button
            onClick={runCode}
            className="mt-6 py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out shadow-lg"
          >
            Run Code
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 shadow-xl rounded-lg flex flex-col justify-start">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Output:</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-lg flex-1 overflow-auto transition-all duration-500 ease-in-out">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
