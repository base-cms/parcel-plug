import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  autocomplete: inject(),
  classNames: ['form-group', 'col-sm-6', 'col-md-4'],
  id: computed('modelName', function() {
    return `model-filter-${this.get('modelName')}`;
  }),
  label: computed('modelName', function() {
    const name = this.get('modelName');
    return `${name[0].toUpperCase()}${name.slice(1)}`;
  }),
  actions: {
    search(phrase) {
      return this.get('autocomplete').query(this.get('modelName'), phrase);
    }
  }
});
