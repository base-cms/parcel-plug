import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import { get } from '@ember/object';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createAdUnit from '@base-cms/parcel-plug-manage/gql/mutations/adunit/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const {
        name,
        width,
        height,
        deployment,
      } = this.get('model');
      const input = {
        name,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        deploymentId: get(deployment, 'id'),
      };
      const variables = { input };
      try {
        const response = await this.get('apollo').mutate({ mutation: createAdUnit, variables }, 'createAdUnit');
        await this.transitionToRoute('manage.adunits.edit', response.id);
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
