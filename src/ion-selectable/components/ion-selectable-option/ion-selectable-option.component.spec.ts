import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonSelectableOption } from './ion-selectable-option.component';

describe('IonSelectableOption', () => {
  let component: IonSelectableOption;
  let fixture: ComponentFixture<IonSelectableOption>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonSelectableOption ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonSelectableOption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
