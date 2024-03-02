export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/[\w]([A-Z])/g, (m) => {
      return m[0] + '_' + m[1];
    })
    .toLowerCase();
};
