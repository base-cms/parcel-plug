import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  isChangePasswordOpen: false,
  isUpdateProfileOpen: false,

  actions: {
    displayChangePassword() {
      this.set('isChangePasswordOpen', true);
    },
    displayUpdateProfile() {
      this.set('isUpdateProfileOpen', true);
    },
  },
});
