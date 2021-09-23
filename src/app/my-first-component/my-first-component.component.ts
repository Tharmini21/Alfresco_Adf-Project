import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/ApiService';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
// import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentNodeSelectorComponentData } from '../Classes/ContentTypeInterface';
import { Subject } from 'rxjs';
import { DocumentActionsService, ContentTypeService } from '@alfresco/adf-content-services';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { CardViewItem } from '../Classes/CartviewTextitem';
// import { CardViewBaseItemModel, DynamicComponentModel } from '@alfresco/adf-core';
import { CardViewTextItemModel } from '../cartview-textitem';
import { UploadFilesEvent, ConfirmDialogComponent } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-my-first-component',
  templateUrl: './my-first-component.component.html',
  styleUrls: ['./my-first-component.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})


// class CardViewStarDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
//   type: string = 'text';
//   inputType: string = 'text';
//   get displayValue(): string {
//     return (this.value);
//   }
// }
export class MyFirstComponentComponent {
  //@Output() onDataChange: EventEmitter<ItemType> = new EventEmitter();
  //@Input()
  //data: FormGroup;
  //@Input() data: {};
  // @Output() newItemEvent = new EventEmitter<string>();
  // addNewItem(value: string) {
  //   this.newItemEvent.emit(value);
  // }

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  // @ViewChild("stepper") stepperdata;
  //@ViewChild("stepper") stepperComponent: MatStepper;
  // @ViewChild("step1") stepOneComponent: MatStepper;
  // @ViewChild("step2") stepTwoComponent: StepTwoComponent;
  // @ViewChild("step3") stepThreeComponent: StepThreeComponent;

  // get frmStepOne() {
  //    return this.stepOneComponent ? this.stepOneComponent.frmStepOne : null;
  // }

  // get frmStepTwo() {
  //    return this.stepTwoComponent ? this.stepTwoComponent.frmStepTwo : null;
  // }

  // get frmStepThree() {
  //    return this.stepThreeComponent ? this.stepThreeComponent.frmStepThree : null;
  // }
  selectedcontenttype: string;
  ischeckboxevent: boolean;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = true;
  showuploaddialog = false;
  constructor(private apiService: ApiService, private contentservice: ContentTypeService, private notificationService: NotificationService, private _formBuilder: FormBuilder, private dialog: MatDialog) { }

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    // this.documentList.reload();
  }
  ngOnInit() {
    this.getcontenttypelist();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
    // this.thirdFormGroup = this._formBuilder.group({
    //   thirdCtrl: ['', Validators.required]
    // });
  }
  frmStepOne() { console.log(this.firstFormGroup.get('firstCtrl').value); return this.firstFormGroup.get('firstCtrl').value; }
  frmStepTwo() { console.log(this.firstFormGroup.get('secondCtrl').value); return this.secondFormGroup.get('secondCtrl'); }

  form = new FormGroup({
    contenttype: new FormControl('', Validators.required)
  });

  get f() {
    return this.form.controls;
  }

  // onUploadFiles(e: CustomEvent) {
  //   console.log(e.detail.files);
  // }
  onUploadFiles(event) {
    let entry = event.value;
    console.log(entry);
    // console.log(event);
    this.showuploaddialog = true;
    this.uploadSuccess(event);
  }
  onBeginUpload(event: UploadFilesEvent) {
    const files = event.files || [];

    if (files.length >= 1) {
      event.pauseUpload();

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Upload',
          message: `Are you sure you want to upload ${files.length} file(s)?`
        },
        minWidth: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          event.resumeUpload();
        }
      });
    }
  }
  checkboxevent(event) {
    let entry = event.checked;
    this.ischeckboxevent = entry;
  }
  listcontentdatas: any;
  newlstcontentdata: any = [];
  properties: any = [];
  listofproperties: any = [];

  changecontenttype(event) {
    this.frmStepOne();
    let entry = event.value;
    this.selectedcontenttype = entry;
    // this.lstcontentdata=this.getcontenttypelist();
    var nodetype = "cm:content";
    this.contentservice.getContentTypeChildren(nodetype)
      .subscribe(
        res => {
          this.newlstcontentdata = res;
          if (this.newlstcontentdata.length != 0) {
            for (let i = 0; i < this.newlstcontentdata.length; i++) {
              if (this.selectedcontenttype == this.newlstcontentdata[i].entry.id) {
                console.log(this.properties = this.newlstcontentdata[i].entry.properties);
                this.listofproperties = this.properties;
                // this.listofproperties = [
                //     new CardViewTextItemModel({
                //         label: this.properties.title,
                //         value: this.properties.id,
                //         key: this.properties.title,
                //         default: '',
                //         multiline: false,
                //         editable: true,
                //         clickable: true
                //     }),
                //     new CardViewTextItemModel({
                //         label: 'Rank',
                //         value: 'Captain',
                //         key: 'rank',
                //         default: 'No rank entered',
                //         multiline: false,
                //         editable: true,
                //         clickable: true
                //     })
                // ];

                // if(this.properties.length!=0)
                // {
                //   for (let i = 0; i < this.properties.length; i++) {
                //     this.listofproperties=new CardViewTextItemModel({
                //               label: this.properties[i].title,
                //               value: this.properties[i].id,
                //               key: this.properties[i].title,
                //               default: '',
                //               multiline: false,
                //               editable: true,
                //               clickable: true
                //           })
                //   }
                // }
              }
            }
          }
        },
        err => {
          console.log('Error occured while getting data');
        }
      );
  }
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



