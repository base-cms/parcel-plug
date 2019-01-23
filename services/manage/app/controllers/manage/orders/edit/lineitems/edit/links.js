import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import lineitemExternalLinks from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/external-links';

export default Controller.extend(ObjectQueryManager, ActionMixin, {
  actions: {
    /**
     *
     * @param {string} params.value
     */
    async setExternalLinks(value) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: lineitemExternalLinks, variables }, 'lineitemExternalLinks');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },
  },
});
