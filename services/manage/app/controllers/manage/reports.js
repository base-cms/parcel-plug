import Controller from '@ember/controller';
import moment from 'moment';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import query from '@base-cms/parcel-plug-manage/gql/queries/report/list';
import { computed } from '@ember/object';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  start: null,
  end: null,

  init() {
    this._super(...arguments);
    this.set('start', moment().startOf('day'));
    this.set('end', moment().endOf('day'));
    this.setProperties({
      publishers: [],
      deployments: [],
      adunits: [],
      advertisers: [],
      orders: [],
      lineitems: [],
    });
  },

  hasResults: computed('model.rows.length', function() {
    const length = this.get('model.rows.length');
    return length && length > 1;
  }),

  isDownloadDisabled: computed('isActionRunning', 'hasResults', function() {
    const isActionRunning = this.get('isActionRunning');
    const hasResults = this.get('hasResults');
    return isActionRunning || !hasResults;
  }),

  downloadInput: computed('start', 'end', 'publishers', 'deployments', 'adunits', 'advertisers', 'orders', 'lineitems', function() {
    return JSON.stringify(this.getInput());
  }),

  getInput() {
    return {
      start: moment(this.get('start')).valueOf(),
      end: moment(this.get('end')).valueOf(),
      publisherIds: this.get('publishers').map(v => v.id),
      deploymentIds: this.get('deployments').map(v => v.id),
      adunitIds: this.get('adunits').map(v => v.id),
      advertiserIds: this.get('advertisers').map(v => v.id),
      orderIds: this.get('orders').map(v => v.id),
      lineitemIds: this.get('lineitems').map(v => v.id),
    };
  },

  async execute() {
    this.startAction();
    const variables = { input: this.getInput() };

    try {
      const response = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'report');
      this.set('model', response);
    } catch (e) {
      this.get('graphErrors').show(e);
    } finally {
      this.endAction();
    }
  },

  actions: {
    setDates({ start, end }) {
      this.setProperties({
        start: moment(start).startOf('day'),
        end: moment(end).endOf('day'),
      });
    },
    reset() {
      this.setProperties({
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        publishers: [],
        deployments: [],
        adunits: [],
        advertisers: [],
        orders: [],
        lineitems: [],
        model: null,
      });
    },
    update() {
      this.execute();
    },
  }
});
