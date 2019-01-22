import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import adName from '@base-cms/parcel-plug-manage/gql/mutations/ad/name';
import adImage from '@base-cms/parcel-plug-manage/gql/mutations/ad/image';
import adWidth from '@base-cms/parcel-plug-manage/gql/mutations/ad/width';
import adHeight from '@base-cms/parcel-plug-manage/gql/mutations/ad/height';
import adUrl from '@base-cms/parcel-plug-manage/gql/mutations/ad/url';
import deleteAd from '@base-cms/parcel-plug-manage/gql/mutations/ad/delete';
import pauseAd from '@base-cms/parcel-plug-manage/gql/mutations/ad/pause';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    async setName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adName, variables }, 'adName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setWidth({ value }) {
      this.startAction();
      const input = {
        id: this.get('model.id'),
        value: parseInt(value, 10),
      };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adWidth, variables }, 'adWidth');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setHeight({ value }) {
      this.startAction();
      const input = {
        id: this.get('model.id'),
        value: parseInt(value, 10),
      };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adHeight, variables }, 'adHeight');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setUrl({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adUrl, variables }, 'adUrl');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    async setImage({ value: file, info }) {
      const { width, height, bytes } = info.getProperties('width', 'height', 'bytes');
      this.startAction();
      const input = {
        id: this.get('model.id'),
        file,
        width,
        height,
        bytes,
      };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: adImage, variables }, 'adImage');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },
    /**
     *
     */
    async pause() {
      this.startAction();
      this.set('isPausing', true);
      const id = this.get('model.id');
      const value = !this.get('model.paused');
      const variables = { input: { id, value } };
      const mutation = pauseAd;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'pauseAd');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isPausing', false);
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
      const mutation = deleteAd;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteAd');
        await this.transitionToRoute('manage.orders.edit.lineitems.edit.ads.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
