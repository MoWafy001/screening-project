

export const store = {
  get: (key: string) => localStorage.getItem(key),
  set: (key: string, value: any) => localStorage.setItem(key, value),
  delete: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
