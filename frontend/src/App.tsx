import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

// Add TypeScript support for the editor
const highlight = (code: string) => {
  return prism.highlight(code, prism.languages.javascript, 'javascript');
};

function App() {
  const [code, setCode] = useState(`function sum() {\n  return a + b;\n}\n\n// Try changing this code and click 'Review Code'`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    prism.highlightAll();
  }, [review]);

  async function reviewCode() {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3003/api/get-review', {
        prompt: code
      });
      setReview(response.data);
    } catch (err) {
      setError('Failed to get code review. Please try again.');
      console.error('Review error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>AI Code Reviewer</h1>
        <p>Get instant feedback on your code</p>
      </header>
 
      <div className="container">
        <div className="editor-container">
          <div className="editor-header">
            <h2>Your Code</h2>
            <button
              onClick={reviewCode}
              disabled={isLoading}
              className={`review-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Reviewing...' : 'Review Code'}
            </button>
          </div>
          <div className="code-editor w-full">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={highlight}
              padding={16}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: '#1e1e1e',
                minHeight: '300px',
                borderRadius: '8px',
                color: '#f8f8f2',
                lineHeight: '1.5',
              }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="output-container">
          <div className="output-header">
            <h2>Review</h2>
          </div>
          <div className="output-content">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Analyzing your code...</p>
              </div>
            ) : review ? (
              <div className="markdown-output">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>
              </div>
            ) : (
              <div className="empty-state">
                <p>Your code review will appear here</p>
                <p>Click "Review Code" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
   </div>
  
  );
}

export default App;