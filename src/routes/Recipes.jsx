import { useEffect, useState } from "react";
import './Recipes.css';
import SearchBar from './SearchBar';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtrelenmiş tarifler
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  async function getData() {
    const skip = (page - 1) * limit;
    const fetchUrl = `https://dummyjson.com/recipes?delay=0&limit=${limit}&skip=${skip}`;
    const data = await fetch(fetchUrl).then((res) => res.json());
    setRecipes([...data.recipes]);
    setFilteredRecipes([...data.recipes]); // Başlangıçta tüm tarifler
    setTotal(data.total);
  }

  useEffect(() => {
    getData();
  }, [page]);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredRecipes(recipes); // Eğer arama terimi boşsa tüm tarifleri göster
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered); // Filtrelenmiş tarifleri ayarla
    }
  };

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if (page + 1 <= pageCount) {
      setPage(page + 1);
    }
  }

  function openIngredientsModal(recipe) {
    setSelectedRecipe(recipe);
    setShowIngredientsModal(true);
  }

  function openInstructionsModal(recipe) {
    setSelectedRecipe(recipe);
    setShowInstructionsModal(true);
  }

  function closeModal() {
    setShowIngredientsModal(false);
    setShowInstructionsModal(false);
    setSelectedRecipe(null);
  }

  return (
    <>
      <div className="containerRecipes">
        <h2>Recipes Page</h2>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        <div className="recipes">
          {filteredRecipes.map((x) => (
            <div className="recipeItem" key={x.id}>
              <h4>{x.name}</h4>
              <img src={x.image} alt={x.name} />
              <div className="recipeDescription">
                <p>
                  <b>Difficulty:</b> {x.difficulty}
                </p>
                <p>
                  <b>Cuisine:</b> {x.cuisine}
                </p>
                <button onClick={() => openIngredientsModal(x)}>
                  Click to see ingredients
                </button>
                <button onClick={() => openInstructionsModal(x)}>
                  Click to see instructions
                </button>
                <p>Preparation Time: {x.prepTimeMinutes} Minutes</p>
                <p>Cooking Time: {x.cookTimeMinutes} Minutes</p>
              </div>
            </div>
          ))}
        </div>

        {pageCount > 0 && (
          <ul className="pagination">
            <li>
              <a href="#" onClick={handlePrevPage}>
                &lt;
              </a>
            </li>
            {Array.from({ length: pageCount }, (v, i) => i + 1).map((x) => (
              <li key={x}>
                <a
                  href="#"
                  className={page === x ? "activePage" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    changePage(x);
                  }}
                >
                  {x}
                </a>
              </li>
            ))}
            <li>
              <a href="#" onClick={handleNextPage}>
                &gt;
              </a>
            </li>
          </ul>
        )}
      </div>

      {/* Malzeme Listesi Modalı */}
      {showIngredientsModal && selectedRecipe && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Ingredients for {selectedRecipe.name}</h2>
            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients available</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Yapılış Talimatları Modalı */}
      {showInstructionsModal && selectedRecipe && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.preventDefault()}>
            <h2>Instructions for {selectedRecipe.name}</h2>
            {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
              <ul>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            ) : (
              <p>No instructions available</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
