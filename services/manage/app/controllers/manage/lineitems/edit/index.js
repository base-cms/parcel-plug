import Controller from '@ember/controller';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import lineitemName from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/name';
import lineitemPriority from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/priority';
import lineitemAdUnits from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/adunits';
import lineitemDeployments from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/deployments';
import lineitemPublishers from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/publishers';
import deleteLineItem from '@base-cms/parcel-plug-manage/gql/mutations/lineitem/delete';

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
        await this.get('apollo').mutate({ mutation: lineitemName, variables }, 'lineitemName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setAdUnits({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: value.map(v => v.id) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: lineitemAdUnits, variables }, 'lineitemAdUnits');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setDeployments({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: value.map(v => v.id) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: lineitemDeployments, variables }, 'lineitemDeployments');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setPublishers({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value: value.map(v => v.id) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: lineitemPublishers, variables }, 'lineitemPublishers');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setPriority(event) {
      this.startAction();
      const input = { id: this.get('model.id'), value: parseInt(event.target.value, 10) };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: lineitemPriority, variables }, 'lineitemPriority');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setDays(values) {
      this.set('model.dates.days', values);
    },

    async setRange(value) {
      const { start, end } = value;
      console.info('setRange', start, end);
      this.set('model.dates.start', start);
      this.set('model.dates.end', end);
    },

    /**
     *
     */
    async delete() {
      this.startAction();
      this.set('isDeleting', true);
      const id = this.get('model.id');
      const variables = { input: { id } };
      const mutation = deleteLineItem;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteLineItem');
        await this.transitionToRoute('manage.lineitems.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
