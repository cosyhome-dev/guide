import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "@/pages/Login"
import GuideHome from "@/pages/GuideHome"
import GuideSection from "@/pages/GuideSection"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/guide" element={<GuideHome />} />
        <Route path="/guide/:section" element={<GuideSection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
