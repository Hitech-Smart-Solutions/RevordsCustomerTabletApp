import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RevordSummaryPage } from './revord-summary.page';

describe('RevordSummaryPage', () => {
  let component: RevordSummaryPage;
  let fixture: ComponentFixture<RevordSummaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RevordSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
