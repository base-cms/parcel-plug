import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { get } from '@ember/object';
import { ObjectQueryManager } from 'ember-apollo-client';

import orderName from '@base-cms/parcel-plug-manage/gql/mutations/order/name';
import orderAdvertiser from '@base-cms/parcel-plug-manage/gql/mutations/order/advertiser';
import deleteOrder from '@base-cms/parcel-plug-manage/gql/mutations/order/delete';

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
        await this.get('apollo').mutate({ mutation: orderName, variables }, 'orderName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setAdvertiser({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: get(value, 'id') };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: orderAdvertiser, variables }, 'orderAdvertiser');
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
      const mutation = deleteOrder;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteOrder');
        await this.transitionToRoute('manage.orders.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
