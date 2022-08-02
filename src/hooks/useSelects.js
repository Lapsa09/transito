import { useEffect, useState } from 'react';

export default function useSelects(inputs) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const res = await Promise.all([...inputs]);
        setData([...res]);
      } catch (err) {
        setError(err.response?.data);
      }
    };
    fetchSelects();
  }, []);
  return { data, error };
}
