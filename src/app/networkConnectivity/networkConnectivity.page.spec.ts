import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NetworkConnectivityPage } from './networkConnectivity.page';

describe('NetworkConnectivityPage', () => {
  let component: NetworkConnectivityPage;
  let fixture: ComponentFixture<NetworkConnectivityPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkConnectivityPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkConnectivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
