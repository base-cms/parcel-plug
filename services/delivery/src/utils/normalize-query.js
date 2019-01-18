const moment = require('moment');
const httpError = require('./http-error');

const isObject = v => v && typeof v === 'object';

module.exports = (query) => {
  if (!isObject(query)) throw httpError(400, 'No query parameters were provided.');
  const {
    date: dateStr,
    email,
    rand,
    send,
    placeholder,
  } = query;

  const date = moment(dateStr);
  if (!date.isValid()) throw httpError(400, 'Invalid `date` parameter.');
  if (!email) throw httpError(400, 'No `email` parameter was provided.');
  if (!rand) throw httpError(400, 'No `rand` parameter was provided');

  return {
    date: date.toDate(),
    email,
    rand,
    send: send || undefined,
    placeholder: placeholder ? true : undefined,
  };
};
