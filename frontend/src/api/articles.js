import axios from "axios";


export const fetchArticles = () =>
  axios.get(import.meta.env.VITE_API_BASE);
