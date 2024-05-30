import React, { useEffect, useState } from "react";

const CryptoSelect = ({ onSelect, defaultOption, selectedCoin, coins }) => {
  const [currentCoin, setCurrentCoin] = useState(selectedCoin || "");
  useEffect(() => {
    setCurrentCoin(selectedCoin);
  }, [selectedCoin]);
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setCurrentCoin(selectedValue);
    onSelect(selectedValue);
  };
  return (
    <select value={currentCoin} onChange={handleChange}>
      <option value="">{defaultOption}</option>{" "}
      {coins.map((coin) => (
        <option key={coin.id} value={coin.id}>
          {" "}
          {coin.name}{" "}
        </option>
      ))}{" "}
    </select>
  );
};

export default CryptoSelect;
