import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import { NgModule, Injector, DoBootstrap } from '@angular/core';

import { IonSelectable } from './components/ion-selectable/ion-selectable.component';
import { IonSelectableModal } from './components/ion-selectable-modal/ion-selectable-modal.component';
import { IonSelectableOption } from './components/ion-selectable-option/ion-selectable-option.component';
import { IonSelectablePopover } from './components/ion-selectable-popover/ion-selectable-popover.component';
import { SelectableValueAccessor } from './directives/selectable-value-accessor/selectable-value-accessor.directive';

@NgModule({
  declarations: [
    IonSelectable,
    IonSelectableModal,
    IonSelectableOption,
    IonSelectablePopover,
    SelectableValueAccessor,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    IonSelectable,
    IonSelectableOption
  ],
  bootstrap: [
    IonSelectable,
    IonSelectableOption
  ]
})
export class IonSelectableModule implements DoBootstrap {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const selectEl = createCustomElement(IonSelectable, { injector: this.injector });
    if (!customElements.get('ion-selectable')) {
      customElements.define('ion-selectable', selectEl);
    }
    const selectOptionEl = createCustomElement(IonSelectableOption, { injector: this.injector });
    if (!customElements.get('ion-selectable-option')) {
      customElements.define('ion-selectable-option', selectOptionEl);
    }
  }
}
