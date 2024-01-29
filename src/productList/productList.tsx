import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../searchBar/searchBar";
import styles from "./index.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductList: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const debounceTimeout = useRef<number | NodeJS.Timeout | null>(null);

  //Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = searchQuery
        ? `https://dummyjson.com/products/search?q=${searchQuery}`
        : `https://dummyjson.com/products?skip=${(page - 1) * 20}&limit=20`;

      const response = await fetch(url);
      const newProducts: ApiResponse = await response.json();
      const productsArray: Product[] = newProducts.products;

      if (productsArray.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...productsArray]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //Prevent fetchData is called when searchQuery is empty
    if (!searchQuery) {
      fetchData();
      return;
    }

    // Debounce the fetchData function with a delay of 1000 milliseconds
    debounceTimeout.current && clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchData(), 1000);

    // Cleanup debounce function
    return () => {
      debounceTimeout.current && clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  //Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setItems([]); // Clear previous items when searching
    setPage(1); // Reset page to 1 when searching
    setHasMore(true); // Reset hasMore to true when searching

    // If searchQuery is empty, call fetchData immediately
    if (!query) {
      fetchData();
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={items.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
        endMessage={<p>No more data to load.</p>}
      >
        <div className={styles.productList}>
          {items.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.thumbnail}
                alt={product.brand}
                style={{ width: "100%" }}
              />
              <div>
                <p>Product : {product.title}</p>
              </div>
              <div className={styles.info}>
                <div>
                  <p>{product.category}</p>
                  <p>Rating:{product.rating}</p>
                  <p>{product.stock}</p>
                </div>

                <div>
                  <p>${product.price}</p>
                  <p>{product.discountPercentage} %</p>
                </div>
              </div>

              <div>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default ProductList;
