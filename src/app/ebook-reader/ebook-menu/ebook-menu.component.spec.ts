import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbookMenuComponent } from './ebook-menu.component';

describe('EbookMenuComponent', () => {
  let component: EbookMenuComponent;
  let fixture: ComponentFixture<EbookMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbookMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbookMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
