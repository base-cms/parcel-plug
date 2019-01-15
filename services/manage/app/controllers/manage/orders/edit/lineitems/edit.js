import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: inject(),

  adsDropdownClass: computed('router.currentRouteName', function() {
    if (this.get('router.currentRouteName').indexOf('manage.orders.edit.lineitems.edit.ad') === 0) {
      return 'active';
    }
    return '';
  }),
});
