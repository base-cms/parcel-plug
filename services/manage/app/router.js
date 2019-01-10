import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('manage', { path: '' }, function() {
    this.route('advertisers', function() {
      this.route('create');
      this.route('edit', { path: ':id' });
    });
    this.route('deployments', function() {
      this.route('create');
      this.route('edit', { path: ':id' });
    });
    this.route('publishers', function() {
      this.route('create');
      this.route('edit', { path: ':id' });
    });
    this.route('adunits', function() {
      this.route('create');
      this.route('edit', { path: ':id' });
    });
    this.route('orders', function() {
      this.route('create');
      this.route('edit', { path: ':id' });
    });
    this.route('lineitems', function() {
      this.route('edit', { path: ':id' });
    });
  });
  this.route('login');
  this.route('logout');
});

export default Router;
