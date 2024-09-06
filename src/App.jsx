import { useState } from 'react'
import './App.css'
import Products from './routes/Products'
import Postandcomments from './routes/Postandcomments'
import Recipes from './routes/Recipes'

function App() {
  const [page, setPage] = useState(<Products />);

  return (
    <div className="container">
      <div className="nav">
        <h1>DummyJson Project</h1>
        <ul className="navBar">
          <li><a href="#" onClick={() => setPage(<Products />)}>Products</a></li>
          <li><a href="#" onClick={() => setPage(<Recipes setPage={setPage} />)}>Recipes</a></li>
          <li><a href="#" onClick={() => setPage(<Postandcomments setPage={setPage} />)}>Post & Comments</a></li>
        </ul>
      </div>
      <hr />
      {page}
    </div>
  )
}

export default App
