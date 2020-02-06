import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

const createCode = ({
  hostname,
  id,
  width,
  height,
}) => `
<a
  href="https://${hostname}/click/${id}?date=[current-date]&rand=[random-number]&email=[email-merge-var]&send=[deployment-or-send-var]"
  target="_blank"
  rel="noopener"
>
  <img
    src="https://${hostname}/image/${id}?date=[current-date]&rand=[random-number-that-matches-the-link]&email=[email-merge-var]&send=[deployment-or-send-var"
    width="${width}"
    height="${height}"
    alt="
    border="0"
  >
</a>
`;

export default Component.extend({
  user: inject(),

  tagName: 'code',

  accountKey: computed('user.session.data.authenticated.session.accountKey', function() {
    return this.get('user.session.data.authenticated.session.accountKey');
  }),

  code: computed('adunitId', 'width', 'height', 'deliveryHostname', function() {
    return createCode({
      id: this.get('adunitId'),
      width: this.get('width'),
      height: this.get('height'),
      hostname: this.get('deliveryHostname') || `${this.get('accountKey')}.serve.email-x.io`,
    });
  }),
});
