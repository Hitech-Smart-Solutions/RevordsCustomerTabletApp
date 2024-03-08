import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CustomerDetailsPage } from './customer-details.page';

describe('CustomerDetailsPage', () => {
  let component: CustomerDetailsPage;
  let fixture: ComponentFixture<CustomerDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
