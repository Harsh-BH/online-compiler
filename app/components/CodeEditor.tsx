// components/CodeEditor.js
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, code, setCode, fontSize }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setTheme(darkMode ? 'vs-dark' : 'light');
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains('dark');
      setTheme(darkMode ? 'vs-dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="editor-container">
      <Editor
        height="50vh"
        language={language}
        value={code}
        theme={theme}
        onChange={(value) => setCode(value)}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          fontFamily: 'Fira Code, monospace',
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
