import Component from '@ember/component';
import { ComponentQueryManager } from 'ember-apollo-client';
import { computed, observer } from '@ember/object';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';

import query from '@base-cms/parcel-plug-manage/gql/queries/ad/edit';

export default Component.extend(ComponentQueryManager, ActionMixin, {
  classNames: ['card'],
  id: null,
  title: null,

  activeId: null,

  isActive: computed('activeId', 'id', function() {
    return this.get('activeId') === this.get('id');
  }),

  loadDataObserver: observer('isActive', function() {
    if (this.get('isActive')) this.loadData();
  }),

  init() {
    this._super(...arguments);
    this.get('isActive');
  },

  async loadData() {
    this.startAction();
    const id = this.get('id');
    const input = { id };
    const variables = { input };
    try {
      const ad = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'cache-and-network' }, 'ad');
      this.set('ad', ad);
    } catch (e) {
      this.get('graphErrors').show(e);
    } finally {
      this.endAction();
    }
  },

  actions: {
    async setName() {

    },

    async setWidth() {

    },

    async setHeight() {

    },

    async setUrl() {

    },

    async delete() {

    },
  },
});
