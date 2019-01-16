import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import ValidityMixin from './mixins/validity';
import OnInsertMixin from './mixins/on-insert';

export default Component.extend(OnInsertMixin, ValidityMixin, {
  tagName: 'input',
  type: 'file',
  attributeBindings: [
    'name',
    'disabled',
    'readonly',
    'form',
    'type',
    'accept',
    'autofocus',
    'required',
    'multiple',
  ],
  multiple: false,

  change(event) {
    const input = event.target;
    if (!isEmpty(input.files)) {
      this.get('on-files-changed')(input.files);
    }
  }
});
