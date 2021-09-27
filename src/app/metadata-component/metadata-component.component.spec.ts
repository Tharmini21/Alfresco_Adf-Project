import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataComponentComponent } from './metadata-component.component';

describe('MetadataComponentComponent', () => {
  let component: MetadataComponentComponent;
  let fixture: ComponentFixture<MetadataComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
