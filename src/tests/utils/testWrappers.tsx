import React from 'react'
import { MemoryRouter, MemoryRouterProps, Routes, Route } from 'react-router-dom'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { SnackbarProvider } from 'notistack'

interface TestRouterProps extends Omit<MemoryRouterProps, 'future'> {
  children: React.ReactNode
}

// Router con future flags configuradas para evitar warnings
export const TestRouter = ({ children, ...props }: TestRouterProps) => {
  return (
    <MemoryRouter
      {...props}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </MemoryRouter>
  )
}

// Wrapper completo para tests con todos los providers necesarios
interface TestProviderProps {
  children: React.ReactNode
  initialEntries?: string[]
  withSnackbar?: boolean
}

export const TestProvider = ({ 
  children, 
  initialEntries = ['/'],
  withSnackbar = false 
}: TestProviderProps) => {
  const content = (
    <TestRouter initialEntries={initialEntries}>
      <GlobalProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </GlobalProvider>
    </TestRouter>
  )

  if (withSnackbar) {
    return <SnackbarProvider>{content}</SnackbarProvider>
  }

  return content
}

// Wrapper para tests con routing específico
interface TestRouteWrapperProps {
  children: React.ReactNode
  path: string
  initialEntries?: string[]
}

export const TestRouteWrapper = ({ 
  children, 
  path,
  initialEntries = ['/']
}: TestRouteWrapperProps) => {
  return (
    <TestProvider initialEntries={initialEntries}>
      <Routes>
        <Route path={path} element={children} />
      </Routes>
    </TestProvider>
  )
}