import React, { ChangeEvent } from "react";
import styles from "./index.module.scss";

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search product..."
        onChange={handleChange}
        className={styles.searchBar}
      />
    </div>
  );
};

export default SearchBar;
