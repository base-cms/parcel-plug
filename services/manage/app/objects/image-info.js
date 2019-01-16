import EmberObject from '@ember/object';
import filesize from 'filesize';
import Fraction from 'fraction.js';
import { Promise } from 'rsvp';

const { round } = Math;

export default EmberObject.extend({
  file: null,
  isLoaded: false,

  init() {
    this._super(...arguments);
    const { name, size, type } = this.get('file') || {};
    // Set size to string to prevent large number issues.
    this.setProperties({ name, bytes: `${size}`, type });
  },

  async load() {
    if (this.get('isLoaded')) return;

    const file = this.get('file');
    if (!file) throw new Error('No file object was provided.');

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => {
        const { naturalWidth, naturalHeight } = img;
        this.set('width', naturalWidth);
        this.set('height', naturalHeight);
        URL.revokeObjectURL(img.src);
        this.set('isLoaded', true);
        resolve();
      });
      img.addEventListener('error', (e) => {
        this.set('isLoaded', true);
        reject(e);
      });
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Gets file dimensions in WxH format.
   *
   * @async
   */
  async dimensions() {
    await this.load();
    return `${this.get('width')}x${this.get('height')}`;
  },

  /**
   * The aspect ratio, as a non-rounded decimal.
   */
  async ratio() {
    await this.load();
    const height = this.get('height');
    const ratio = height > 0 ? this.get('width') / height : 0;
    return ratio;
  },

  /**
   * The aspect ratio, in "common" format, e.g. 21:9.
   */
  async aspectRatio() {
    const ratio = await this.ratio();
    const frac = Fraction(ratio);
    return frac.toFraction().replace('/', ':');
  },

  /**
   * The aspect ratio, as a rounded decimal, e.g. 1.67.
   */
  async ratioRounded() {
    const ratio = await this.ratio();
    return round(ratio * 100) / 100;
  },

  /**
   * The image orientation, e.g. Landscape, Portrait or Square.
   */
  async orientation() {
    const ratio = await this.ratio();
    const offset = .15;
    if (ratio < 1 - offset && ratio > 1) return 'Landscape (Leaning Square)';
    if (ratio > 1 - offset && ratio < 1) return 'Portrait (Leaning Square)';
    if (ratio > 1) return 'Landscape';
    if (ratio < 1) return 'Portrait';
    return 'Square';
  },

  /**
   * The formatted filesize.
   */
  async filesize() {
    const bytes = this.get('bytes');
    return filesize(bytes);
  },
});
