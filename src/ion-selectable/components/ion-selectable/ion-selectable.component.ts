import {
  Input,
  Output,
  OnInit,
  OnChanges,
  Component,
  ViewChild,
  OnDestroy,
  Renderer2,
  QueryList,
  ElementRef,
  EventEmitter,
  HostListener,
  AfterViewInit,
  ContentChildren,
  ViewEncapsulation,
  SimpleChanges,
} from '@angular/core';
import {
  AlertInput,
  AlertOptions,
  ModalOptions,
  OverlaySelect,
  PopoverOptions,
  StyleEventDetail,
  ActionSheetButton,
  ActionSheetOptions,
} from '@ionic/core';

import {
  AlertController,
  ModalController,
  PopoverController,
  ActionSheetController,
} from '@ionic/angular';

import {
  SelectableInterface,
  SelectableCompareFn,
  SelectablePopoverOption,
  SelectableChangeEventDetail
} from '../../intefaces/selectable.interface';
import { watchForOptions } from 'src/utils/watch-options';
import { findItemLabel, findItem } from 'src/utils/helpers';
import { IonSelectablePopover } from '../ion-selectable-popover/ion-selectable-popover.component';
import { IonSelectableOption } from '../../components/ion-selectable-option/ion-selectable-option.component';
import { IonSelectableModal } from '../ion-selectable-modal/ion-selectable-modal.component';

