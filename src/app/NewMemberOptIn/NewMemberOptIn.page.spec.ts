import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NewMemberOptInPage } from './NewMemberOptIn.page';

describe('NewMemberOptInPage', () => {
  let component: NewMemberOptInPage;
  let fixture: ComponentFixture<NewMemberOptInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMemberOptInPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMemberOptInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
