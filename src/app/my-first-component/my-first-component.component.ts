import { Component,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/ApiService';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
// import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentNodeSelectorComponentData } from '../Classes/ContentTypeInterface';
import { Subject } from 'rxjs';
import { DocumentActionsService, ContentTypeService } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-my-first-component',
  templateUrl: './my-first-component.component.html',
  styleUrls: ['./my-first-component.component.css']
})

export class MyFirstComponentComponent {
  @ViewChild('documentList')
  documentList: DocumentListComponent;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  constructor(private apiService: ApiService, private contentservice: ContentTypeService,private notificationService: NotificationService,private _formBuilder: FormBuilder) { }
  ngOnInit() {
    this.getcontenttypelist();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
   isShown: boolean = false;
  // checked: boolean = false;

  form = new FormGroup({
    contenttype: new FormControl('', Validators.required)
  });

  get f() {
    return this.form.controls;
  }
  changecontenttype(event) {
    let entry = event.value.entry;
     this.isShown = true;
    // this.checked = true;
  }
  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
   // this.documentList.reload();
  }

  listcontentdatas: any;
  getcontenttypelist() {
    var nodetype = "cm:content";
    this.contentservice.getContentTypeChildren(nodetype)
      .subscribe(
        res => {
          this.listcontentdatas = res;
        },
        err => {
          console.log('Error occured while searching data');
        }
      );
  }
};