const OPTION_CLASS = 'select-interface-option';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ion-selectable',
  templateUrl: './ion-selectable.component.html',
  styleUrls: ['./ion-selectable.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
// tslint:disable-next-line: component-class-suffix
export class IonSelectable implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private static selectIds = 0;
  private isExpanded = false;
  private overlay?: OverlaySelect;
  private didInit = false;
  private mutationO?: MutationObserver;

  @ViewChild('button')
  private buttonEl?: HTMLButtonElement;
  private inputId = `ion-select-${IonSelectable.selectIds++}`;
  @ContentChildren(IonSelectableOption)
  private options!: QueryList<IonSelectableOption>;

  protected selectTextClasses: any = {};

  /**
   * The text to display on the cancel button.
   */
  @Input() cancelText = 'Cancel';
  /**
   * A property name or function used to compare object values
   */
  @Input()
  compareWith: SelectableCompareFn | null | string | undefined;
  /**
   * If true, the user cannot interact with the select.
   */
  // tslint:disable-next-line: no-input-rename
  @Input('disabled') disabled = false;
  /**
   * The interface the select should use: action-sheet, popover, modal or alert.
   */
  @Input() interface: SelectableInterface;
  /**
   * Any additional options that the alert, action-sheet or popover
   * interface can take. See the ion-alert docs, the ion-action-sheet
   * docs and the ion-popover docs for the create options for each interface.
   * Note: interfaceOptions will not override inputs or buttons with the alert interface.
   */
  @Input() interfaceOptions: any = {};
  /**
   * The mode determines which platform styles to use.
   */
  @Input() mode: 'ios' | 'md' = 'md';
  /**
   * If true, the select can accept multiple values.
   */
  @Input() multiple = false;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @Input() name = `${this.inputId}`;
  /**
   * The text to display on the ok button.
   */
  @Input() okText = 'OK';
  /**
   * The text to display when the select is empty.
   */
  // tslint:disable-next-line: no-input-rename
  @Input('placeholder') placeholder: string | undefined | null;
  /**
   * The text to display instead of the selected option's value.
   */
  @Input() selectedText: string | undefined | null;
  /**
   * The value of the select.
   */
  // tslint:disable-next-line: no-input-rename
  @Input('value') value: string | number | any;

  /**
   * Emitted when the select loses focus.
   */
  @Output() ionBlur = new EventEmitter<void>();
  /**
   * Emitted when the selection is cancelled.
   */
  @Output() ionCancel = new EventEmitter<void>();
  /**
   * Emitted when the value has changed.
   */
  @Output() ionChange = new EventEmitter<SelectableChangeEventDetail>();
  /**
   * Emitted when the select has focus.
   */
  @Output() ionFocus = new EventEmitter<void>();
  /**
   * Emitted when the styles change.
   * @internal
   */
  @Output() ionStyle = new EventEmitter<StyleEventDetail>();

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef<HTMLElement>,
    private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit() {
    this.disabled = !(this.disabled === false);
    this.multiple = !(this.multiple === false);
    this.renderElements();
  }

  ngOnDestroy() {
    this.componentDidLoad();
    this.disconnectedCallback();
  }

  ngAfterViewInit() {
    this.connectedCallback();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGES');
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'disabled' || 'placeholder':
            this.disabledChanged();
            break;
          case 'value':
            this.valueChanged();
            break;
        }
      }
    }
  }

  renderElements() {
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel<HTMLIonLabelElement>(this.el);
    if (label) {
      label.id = labelId;
    }

    let addPlaceholderClass = false;
    if (this.selectedText === '' && this.placeholder != null) {
      this.selectedText = this.placeholder;
      addPlaceholderClass = true;
    }
    this.selectTextClasses = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };

    const textPart = addPlaceholderClass ? 'placeholder' : 'text';
    this.renderer.addClass(this.el, 'hydrated');
    this.renderer.addClass(this.el, `${this.mode}`);
    this.renderer.addClass(this.el, this.disabled ? 'select-disabled' : null);
    this.renderer.setAttribute(this.el, 'role', 'listbox');
    this.renderer.setAttribute(this.el, 'aria-haspopup', 'dialog');
    this.renderer.setAttribute(this.el, 'aria-labelledby', labelId);
    this.renderer.setAttribute(this.el, 'aria-expanded', `${this.isExpanded}`);
    this.renderer.setAttribute(this.el, 'aria-disabled', `${this.disabled}`);
    this.renderer.setProperty(this.el, 'class', {
      'in-item': true,
      [this.mode]: true,
      'ripple-parent': true,
      'ion-activatable': true,
      'select-disabled': this.disabled,
    });
    const itemEl = findItem<HTMLIonItemElement>(this.el);
    if (itemEl) {
      this.renderer.addClass(this.el, 'in-item');
      this.renderer.addClass(itemEl, 'item-select');
      this.renderer.addClass(itemEl, 'item-has-value');
      this.renderer.addClass(itemEl, 'ion-activatable');
      this.renderer.addClass(itemEl, 'item-interactive');
      this.renderer.addClass(itemEl, this.disabled ? 'item-select-disabled' : null);
      this.renderer.addClass(itemEl, this.disabled ? 'item-interactive-disabled' : null);
    }
  }

  disabledChanged() {
    this.emitStyle();
  }

  valueChanged() {
    this.emitStyle();
    if (this.didInit) {
      this.ionChange.emit({
        value: this.value,
      });
    }
  }

  async connectedCallback() {
    this.updateOverlayOptions();
    this.emitStyle();

    this.mutationO = watchForOptions<HTMLElement>(this.el, 'ion-selectable-option', async () => {
      this.updateOverlayOptions();
    });
  }

  disconnectedCallback() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = undefined;
    }
  }

  componentDidLoad() {
    this.didInit = true;
  }

  async open(event?: UIEvent): Promise<any> {
    if (this.disabled || this.isExpanded) {
      return undefined;
    }
    const overlay = this.overlay = await this.createOverlay(event);
    this.isExpanded = true;
    overlay.onDidDismiss().then(() => {
      this.overlay = undefined;
      this.isExpanded = false;
      this.setFocus();
    });
    await overlay.present();
    return overlay;
  }

  private createOverlay(ev?: UIEvent): Promise<OverlaySelect> {
    let selectInterface = this.interface;
    if ((selectInterface === 'action-sheet') && this.multiple) {
      console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover' && !ev) {
      console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }

    if (selectInterface === 'popover') {
      return this.openPopover(ev);
    }
    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    if (selectInterface === 'modal') {
      return this.openModal() as unknown as Promise<OverlaySelect>;
    }
    return this.openAlert();
  }

  private updateOverlayOptions(): void {
    const overlay = (this.overlay as any);
    if (!overlay) {
      return;
    }
    const childOpts = this.childOpts;
    const value = this.value;
    switch (this.interface) {
      case 'action-sheet':
        overlay.buttons = this.createActionSheetButtons(childOpts, value);
        break;
      case 'popover':
        const popover = overlay.querySelector('ion-select-popover');
        if (popover) {
          popover.options = this.createPopoverOptions(childOpts, value);
        }
        break;
      case 'alert':
        const inputType = (this.multiple ? 'checkbox' : 'radio');
        overlay.inputs = this.createAlertInputs(childOpts, inputType, value);
        break;
      case 'modal':
        overlay.options = this.createPopoverOptions(childOpts, value);
        break;
    }
  }

  private createActionSheetButtons(data: IonSelectableOption[], selectValue: any): ActionSheetButton[] {
    const actionSheetButtons = data.map(option => {
      const value = this.getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        role: (this.isOptionSelected(value, selectValue, this.compareWith) ? 'selected' : ''),
        text: option.textContent,
        cssClass: optClass,
        handler: () => {
          this.value = value;
        }
      } as ActionSheetButton;
    });

    // Add "cancel" button
    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      }
    });

    return actionSheetButtons;
  }

  private createAlertInputs(data: IonSelectableOption[], inputType: 'checkbox' | 'radio', selectValue: any): AlertInput[] {
    const alertInputs = data.map(option => {
      const value = this.getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        type: inputType,
        cssClass: optClass,
        label: option.textContent || '',
        value,
        checked: this.isOptionSelected(value, selectValue, this.compareWith),
        disabled: option.disabled
      };
    });
    return alertInputs;
  }

  private createPopoverOptions(data: IonSelectableOption[], selectValue: any): SelectablePopoverOption[] {
    const popoverOptions = data.map(option => {
      const value = this.getOptionValue(option);

      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;

      return {
        text: option.textContent || '',
        cssClass: optClass,
        value,
        checked: this.isOptionSelected(value, selectValue, this.compareWith),
        disabled: option.disabled,
        handler: (obtainValue?: any) => {
          this.value = obtainValue || value;
          this.close();
        }
      };
    });

    return popoverOptions;
  }

  private async openPopover(ev: UIEvent) {
    const { mode, value, multiple, okText, cancelText, interfaceOptions } = this;
    const popoverOpts: PopoverOptions = {
      mode,
      ...interfaceOptions,
      component: IonSelectablePopover,
      cssClass: ['select-popover', interfaceOptions.cssClass],
      event: ev,
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value,
        okText,
        multiple,
        cancelText,
        options: this.createPopoverOptions(this.childOpts, value)
      }
    };
    return this.popoverController.create(popoverOpts);
  }

  private async openModal() {
    const { mode, value, multiple, okText, cancelText, interfaceOptions } = this;
    const popoverOpts: ModalOptions = {
      mode,
      ...interfaceOptions,
      component: IonSelectableModal,
      cssClass: ['select-popover', interfaceOptions.cssClass],
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value,
        okText,
        multiple,
        cancelText,
        options: this.createPopoverOptions(this.childOpts, value)
      }
    };
    return this.modalController.create(popoverOpts);
  }

  private async openActionSheet() {
    const mode = this.mode;
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts: ActionSheetOptions = {
      mode,
      ...interfaceOptions,

      buttons: this.createActionSheetButtons(this.childOpts, this.value),
      cssClass: ['select-action-sheet', interfaceOptions.cssClass]
    };
    return this.actionSheetController.create(actionSheetOpts);
  }

  private async openAlert() {
    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;

    const interfaceOptions = this.interfaceOptions;
    const inputType = (this.multiple ? 'checkbox' : 'radio');
    const mode = this.mode;

    const alertOpts: AlertOptions = {
      mode,
      ...interfaceOptions,
      header: interfaceOptions.header ? interfaceOptions.header : labelText,
      inputs: this.createAlertInputs(this.childOpts, inputType, this.value),
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.value = selectedValues;
          }
        }
      ],
      cssClass: [
        'select-alert',
        interfaceOptions.cssClass,
        (this.multiple ? 'multiple-select-alert' : 'single-select-alert')
      ]
    };
    return this.alertController.create(alertOpts);
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<boolean> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }

  private getLabel() {
    return findItemLabel(this.el);
  }

  private hasValue(): boolean {
    return this.text !== '';
  }

  private get childOpts() {
    return Array.from<IonSelectableOption>(this.options);
  }

  get text(): string {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return this.generateText(this.childOpts, this.value, this.compareWith);
  }

  isOptionSelected = (currentValue: any[] | any, compareValue: any, compareWith?: string | SelectableCompareFn | null) => {
    if (currentValue === undefined) {
      return false;
    }
    if (Array.isArray(currentValue)) {
      return currentValue.some(val => this.compareOptions(val, compareValue, compareWith));
    } else {
      return this.compareOptions(currentValue, compareValue, compareWith);
    }
  }

  getOptionValue = (el: IonSelectableOption) => {
    const value = el.value;
    return (value === undefined)
      ? el.textContent || ''
      : value;
  }

  parseValue = (value: any) => {
    if (value == null) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value.toString();
  }

  compareOptions = (currentValue: any, compareValue: any, compareWith?: string | SelectableCompareFn | null): boolean => {
    if (typeof compareWith === 'function') {
      return compareWith(currentValue, compareValue);
    } else if (typeof compareWith === 'string') {
      return currentValue[compareWith] === compareValue[compareWith];
    } else {
      return Array.isArray(compareValue) ? compareValue.includes(currentValue) : currentValue === compareValue;
    }
  }

  generateText = (opts: IonSelectableOption[], value: any | any[], compareWith?: string | SelectableCompareFn | null) => {
    if (value === undefined) {
      return '';
    }
    if (Array.isArray(value)) {
      return value
        .map(v => this.textForValue(opts, v, compareWith))
        .filter(opt => opt !== null)
        .join(', ');
    } else {
      return this.textForValue(opts, value, compareWith) || '';
    }
  }

  textForValue = (opts: IonSelectableOption[], value: any, compareWith?: string | SelectableCompareFn | null): string | null => {
    const selectOpt = opts.find(opt => {
      return this.compareOptions(this.getOptionValue(opt), value, compareWith);
    });
    return selectOpt
      ? selectOpt.textContent
      : null;
  }

  private emitStyle() {
    this.ionStyle.emit({
      interactive: true,
      select: true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
      'select-disabled': this.disabled
    });
  }

  private setFocus() {
    if (this.buttonEl) {
      this.buttonEl.focus();
    }
  }

  @HostListener('click', ['$event'])
  protected onClick = (ev: UIEvent) => {
    this.setFocus();
    this.open(ev);
  }
  protected onFocus = () => {
    this.ionFocus.emit();
  }

  protected onBlur = () => {
    this.ionBlur.emit();
  }

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

}
