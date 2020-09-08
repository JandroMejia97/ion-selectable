import { IonSelectableOption } from '@ion-selectable/components/ion-selectable-option/ion-selectable-option.component';

export const findItemLabel = <T>(componentEl: HTMLElement) => {
    const itemEl = findItem<T>(componentEl);
    if (itemEl) {
      return itemEl.querySelector<HTMLIonLabelElement>('ion-label');
    }
    return null;
};

export const findItem = <T>(componentEL: HTMLElement) => {
  return componentEL.closest('ion-item');
};
