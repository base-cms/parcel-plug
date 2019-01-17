import Component from '@ember/component';
import ImageInfo from '@base-cms/parcel-plug-manage/objects/image-info';

export default Component.extend({
  classNames: ['form-group'],
  value: null,

  name: 'image',
  label: 'Image',

  accept: 'image/*',
  isLoading: false,

  actions: {
    async handleImage(props) {
      const { value: files } = props;

      const file = files[0];
      const info = ImageInfo.create({ file });
      await info.load();
      const fn = this.get('on-change');
      await fn({ ...props, value: file, info });
    },
  },
});
