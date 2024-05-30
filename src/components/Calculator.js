import React, { useState, useEffect, useCallback } from 'react';
import CryptoSelect from './CryptoSelect';
import { getCoinList } from '../api/coingecko';

const stakeableCoins = [
  'ethereum',
  'cardano',
  'polkadot',
  'solana',
  'avalanche-2',
  'cosmos',
  'near',
  'algorand',
  'tezos',
  'harmony',
  'elrond-erd-2',
  // Add more stakeable coins as needed
];

const timePeriods = [
  { label: '1 Day', value: 1 / 365 },
  { label: '1 Week', value: 7 / 365 },
  { label: '1 Month', value: 1 / 12 },
  { label: '3 Months', value: 3 / 12 },
  { label: '6 Months', value: 6 / 12 },
  { label: '12 Months', value: 1 },
];

const Calculator = () => {
  const [rows, setRows] = useState([{ coin: '', amount: '', apy: '', totalValue: 0 }]);
  const [results, setResults] = useState({ period: '1 Day', earnings: 0 });
  const [totalValueOfStakedCoins, setTotalValueOfStakedCoins] = useState(0);
  const [coins, setCoins] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(timePeriods[0].value);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coinListResponse = await getCoinList();
        const filteredCoins = coinListResponse.data.filter(coin => stakeableCoins.includes(coin.id));
        setCoins(filteredCoins);
      } catch (error) {
        console.error('Error fetching coin list:', error);
      }
    };

    fetchCoins();
  }, []);

  const calculateEarnings = useCallback(() => {
    const earnings = rows.reduce((acc, row) => {
      const { coin, amount, apy } = row;
      if (!coin || !amount || !apy) return acc;

      const coinData = coins.find(c => c.id === coin);
      if (!coinData) return acc;

      const totalValue = amount * coinData.current_price;
      const periodEarnings = totalValue * (apy / 100) * selectedPeriod;
      return acc + periodEarnings;
    }, 0);

    const totalValue = rows.reduce((acc, row) => {
      const { coin, amount } = row;
      if (!coin || !amount) return acc;

      const coinData = coins.find(c => c.id === coin);
      if (!coinData) return acc;

      return acc + amount * coinData.current_price;
    }, 0);

    setResults({ period: selectedPeriod, earnings });
    setTotalValueOfStakedCoins(totalValue);
  }, [rows, coins, selectedPeriod]);

  useEffect(() => {
    calculateEarnings();
  }, [rows, calculateEarnings, selectedPeriod]);

  const handleCoinSelect = (index, coin) => {
    const updatedRows = [...rows];
    updatedRows[index].coin = coin;
    setRows(updatedRows);
  };

  const handleAmountChange = (index, amount) => {
    const updatedRows = [...rows];
    updatedRows[index].amount = amount === '' ? '' : parseFloat(amount) || 0;

    const coinData = coins.find(c => c.id === updatedRows[index].coin);
    if (coinData) {
      updatedRows[index].totalValue = updatedRows[index].amount * coinData.current_price;
    } else {
      updatedRows[index].totalValue = 0;
    }

    setRows(updatedRows);
  };

  const handleApyChange = (index, apy) => {
    const updatedRows = [...rows];
    updatedRows[index].apy = apy === '' ? '' : parseFloat(apy) || 0;
    setRows(updatedRows);
  };

  const handlePeriodChange = (e) => {
    const selectedValue = parseFloat(e.target.value);
    setSelectedPeriod(selectedValue);
  };

  const addRow = () => {
    setRows([...rows, { coin: '', amount: '', apy: '', totalValue: 0 }]);
  };

  const deleteRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <img src="logo.png" alt="Logo" class="w-4 h-4 mr-2" />
      <h1>Crypto Staking Calculator</h1>
      <h2>Total Value: ${totalValueOfStakedCoins.toFixed(2)}</h2>
      {rows.map((row, index) => (
        <div key={index}>
          <CryptoSelect
            onSelect={coin => handleCoinSelect(index, coin)}
            defaultOption="Select a coin"
            selectedCoin={row.coin}
            coins={coins}
          />
          <input
            type="number"
            placeholder="Amount"
            value={row.amount}
            onChange={e => handleAmountChange(index, e.target.value)}
            onFocus={e => e.target.select()}
          />
          <input
            type="number"
            placeholder="APY (%)"
            value={row.apy}
            onChange={e => handleApyChange(index, e.target.value)}
            onFocus={e => e.target.select()}
          />
          {rows.length > 1 && (
                <button className="delete" onClick={() => deleteRow(index)}></button>
          
          )}
        </div>
      ))}
      <button onClick={addRow}>+</button>
      <div>
        <h2>Estimated Earnings:</h2>
        <select onChange={handlePeriodChange} value={selectedPeriod}>
          {timePeriods.map(period => (
            <option key={period.label} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        <p>{timePeriods.find(p => p.value === selectedPeriod).label}: ${results.earnings.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Calculator;