import Component from '@ember/component';
import { ComponentQueryManager } from 'ember-apollo-client';
import { inject } from '@ember/service';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import updateCurrentUserProfile from '@base-cms/parcel-plug-manage/gql/mutations/user/update-profile';

export default Component.extend(ComponentQueryManager, ActionMixin, {
  notify: inject(),

  model: null,

  isOpen: false,

  actions: {
    async saveProfile() {
      this.startAction();
      const mutation = updateCurrentUserProfile;
      const { givenName, familyName } = this.get('model');
      const input = { givenName, familyName };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'updateCurrentUserProfile');
        this.set('isOpen', false);
        this.get('notify').info('User profile successfully updated.');
      } catch (e) {
        this.get('graphErrors').show(e)
      } finally {
        this.endAction()
      }
    },
  },

});
