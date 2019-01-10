import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import { get } from '@ember/object';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createOrder from '@base-cms/parcel-plug-manage/gql/mutations/order/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const { name, advertiser } = this.get('model');
      const input = { name, advertiserId: get(advertiser, 'id') };
      const variables = { input };
      try {
        const response = await this.get('apollo').mutate({ mutation: createOrder, variables }, 'createOrder');
        await this.transitionToRoute('manage.orders.edit', response.id);
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
