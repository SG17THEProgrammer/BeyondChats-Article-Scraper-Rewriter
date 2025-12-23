import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FullArticle from './components/FullArticle'
import Home from './components/Home'

const App = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<FullArticle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App