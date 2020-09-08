import { Directive, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectValueAccessor } from '@ionic/angular';
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-selectable',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectableValueAccessor,
      multi: true
    }
  ]
})
// tslint:disable-next-line: directive-class-suffix
export class SelectableValueAccessor extends SelectValueAccessor {

  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

}
