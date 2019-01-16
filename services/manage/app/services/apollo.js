import ApolloService from 'ember-apollo-client/services/apollo';
import { inject } from '@ember/service';
import authorize from '@base-cms/parcel-plug-manage/apollo/authorize';
import { computed } from '@ember/object';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

export default ApolloService.extend({
  session: inject(),

  link: computed(function() {
    const uri = this.get('apiURL');
    const uploadLink = createUploadLink({ uri });
    const authLink = setContext((req, ctx) => {
      return authorize(this.get('session'), req, ctx);
    });
    return authLink.concat(uploadLink);
  }),
});
