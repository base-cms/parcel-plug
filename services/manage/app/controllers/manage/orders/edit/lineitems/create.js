import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createLineItem from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create(closeModal) {
      this.startAction();
      const orderId = this.get('order.id');
      const { name } = this.get('model');
      const input = { name, orderId };
      const variables = { input };
      try {
        const refetchQueries = ['LineItemListForOrder', 'MatchLineItemListForOrder'];
        const response = await this.get('apollo').mutate({ mutation: createLineItem, variables, refetchQueries }, 'createLineItem');
        await closeModal(false);
        await this.transitionToRoute('manage.orders.edit.lineitems.edit', orderId, response.id);
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
      }
    },

    setFieldValue({ name, value }) {
      this.set(`model.${name}`, value);
    },
  },
});
