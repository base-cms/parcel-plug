import Component from '@ember/component';
import ImageInfo from '@base-cms/parcel-plug-manage/objects/image-info';
import { inject } from '@ember/service';


export default Component.extend({
  imageLoader: inject(),

  accept: 'image/*',
  isLoading: false,

  sendEvent(name, ...args) {
    const fn = this.get(name);
    if (fn && typeof fn === 'function') return fn(...args);
  },

  actions: {
    async uploadImage(files) {
      this.sendEvent('onUploadStart');
      this.set('isLoading', true);
      this.set('error', null);

      try {
        const file = files[0];
        const info = ImageInfo.create({ file });
        await info.load();
        await this.sendEvent('upload', { file, info });
      } catch(e) {
        this.set('error', e);
        this.sendEvent('onUploadError', e);
      } finally {
        this.set('isLoading', false);
        this.sendEvent('onUploadEnd');
      }
    },
  },
});
