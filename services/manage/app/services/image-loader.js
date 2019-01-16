import Service, { inject } from '@ember/service';
import { Promise } from 'rsvp';

export default Service.extend({
  apollo: inject(),

  /**
   * @param {*} src
   */
  loadFromSource(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', reject);
      img.src = src
    });
  },
});
