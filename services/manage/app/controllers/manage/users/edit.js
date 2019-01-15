import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import userGivenName from '@base-cms/parcel-plug-manage/gql/mutations/user/given-name';
import userFamilyName from '@base-cms/parcel-plug-manage/gql/mutations/user/family-name';
import userRole from '@base-cms/parcel-plug-manage/gql/mutations/user/role';
import userEmail from '@base-cms/parcel-plug-manage/gql/mutations/user/email';
import changeUserPassword from '@base-cms/parcel-plug-manage/gql/mutations/user/change-password';
import deleteUser from '@base-cms/parcel-plug-manage/gql/mutations/user/delete';

export default Controller.extend(ObjectQueryManager, ActionMixin, {
  actions: {
    /**
     *
     * @param {string} params.value
     */
    async setGivenName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: userGivenName, variables }, 'userGivenName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },
    /**
     *
     * @param {string} params.value
     */
    async setFamilyName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: userFamilyName, variables }, 'userFamilyName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setRole({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: userRole, variables }, 'userRole');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setEmail({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: userEmail, variables }, 'userEmail');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setPassword({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value, confirm: value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: changeUserPassword, variables }, 'changeUserPassword');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     */
    async delete() {
      this.startAction();
      this.set('isDeleting', true);
      const id = this.get('model.id');
      const variables = { input: { id } };
      try {
        await this.get('apollo').mutate({ mutation: deleteUser, variables }, 'deleteUser');
        await this.transitionToRoute('manage.users.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
