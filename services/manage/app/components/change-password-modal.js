import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { ComponentQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import changeUserPassword from '@base-cms/parcel-plug-manage/gql/mutations/user/change-password';

export default Component.extend(ComponentQueryManager, ActionMixin, {
  notify: inject(),
  model: null,

  isOpen: false,
  canChange: computed('reasonForPreventChange', function() {
    return (!this.get('reasonForPreventChange')) ? true : false;
  }),

  isSubmitDisabled: computed('canChange', 'isActionRunning', function() {
    if (this.get('isActionRunning')) return true;
    if (this.get('canChange')) return false;
    return true;
  }),

  reasonForPreventChange: computed('password.{value,confirm}', function() {
    if (!this.get('password.value.length') || this.get('password.value.length') < 6) {
      return 'supply a new password of at least six characers.';
    }
    if (this.get('password.value') === this.get('password.confirm')) {
      return null;
    }
    return 'please confirm your password with the same value.';
  }),

  didInsertElement() {
    this.set('password', { value: '', confirm: '' });
  },

  actions: {
    async changePassword() {
      this.startAction();
      const mutation = changeUserPassword;
      const id = this.get('model.id');
      const { value, confirm } = this.get('password');
      const input = { id, value, confirm };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'changeUserPassword');
        this.set('isOpen', false);
        this.get('notify').info('Password successfully changed.');
      } catch (e) {
        this.get('graphErrors').show(e)
      } finally {
        this.endAction();
      }
    },

    clearPassword() {
      this.set('password', { value: '', confirm: '' });
    },
  },

});
