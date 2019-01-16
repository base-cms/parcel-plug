import { get } from '@ember/object';
import { Promise } from 'rsvp';

export default (session) => {
  const headers = {};
  if (!get(session, 'isAuthenticated')) {
    return { headers };
  }
  return new Promise((resolve) => {
    const data = get(session, 'data.authenticated.session');
    headers['Authorization'] = `Bearer ${get(data, 'token')}`;
    resolve({ headers })
  });
};
