import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import createUser from '@base-cms/parcel-plug-manage/gql/mutations/user/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const { givenName, familyName, email, password, confirmPassword, role } = this.get('model');
      const input = { givenName, familyName, email, password, confirmPassword, role };
      const variables = { input };
      try {
        const response = await this.get('apollo').mutate({ mutation: createUser, variables }, 'createUser');
        await this.transitionToRoute('manage.users.edit', response.id);
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
