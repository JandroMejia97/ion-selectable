import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonSelectableModal } from './ion-selectable-modal.component';

describe('IonSelectableModal', () => {
  let component: IonSelectableModal;
  let fixture: ComponentFixture<IonSelectableModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonSelectableModal ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonSelectableModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
