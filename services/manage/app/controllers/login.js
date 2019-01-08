import Controller from '@ember/controller';
import { inject } from '@ember/service';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

export default Controller.extend(ActionMixin, {
  username: null,
  password: null,
  errorMessage: null,
  session: inject(),

  actions: {
    async authenticate() {
      this.startAction();
      this.set('errorMessage', null);
      const { username, password } = this.getProperties('username', 'password');
      try {
        await this.get('session').authenticate('authenticator:application', username, password);
      } catch (e) {
        this.set('errorMessage', e.errors.length ? e.errors[0].message : 'An unknown error has occurred.');
      } finally {
        this.endAction();
      }
    }
  }
});
