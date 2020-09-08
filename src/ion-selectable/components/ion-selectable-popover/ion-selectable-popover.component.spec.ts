import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonSelectablePopover } from './ion-selectable-popover.component';

describe('IonSelectablePopoverComponent', () => {
  let component: IonSelectablePopover;
  let fixture: ComponentFixture<IonSelectablePopover>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonSelectablePopover ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonSelectablePopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
