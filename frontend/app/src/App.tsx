import React from 'react'
import Layout from '@/components/layout/Layout'
import { ErrorProvider } from '@/contexts/ErrorContext'

function App(): React.JSX.Element {
  return (
    <ErrorProvider>
      <Layout />
    </ErrorProvider>
  )
}

export default App
