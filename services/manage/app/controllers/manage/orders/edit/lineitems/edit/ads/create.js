import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createAd from '@base-cms/parcel-plug-manage/gql/mutations/ad/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const lineitemId = this.get('lineitem.id');
      const {
        name,
        width,
        height,
        url,
      } = this.get('model');
      const input = {
        lineitemId,
        name,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        url,
      };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: createAd, variables }, 'createAd');
        await this.transitionToRoute('manage.orders.edit.lineitems.edit.ads.index');
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
