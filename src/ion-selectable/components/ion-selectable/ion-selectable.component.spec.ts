import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonSelectable } from './ion-selectable.component';

describe('IonSelectable', () => {
  let component: IonSelectable;
  let fixture: ComponentFixture<IonSelectable>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonSelectable ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonSelectable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
