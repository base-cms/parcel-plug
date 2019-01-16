const { NODE_ENV } = process.env;
const { log } = console;

module.exports = (message, allowOnTest = false) => {
  if (NODE_ENV !== 'test' || allowOnTest) {
    if (typeof message !== 'string') return log(message);
    process.stdout.write(`${message}\n`);
  }
  return message;
};
