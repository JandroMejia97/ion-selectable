import { SelectPopoverOption } from '@ionic/core';
export type SelectableInterface = 'action-sheet' | 'alert' | 'popover' | 'modal';

export type SelectableCompareFn = (currentValue: any, compareValue: any) => boolean;

export interface SelectableChangeEventDetail<T = any> {
  value: T;
}

export interface SelectablePopoverOption extends SelectPopoverOption {
  handler?: (result?: any) => void;
}
