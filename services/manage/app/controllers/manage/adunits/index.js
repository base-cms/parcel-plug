import ListController from '../../abstract-list';

export default ListController.extend({
  init() {
    this._super(...arguments);
    this.set('sortOptions', [
      { key: 'id', label: 'ID' },
      { key: 'createdAt', label: 'Created' },
      { key: 'updatedAt', label: 'Updated' },
      { key: 'name', label: 'Name' },
      { key: 'size', label: 'Size' },
      { key: 'deploymentName', label: 'Deployment Name' },
      { key: 'publisherName', label: 'Publisher Name' },
    ]);
    this.set('field', 'updatedAt');
    this.set('order', 'desc');

    this.set('searchFields', [
      { key: 'name', label: 'Name' },
      { key: 'size', label: 'Size' },
      { key: 'deploymentName', label: 'Deployment Name' },
      { key: 'publisherName', label: 'Publisher Name' },
    ]);
    this.set('searchBy', 'name');
  },
});
