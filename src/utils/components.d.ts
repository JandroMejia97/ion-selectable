import { IonSelectable } from "@ion-selectable/components/ion-selectable/ion-selectable.component";
import { IonSelectableOption } from "@ion-selectable/components/ion-selectable-option/ion-selectable-option.component";

declare global {
    interface HTMLIonSelectableElement extends IonSelectable, HTMLElement {
    }
    var HTMLIonSelectableElement: {
        prototype: HTMLIonSelectableElement;
        new (): HTMLIonSelectableElement;
    };

    /*interface HTMLIonSelectableOptionElement extends IonSelectableOption, HTMLElement {
    }
    var HTMLIonSelectableOptionElement: {
        prototype: HTMLIonSelectableOptionElement;
        new (): HTMLIonSelectableOptionElement;
    };*/

    interface HTMLElementTagNameMap {
        'ion-selectable': HTMLIonSelectableElement,
        // 'ion-selectable-option': HTMLIonSelectableOptionElement
    }
}