const getItem = (key: string): any => {
  const data = typeof window !== 'undefined' ? localStorage.getItem(key) : '';

  try {
    console.log('getItem', key, data);
    return JSON.parse(data as string);
  } catch (err) {
    return data;
  }
};

const setItem = (key: string, value: any): void => {
  const stringify = typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, stringify);
};

const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };