import { SelectPopoverOption } from '@ionic/core';
import { Component, OnInit, Input } from '@angular/core';

import { safeCall, isCancel } from 'src/utils/overlays';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ion-selectable-modal',
  templateUrl: './ion-selectable-modal.component.html',
  styleUrls: ['./ion-selectable-modal.component.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class IonSelectableModal implements OnInit {
  /** The mode determines which platform styles to use */
  @Input() mode: 'ios' | 'md' = 'md';
  /**
   * The color to use from your application's color palette. Default options are:
   * "primary", "secondary", "tertiary", "success", "warning", "danger", "light",
   * "medium", and "dark".
   */
  @Input() color = 'primary';
  /** Input location */
  @Input() slot: 'start' | 'end' = 'end';

  /** Header text for the popover */
  @Input() header?: string;

  /** Subheader text for the popover */
  @Input() subHeader?: string;

  /** Text for popover body */
  @Input() message?: string;

  /** If true, the select can accept multiple values */
  @Input() multiple = false;

  /** Array of options for the popover */
  @Input() options: SelectPopoverOption[] = [];

  /** The text to display on the ok button */
  @Input() okText = 'OK';

  /** The text to display on the cancel button. */
  @Input() cancelText = 'Cancel';

  checkedOption: SelectPopoverOption;
  checkedValue: string;

  constructor() { }

  cancelSelection() {
    this.options.forEach(o => o.checked = false);
    this.dismissPopover('canceled');
  }

  async dismissPopover(reason: string) {
    const {options} = this;
    console.log({options});
  }

  onSelect(ev: any) {
    if (this.multiple) {
      const options = this.options.find(o => o.checked);
      safeCall(options[0].handler);
    } else {
      const option = this.options.find(o => o.value === ev.value);
      if (option) {
        safeCall(option.handler);
      }
    }
  }

  ngOnInit() {
    this.checkedOption = this.options.find(o => o.checked);
    this.checkedValue = this.checkedOption ? this.checkedOption.value : undefined;
  }

  /*
  private buttonClick(button: AlertButton) {
    const role = button.role;
    const values = this.getValues();
    if (isCancel(role)) {
      return this.dismiss({ values }, role);
    }
    const returnData = this.callButtonHandler(button, values);
    if (returnData !== false) {
      return this.dismiss({ values, ...returnData }, button.role);
    }
    return Promise.resolve(false);
  }

  private callButtonHandler(button: AlertButton | undefined, data?: any) {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const returnData = safeCall(button.handler, data);
      if (returnData === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
      if (typeof returnData === 'object') {
        return returnData;
      }
    }
    return {};
  }

  private getValues(): any {
    if (this.options.length === 0) {
      // this is an alert without any options/inputs at all
      return undefined;
    }
    return this.options.filter(i => i.checked).map(i => i.value);
  }

  dismiss(data?: any, role?: string): Promise<boolean> {
    // return dismiss(this, data, role, 'alertLeave', iosLeaveAnimation, mdLeaveAnimation);
    return Promise.resolve(true);
  }*/

}

