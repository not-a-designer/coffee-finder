import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueDetailsCardComponent } from './venue-details-card.component';

describe('VenueDetailsCardComponent', () => {
  let component: VenueDetailsCardComponent;
  let fixture: ComponentFixture<VenueDetailsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueDetailsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
