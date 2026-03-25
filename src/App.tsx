import React from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GuideProvider } from "@/hooks"
import Login from "@/pages/Login"
import GuideHome from "@/pages/GuideHome"
import GuideSection from "@/pages/GuideSection"
import NotFound from "@/pages/NotFound"

const queryClient = new QueryClient()

function AnimatedRoutes() {
  const location = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Login />} />
        <Route
          path="/guide"
          element={
            <GuideProvider>
              <GuideHome />
            </GuideProvider>
          }
        />
        <Route
          path="/guide/:section"
          element={
            <GuideProvider>
              <GuideSection />
            </GuideProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
