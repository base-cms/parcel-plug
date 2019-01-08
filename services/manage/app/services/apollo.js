import ApolloService from 'ember-apollo-client/services/apollo';
import { computed, get } from '@ember/object';
import { inject } from '@ember/service';
import { setContext } from 'apollo-link-context';
import { Promise } from 'rsvp';

export default ApolloService.extend({
  session: inject(),

  link: computed(function() {
    const httpLink = this._super(...arguments);
    const authLink = setContext((req, ctx) => {
      return this._runAuthorize(req, ctx);
    });
    return authLink.concat(httpLink);
  }),

  _runAuthorize() {
    const headers = {};
    if (!this.get('session.isAuthenticated')) {
      return { headers };
    }
    return new Promise((resolve) => {
      const data = this.get('session.data.authenticated.session');
      headers['Authorization'] = `Bearer ${get(data, 'token')}`;
      resolve({ headers })
    });
  },
});
