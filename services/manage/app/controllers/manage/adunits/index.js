import ListController from '../../abstract-list';

export default ListController.extend({
  init() {
    this._super(...arguments);
    this.set('sortOptions', [
      { key: 'updatedAt', label: 'Updated' },
      { key: 'name', label: 'Name' },
    ]);
    this.set('field', 'updatedAt');
    this.set('order', 'desc');

    this.set('searchFields', [
      { key: 'name', label: 'Name' },
      { key: 'deploymentName', label: 'Deployment Name' },
      { key: 'size', label: 'Size' },
    ]);
    this.set('searchBy', 'name');
  },
});
