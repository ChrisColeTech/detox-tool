import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
      <header className="app-border-b p-4">
        <h1 className="text-2xl font-bold">Detox Tool Frontend</h1>
        <p className="text-muted" style={{ color: 'var(--text-muted)' }}>
          JavaScript Deobfuscation Tool - Phase 1 Complete
        </p>
      </header>
      
      <main className="p-4">
        <div className="card max-w-md mx-auto">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Project Status</h2>
          </div>
          <div className="card-content">
            <p className="mb-4">Build system successfully configured with:</p>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li>React 18 + TypeScript</li>
              <li>Vite build system</li>
              <li>Tailwind CSS 3.x</li>
              <li>Theme system with CSS variables</li>
              <li>Directory structure</li>
            </ul>
            
            <div className="mt-6 flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => setCount((count) => count + 1)}
              >
                Test Button ({count})
              </button>
              <button 
                className="btn"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App