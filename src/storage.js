import { useState } from 'react';

// 5min
const TTL = 300000;

export const useLocalStorageWitTTL = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const data = JSON.parse(item);
	    const now = new Date();
      if (now.getTime() > data.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
      }
      return data ? data.value : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const now = new Date();
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      const item = {
        value: valueToStore,
        expiry: now.getTime() + TTL,
      }
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorageWitTTL;