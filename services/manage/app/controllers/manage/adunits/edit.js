import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { get } from '@ember/object';
import { ObjectQueryManager } from 'ember-apollo-client';

import adunitName from '@base-cms/parcel-plug-manage/gql/mutations/adunit/name';
import adunitWidth from '@base-cms/parcel-plug-manage/gql/mutations/adunit/width';
import adunitHeight from '@base-cms/parcel-plug-manage/gql/mutations/adunit/height';
import adunitDeployment from '@base-cms/parcel-plug-manage/gql/mutations/adunit/deployment';
import deleteAdUnit from '@base-cms/parcel-plug-manage/gql/mutations/adunit/delete';

export default Controller.extend(ObjectQueryManager, ActionMixin, {
  actions: {
    /**
     *
     * @param {string} params.value
     */
    async setName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adunitName, variables }, 'adunitName');
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
    async setWidth({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: parseInt(value, 10) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adunitWidth, variables }, 'adunitWidth');
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
    async setHeight({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: parseInt(value, 10) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adunitHeight, variables }, 'adunitHeight');
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
    async setDeployment({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: get(value, 'id') };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adunitDeployment, variables }, 'adunitDeployment');
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
      const mutation = deleteAdUnit;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteAdUnit');
        await this.transitionToRoute('manage.adunits.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
