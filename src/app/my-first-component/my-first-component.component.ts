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
import { FileViewComponent } from '../file-view/file-view.component';
import { MetadataComponentComponent } from '../metadata-component/metadata-component.component';
import { ContentMetadataComponent } from '@alfresco/adf-content-services';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { NodesApiService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';

@Component({
  selector: 'app-my-first-component',
  templateUrl: './my-first-component.component.html',
  styleUrls: ['./my-first-component.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})

export class MyFirstComponentComponent {
  //@Output() onDataChange: EventEmitter<ItemType> = new EventEmitter();
  @Input() node: Node;
  // @Input() data:string;
  nodeId: string;
  nodedata: Node;


  @ViewChild('documentList')
  documentList: DocumentListComponent;

  selectedcontenttype: string;
  ischeckboxevent: boolean;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = true;
  showuploaddialog = false;
  //nodeId: string = null;
  constructor(private apiService: ApiService, private contentservice: ContentTypeService, private notificationService: NotificationService, private _formBuilder: FormBuilder, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute,
    private nodeApiService: NodesApiService) { }

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    // this.documentList.reload();
  }
  onUploadFiles(event) {
    let entry = event.value;
    console.log(entry);
    this.showuploaddialog = true;
    this.uploadSuccess(event);
  }
  onUploadFilescall(e: CustomEvent) {
    console.log(e.detail.files);
  }
  onBeginUpload(event: UploadFilesEvent) {
    const files = event.files || [];

    if (files.length >= 1) {
      event.pauseUpload();
      // this.nodeApiService.getNodeMetadata(files[0].id).subscribe(
      //   (node) => {
      //     if (node) {
      //       this.nodeId = files[0].id;
      //       return;
      //     }
      //   },
      // );
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
  ngOnInit() {
    const id = this.nodeId;
    if (id) {
      this.nodeApiService.getNode(id).subscribe(
        (node) => {
          if (node) {
            this.nodeId = id;
            //  this.nodedata = node;
            return;
          }
        },
      );
    }


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


  lstproperties: any = [];
  openDialog() {
    const dialogRef = this.dialog.open(
      // MetadataComponentComponent,
      //FileViewComponent,
      ContentMetadataComponent,
      {
        data: {
          preset: "*",
          node: this.node,
          editable: true
        },
        width: '700px',
        height: '800px'
      }
    );
    dialogRef.componentInstance.node = this.node;
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
    if (this.listcontentdatas.length != 0) {
      for (let i = 0; i < this.listcontentdatas.length; i++) {
        if (this.selectedcontenttype == this.listcontentdatas[i].entry.id) {
          console.log(this.properties = this.listcontentdatas[i].entry.properties);
          this.listofproperties = this.properties;
        }
      }
    }
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



