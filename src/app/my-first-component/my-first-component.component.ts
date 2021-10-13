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
  fileslist: any = [];
  successfileslist: any = [];
  errorfileslist: any = [];
  filesdetaillist: any = [];
  totalerrorfiles: number;
  totalCompletefiles: number;
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
  constructor(private apiService: ApiService, private contentservice: ContentTypeService, private notificationService: NotificationService, private _formBuilder: FormBuilder, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute,
    private nodeApiService: NodesApiService,
    private cardViewUpdateService: CardViewUpdateService,
    private alfrescoApiService: AlfrescoApiService) { }

  onUploadError(event: any) {
    this.visible = false;
    let entry = event.value.entry;
    this.errorfileslist.push(entry);
    if (this.errorfileslist.length > 0) {
      this.totalerrorfiles = this.errorfileslist.length;
      this.notificationService.openSnackMessage(this.totalerrorfiles + ' File upload Error');
    }
  }
  // onUploadError(event: FileUploadErrorEvent) {
  //   var errorCode = event.file.errorCode;
  //   console.log(event.error);
  //   this.notificationService.openSnackMessage('File upload Error:' + errorCode + "totalerrors:" + event.totalError);
  //   // const errorMessage = event.error;
  //   // this.snackBar.open(errorMessage, '', { duration: 4000 });
  // }

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
  // totalError: number = 0;
  // queue: FileModel[];
  // onUploadErrorNew(file: FileModel, error: any): void {
  //   if (file) {
  //     file.errorCode = (error || {}).status;
  //     this.totalError++;

  //     const event = new FileUploadErrorEvent(
  //       file,
  //       error,
  //       this.totalError
  //     );
  //   }
  // }

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
    //this.onUploadErrorNew(files,null);
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
    contenttype: new FormControl('', Validators.required)
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




