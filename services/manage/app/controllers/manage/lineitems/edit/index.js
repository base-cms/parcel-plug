import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import lineitemName from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/name';
import deleteLineItem from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/delete';

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
        await this.get('apollo').mutate({ mutation: lineitemName, variables }, 'lineitemName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setAdUnits({ value }) {
      console.log('setAdUnits', value);
    },

    async setDeployments({ value }) {
      console.log('setDeployments', value);
    },

    async setPublishers({ value }) {
      console.log('setPublishers', value);
    },

    /**
     *
     */
    async delete() {
      this.startAction();
      this.set('isDeleting', true);
      const id = this.get('model.id');
      const variables = { input: { id } };
      const mutation = deleteLineItem;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteLineItem');
        await this.transitionToRoute('manage.lineitems.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
