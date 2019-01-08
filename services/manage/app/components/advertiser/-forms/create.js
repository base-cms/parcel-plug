import Component from '@ember/component';
import { ComponentQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createAdvertiser from '@base-cms/parcel-plug-manage/gql/mutations/advertiser/create';

export default Component.extend(ActionMixin, ComponentQueryManager, {
  tagName: '',
  model: null,

  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const { name } = this.get('model');
      const input = { name };
      const variables = { input };
      try {
        const response = await this.get('apollo').mutate({ mutation: createAdvertiser, variables }, 'createAdvertiser');
        await this.sendEventAction('on-success', response);
      } catch (e) {
        this.sendEventAction('on-error', e);
      } finally {
        this.endAction();
      }
    },

    setFieldValue({ name, value }) {
      this.set(`model.${name}`, value);
    },
  },
});
