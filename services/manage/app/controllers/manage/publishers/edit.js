import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import publisherName from '@base-cms/parcel-plug-manage/gql/mutations/publisher/name';
import deletePublisher from '@base-cms/parcel-plug-manage/gql/mutations/publisher/delete';

export default Controller.extend(ObjectQueryManager, ActionMixin, {
  actions: {
    /**
     *
     * @param {string} params.value
     */
    async setName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: publisherName, variables }, 'publisherName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     */
    async delete() {
      this.startAction();
      this.set('isDeleting', true);
      const id = this.get('model.id');
      const variables = { input: { id } };
      const mutation = deletePublisher;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteCampaign');
        await this.transitionToRoute('manage.publishers.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
