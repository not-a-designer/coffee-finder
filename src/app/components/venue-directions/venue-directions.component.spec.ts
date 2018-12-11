import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueDirectionsComponent } from './venue-directions.component';

describe('VenueDirectionsComponent', () => {
  let component: VenueDirectionsComponent;
  let fixture: ComponentFixture<VenueDirectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueDirectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
