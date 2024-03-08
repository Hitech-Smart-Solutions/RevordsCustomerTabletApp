import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NewMemberPage } from './NewMember.page';

describe('NewMemberPage', () => {
  let component: NewMemberPage;
  let fixture: ComponentFixture<NewMemberPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMemberPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
