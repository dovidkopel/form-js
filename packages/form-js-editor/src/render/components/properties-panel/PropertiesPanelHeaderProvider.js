import {
  textToLabel
} from './Util';

import { iconsByType } from '../icons';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  checklist: 'CHECKLIST',
  columns: 'COLUMNS',
  default: 'FORM',
  number: 'NUMBER',
  radio: 'RADIO',
  select: 'SELECT',
  taglist: 'TAGLIST',
  text: 'TEXT',
  textfield: 'TEXT FIELD',
};

export const PropertiesPanelHeaderProvider = {

  getElementLabel: (field) => {
    const {
      type
    } = field;

    if (type === 'text') {
      return textToLabel(field.text);
    }

    if (type === 'default') {
      return field.id;
    }

    return field.label;
  },

  getElementIcon: (field) => {
    const {
      type
    } = field;

    const Icon = iconsByType[type];

    if (Icon) {
      return () => <Icon width="36" height="36" viewBox="0 0 54 54" />;
    }
  },

  getTypeLabel: (field) => {
    const {
      type
    } = field;

    return labelsByType[type];
  }
};