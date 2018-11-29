import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsenseBannerComponent } from './adsense-banner.component';

describe('AdsenseBannerComponent', () => {
  let component: AdsenseBannerComponent;
  let fixture: ComponentFixture<AdsenseBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsenseBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsenseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
