import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBooksMenuComponent } from './my-books-menu.component';

describe('MyBooksMenuComponent', () => {
  let component: MyBooksMenuComponent;
  let fixture: ComponentFixture<MyBooksMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBooksMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBooksMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
