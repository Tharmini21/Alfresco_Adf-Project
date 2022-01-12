import { Component, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/ApiService';
import { FileUploadCompleteEvent, FileUploadErrorEvent, NotificationService, UploadService } from '@alfresco/adf-core';
// import {Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentNodeSelectorComponentData } from '../Classes/ContentTypeInterface';
import { Subject } from 'rxjs';
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
import { NodesApiService, CardViewUpdateService, CardViewBaseItemModel, UpdateNotification, AlfrescoApiService, FileModel } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { takeUntil, debounceTime, catchError, map } from 'rxjs/operators';
import { ContentMetadataService, DocumentListComponent, ContentTypeService, DocumentActionsService } from '@alfresco/adf-content-services';
import { empty } from '@apollo/client';

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
  nodevalue: Node;
  updatenodeversion: Node;
  nodeId: string;
  nodedata: Node;
  fileslist: any = [];
  successfileslist: any = [];
  errorfileslist: any = [];
  filesdetaillist: any = [];
  totalerrorfiles: number;
  totalCompletefiles: number;
  listnodedatas: any = [];
  Existingdatalist: any = [];
  parentnodeId: string;
  protected onDestroy$ = new Subject<boolean>();
  // @ViewChild('documentList')
  // documentList: DocumentListComponent;

  selectedcontenttype: string;
  ischeckboxevent: boolean;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = true;
  showuploaddialog = false;
  visible: boolean;
  uploadversion: boolean;
  upload = true;
  isCheckedversion: boolean;
  isCheckedrename: boolean;
  Existingdatanamelist: any = [];
  Newdatalist: any = [];
  updatenodeid: string;
  constructor(private apiService: ApiService, private contentservice: ContentTypeService, private notificationService: NotificationService, private _formBuilder: FormBuilder, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute,
    private nodeApiService: NodesApiService,
    private cardViewUpdateService: CardViewUpdateService,
    private alfrescoApiService: AlfrescoApiService,
    private uploadService: UploadService) { }

  onUploadError(event: any) {
    this.visible = false;
    let entry = event;
    this.errorfileslist.push(entry);
    if (this.errorfileslist.length > 0) {
      this.totalerrorfiles = this.errorfileslist.length;
      this.notificationService.openSnackMessage(this.totalerrorfiles + ' File upload Error');
    }
  }
  onUploadFiles(event: any) {
    let entry = event.value.entry;
    this.fileslist.push(entry);
    if (this.fileslist.length > 1) {
      this.nodedata = this.fileslist[0];
    }
    else {
      this.nodedata = entry;
    }
    this.showuploaddialog = true;
    this.UploadSuccess(event);
  }
  UploadSuccess(event: any) {
    this.visible = true;
    // var totalCompletefiles = event.totalComplete;
    // var successstatus = event.status;
    // this.notificationService.openSnackMessage('File uploaded:' + successstatus + "totalsuccess:" + totalCompletefiles);
    let entry = event.value.entry;
    this.successfileslist.push(entry);
    if (this.successfileslist.length > 0) {
      this.totalCompletefiles = this.successfileslist.length;
      this.notificationService.openSnackMessage(this.totalCompletefiles + ' Files uploaded successfully');
    }
  }
  UploadError(event: FileUploadErrorEvent) {
    this.visible = false;
    var errorCode = event.file.errorCode;
    console.log(event.error);
    this.notificationService.openSnackMessage('File upload Error:' + event.error + "totalerrors:" + event.totalError);
  }
  onChangeslidername(event) {
    if (event.checked === true) {
      this.isCheckedrename = true;
      if(this.isCheckedrename == true){
        this.isCheckedversion = false;
      }
    }
  }
  onChangesliderversion(event) {
    if (event.checked === true) {
      this.isCheckedversion = true;
      if(this.isCheckedversion == true){
        this.isCheckedrename = false;
      }
    }
  }
  clear() {
    this.Existingdatalist = [];
    this.Newdatalist = [];
    this.Existingdatanamelist = [];
    this.successfileslist = [];
    this.totalCompletefiles = 0;
    this.uploadService.clearQueue();
    this.fileslist=[];
   // this.listnodedatas = [];
  }
  getnodedatalist() {
    this.apiService.getnodedatalist(this.nodeId)
      .subscribe(
        (res: any) => {
          this.listnodedatas = res.list.entries;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
  // BulkUpload(event){
  //   var files = Object.assign([], event.files);
  //   for (let i = 0; i < this.listnodedatas.length; i++) {
  //     for (let j = 0; j < files.length; j++) {
  //       if (this.listnodedatas[i].entry.name == files[j].name) {
  //         this.Existingdatalist.push(this.listnodedatas[i].entry);
  //       }
  //     }
  //   }
  //   for (let i = 0; i < this.Existingdatalist.length; i++) {
  //     this.Newdatalist = files.filter(x=>this.Existingdatalist.findIndex(s=>s.name==x.name)==-1)
  //   }
  //   for (let i = 0; i < this.Existingdatalist.length; i++) {
  //     this.Existingdatanamelist.push(this.Existingdatalist[i].name);
  //   }
  //   event.pauseUpload();
  //   if (this.Existingdatalist.length > 0 && this.Newdatalist.length > 0) {
  //     files.length = 0;
  //     event.files = Object.assign([], this.Newdatalist);
  //     if(this.isCheckedversion == true){
  //       this.uploadversion = true;
  //       for (let i = 0; i < this.Existingdatalist.length; i++) {
  //         this.updatenodedata(this.Existingdatalist[i].id);
  //       }
  //       event.resumeUpload();
  //     }
  //     else if(this.isCheckedrename == true){
  //       event.resumeUpload();
  //       this.notificationService.openSnackMessage('File uploaded successfully with autorename');
  //       this.uploadversion = false;
  //     }
  //   }
  //   else if (this.Existingdatalist.length > 0) {
  //     if(this.isCheckedversion == true){
  //       this.uploadversion = true;
  //       for (let i = 0; i < this.Existingdatalist.length; i++) {
  //         this.updatenodedata(this.Existingdatalist[i].id);
  //       }
  //     }
  //     else if(this.isCheckedrename == true){
  //       event.resumeUpload();
  //       this.notificationService.openSnackMessage('File uploaded successfully with autorename');
  //       this.uploadversion = false;
  //     }
  //   }
  //   else {
  //     if (files.length >= 1) {
  //       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //         data: {
  //           title: 'Upload',
  //           message: `Are you sure you want to upload ${files.length} file(s)?`
  //         },
  //         minWidth: '250px'
  //       });

  //       dialogRef.afterClosed().subscribe(result => {
  //         if (result === true) {
  //           event.resumeUpload();
  //         }
  //       });
  //     }
  //   }
  // }
  onBeginUpload(event: UploadFilesEvent) {
    this.clear();
    this.getnodedatalist();

    // const files = event.files || [];

    var files = Object.assign([], event.files);
    for (let i = 0; i < this.listnodedatas.length; i++) {
      for (let j = 0; j < files.length; j++) {
        if (this.listnodedatas[i].entry.name == files[j].name) {
          this.Existingdatalist.push(this.listnodedatas[i].entry);
        }
      }
    }
    for (let i = 0; i < this.Existingdatalist.length; i++) {
      this.Newdatalist = files.filter(x=>this.Existingdatalist.findIndex(s=>s.name==x.name)==-1)
    }
    for (let i = 0; i < this.Existingdatalist.length; i++) {
      this.Existingdatanamelist.push(this.Existingdatalist[i].name);
    }
    event.pauseUpload();
    if (this.Existingdatalist.length > 0 && this.Newdatalist.length > 0) {
      // event.pauseUpload();
      files.length = 0;
      event.files = Object.assign([], this.Newdatalist);
      if(this.isCheckedversion == true){
        this.uploadversion = true;
        for (let i = 0; i < this.Existingdatalist.length; i++) {
          this.updatenodedata(this.Existingdatalist[i].id);
        }
        event.resumeUpload();
      }
      else if(this.isCheckedrename == true){
        event.resumeUpload();
        this.notificationService.openSnackMessage('File uploaded successfully with autorename');
        this.uploadversion = false;
      }
      // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      //   data: {
      //     title: 'Upload Status',
      //     message: `Do you want to proceed upload ${this.Existingdatanamelist} file with Version?if yes proceed with version,no means proceed with autorename.`,
      //   },
      //   minWidth: '250px'
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result === true) {
      //     this.uploadversion = true;
      //     for (let i = 0; i < this.Existingdatalist.length; i++) {
      //       this.updatenodedata(this.Existingdatalist[i].id);
      //     }
      //     event.resumeUpload();
      //   }
      // });
    }
    else if (this.Existingdatalist.length > 0) {
      //event.pauseUpload();
      if(this.isCheckedversion == true){
        this.uploadversion = true;
        for (let i = 0; i < this.Existingdatalist.length; i++) {
          this.updatenodedata(this.Existingdatalist[i].id);
        }
      }
      else if(this.isCheckedrename == true){
        event.resumeUpload();
        this.notificationService.openSnackMessage('File uploaded successfully with autorename');
        this.uploadversion = false;
      }
      // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      //   data: {
      //     title: 'Upload Status',
      //     message: `Do you want to proceed upload ${this.Existingdatanamelist} file with Version?if yes proceed with version,no means proceed with autorename.`
      //   },
      //   minWidth: '250px'
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result === true) {
      //     this.uploadversion = true;
      //     for (let i = 0; i < this.Existingdatalist.length; i++) {
      //       this.updatenodedata(this.Existingdatalist[i].id);
      //     }
      //   }
      //   else {
      //     event.resumeUpload();
      //     this.notificationService.openSnackMessage('File uploaded successfully with autorename');
      //     this.uploadversion = false;
      //   }
      // });
    }
    else {
      if (files.length >= 1) {
        //event.pauseUpload();
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
  }
  updatenodedata(nodeId: string) {
    this.apiService.Updatenode(nodeId)
      .subscribe(
        res => {
          this.notificationService.openSnackMessage('File Major Version uploaded successfully');
        },
        err => {
          console.log(err);
        }
      );
  }

  checkboxevent(event) {
    let entry = event.checked;
    this.ischeckboxevent = entry;
    if (this.ischeckboxevent == true && this.fileslist.length > 0) {
      this.updateNode();
      // for (let i = 0; i <= this.fileslist.length; i++) {
      //   this.fileslist[i].properties = this.fileslist[0].properties;
      // }
    }
  }
  changedProperties = {};
  hasMetadataChanged = false;
  private targetProperty: CardViewBaseItemModel;

  ngOnInit() {
    this.cardViewUpdateService.itemUpdated$
      .subscribe(
        (updatedNode: UpdateNotification) => {
          this.hasMetadataChanged = true;
          this.targetProperty = updatedNode.target;
          this.updateChanges(updatedNode.changed);
          if (this.ischeckboxevent == true && this.fileslist.length > 0) {
            for (let i = 0; i < this.fileslist.length; i++) {
              this.cardViewUpdateService.update(this.targetProperty, updatedNode.changed)
            }
          }
        }
      );

    this.getcontenttypelist();
    // this.getnodedatalist();
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
  // frmStepOne() { console.log(this.firstFormGroup.get('firstCtrl').value); return this.firstFormGroup.get('firstCtrl').value; }
  // frmStepTwo() { console.log(this.firstFormGroup.get('secondCtrl').value); return this.secondFormGroup.get('secondCtrl'); }

  form = new FormGroup({
    contenttype: new FormControl('', Validators.required),
  });

  get f() {
    return this.form.controls;
  }

  updateChanges(updatedNodeChanges) {
    Object.keys(updatedNodeChanges).map((propertyGroup: string) => {
      if (typeof updatedNodeChanges[propertyGroup] === 'object') {
        this.changedProperties[propertyGroup] = {
          ...this.changedProperties[propertyGroup],
          ...updatedNodeChanges[propertyGroup]
        };
      } else {
        this.changedProperties[propertyGroup] = updatedNodeChanges[propertyGroup];
      }
    });
  }
  saveChanges() {
    if (this.hasContentTypeChanged(this.changedProperties)) {
      this.updateNode();
    }
  }
  private updateNode() {
    for (let i = 0; i < this.fileslist.length; i++) {
      this.nodeApiService.updateNode(this.fileslist[i].id, this.changedProperties).pipe(
        catchError((err) => {
          this.cardViewUpdateService.updateElement(this.targetProperty);
          return (null);
        }))
        .subscribe((updatedNode) => {
          if (updatedNode) {
            if (this.hasContentTypeChanged(this.changedProperties)) {
              this.cardViewUpdateService.updateNodeAspect(this.fileslist[i]);
            }
            this.revertChanges();
            Object.assign(this.fileslist[i], updatedNode);
            this.alfrescoApiService.nodeUpdated.next(this.fileslist[i]);
          }
        });
    }
  }

  private hasContentTypeChanged(changedProperties): boolean {
    return !!changedProperties?.nodeType;
  }

  revertChanges() {
    this.changedProperties = {};
    this.hasMetadataChanged = false;
  }
  lstproperties: any = [];
  openDialog() {
    const dialogRef = this.dialog.open(
      // MetadataComponentComponent,
      //FileViewComponent,
      ContentMetadataComponent,
      {
        // data: {
        //   preset: "*",
        //   node: this.node,
        //   editable: true
        // },
        // width: '700px',
        // height: '800px'
      }
    );
    dialogRef.componentInstance.node = this.node;
  }

  listcontentdatas: any;
  properties: any = [];
  listofproperties: any = [];
  changecontenttype(event) {
    //this.frmStepOne();
    let entry = event.value;
    this.selectedcontenttype = entry;
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




