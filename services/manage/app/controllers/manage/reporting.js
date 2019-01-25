import Controller from '@ember/controller';
import moment from 'moment';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@base-cms/parcel-plug-manage/mixins/action-mixin';
import query from '@base-cms/parcel-plug-manage/gql/queries/reporting/list';
import { computed } from '@ember/object';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  start: null,
  end: null,

  init() {
    this._super(...arguments);
    this.set('start', moment().startOf('week'));
    this.set('end', moment().endOf('week'));
    this.setProperties({
      publishers: [],
      deployments: [],
      adunits: [],
      advertisers: [],
      orders: [],
      lineitems: [],
    });
  },

  downloadUrl: computed('start', 'end', 'publishers', 'deployments', 'adunits', 'advertisers', 'orders', 'lineitems', function() {
    return `/reporting.csv?payload=${JSON.stringify(this.getInput())}`;
  }),

  getInput() {
    return {
      input: {
        start: parseInt(moment(this.get('start')).format('x')),
        end: parseInt(moment(this.get('end')).format('x')),
        publisherIds: this.get('publishers').map(v => v.id),
        deploymentIds: this.get('deployments').map(v => v.id),
        adunitIds: this.get('adunits').map(v => v.id),
        advertiserIds: this.get('advertisers').map(v => v.id),
        orderIds: this.get('orders').map(v => v.id),
        lineitemIds: this.get('lineitems').map(v => v.id),
      }
    };
  },

  async execute() {
    this.startAction();
    const variables = this.getInput();

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
      this.setProperties({ start, end });
    },
    reset() {
      this.setProperties({
        start: moment().startOf('week'),
        end: moment().endOf('week'),
        publishers: [],
        deployments: [],
        adunits: [],
        advertisers: [],
        orders: [],
        lineitems: [],
      });
      this.execute();
    },
    update() {
      this.execute();
    },
  }
});
