const { NODE_ENV } = process.env;

module.exports = (message, allowOnTest = false) => {
  if (NODE_ENV !== 'test' || allowOnTest) {
    process.stdout.write(`${message}\n`);
  }
};
