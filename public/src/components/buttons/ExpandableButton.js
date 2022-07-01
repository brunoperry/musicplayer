import Button from './Button.js';

export default class ExpandableButton extends Button {
  constructor(data) {
    super(Utils.getButton('expandable'));
  }
}
