import {
  Host,
  Input,
  Component,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ion-selectable-option',
  template: ``,
  styleUrls: ['./ion-selectable-option.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
// tslint:disable-next-line: component-class-suffix
export class IonSelectableOption implements AfterViewInit {
  private static selectOptionIds = 0;
  private inputId = `ion-selec-opt-${IonSelectableOption.selectOptionIds++}`;
  /**
   * If true, the user cannot interact with the select option.
   * This property does not apply when interface="action-sheet" as
   * ion-action-sheet does not allow for disabled buttons.
   */
  @Input() disabled = false;
  /**
   * The text value of the option.
   */
  @Input() value: any;

  mode: 'ios' | 'md' = 'md';

  constructor(
    private renderer: Renderer2,
    @Host() private el: ElementRef,
  ) { }

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    this.renderer.setAttribute(element, 'role', 'option');
    this.renderer.setAttribute(element, 'id', `${this.inputId}`);
    this.renderer.addClass(element, `${this.mode}`);
  }

  get textContent() {
    return this.el.nativeElement.textContent;
  }

  get classList() {
    return this.el.nativeElement.classList;
  }

}

