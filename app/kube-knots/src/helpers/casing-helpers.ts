export const camelToSnakeCase = (str: string | undefined) => {
  if (!str) {
    return "";
  }

  const snakeCase = str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  if (snakeCase.startsWith("_")) {
    return snakeCase.slice(1);
  }

  return snakeCase;
};
