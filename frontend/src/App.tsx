import { useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard'

function App() {
  const [toast, setToast] = useState<string | null>(null)

  const handleGetStarted = () => {
    setToast("Welcome! Let's deploy your token.")
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow" role="banner">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">StellarForge</h1>
            <p className="mt-2 text-sm text-gray-600">Stellar Token Deployer</p>
          </div>
        </header>

        <main id="main-content" className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8 text-center">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
            <Dashboard />
          </div>
        </main>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-4 right-4 z-50"
        >
          {toast && (
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
              {toast}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
