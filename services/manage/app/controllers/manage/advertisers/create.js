import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createAdvertiser from '@base-cms/parcel-plug-manage/gql/mutations/advertiser/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
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
        await this.transitionToRoute('manage.advertisers.edit', response.id);
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
