import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareBookComponent } from './share-book.component';

describe('ShareBookComponent', () => {
  let component: ShareBookComponent;
  let fixture: ComponentFixture<ShareBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareBookComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
