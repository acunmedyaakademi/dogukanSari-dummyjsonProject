import { useEffect, useState } from "react";
import './Products.css'
import SearchBar from './SearchBar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  async function getData() {
    const skip = (page - 1) * limit;
    const fetchUrl = `https://dummyjson.com/products?delay=0&limit=${limit}&skip=${skip}`;
    const data = await fetch(fetchUrl).then(res => res.json());
    setProducts([...data.products]);
    setFilteredProducts([...data.products]); 
    setTotal(data.total);
  }

  useEffect(() => {
    getData();
  }, [page]);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered); 
    }
  };

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if((page - 1) > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if((page + 1) <= pageCount) {
      setPage(page + 1);
    }
  }

  return (
    <>
      <div className="containerProducts">
        <h2>Products Page</h2>

        <SearchBar onSearch={handleSearch} />

        <div className="products">
          {filteredProducts.map(x => ( 
            <div className="productItem" key={x.id}>
              <h4>{x.title}</h4>
              <hr />
              <img src={x.thumbnail} />
              <hr />
              <div className="productDescription">
                <p>{x.description}</p>
                <p><b>Price:</b> ${x.price}</p>
                <p><b>Rating:</b> {x.rating}</p>
                <p><b>Stock:</b> {x.stock}</p>
              </div>
            </div>
          ))}
        </div>

        {pageCount > 0 && (
          <ul className="pagination">
            <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
            {Array
              .from({ length: pageCount }, (v, i) => (i + 1))
              .map(x => (
                <li key={x}>
                  <a href="#" className={page === x ? 'activePage' : ''} onClick={e => { e.preventDefault(); changePage(x); }}>
                    {x}
                  </a>
                </li>
              ))}
            <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
          </ul>
        )}
      </div>
    </>
  );
}
