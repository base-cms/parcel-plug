module.exports = (statusCode, ...args) => {
  const e = new Error(...args);
  e.statusCode = Number(statusCode) || 500;
  return e;
};
