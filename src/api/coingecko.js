import axios from "axios";
const API_URL = "https://api.coingecko.com/api/v3";

export const getCoinList = () => {
  return axios.get(`${API_URL}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });
};
export const getCoinDetails = (coinId) => {
  return axios.get(`${API_URL}/coins/${coinId}`);
};
