/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewChild, Input } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../services/ApiService';
import { NodeDatas } from '../Classes/NodeDatas';
import { HttpParams } from '@angular/common/http';
import { Conditional } from '@angular/compiler';
import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';
// import { TestSearchConfigurationService } from '../services/ApiService';
import { MatDialog } from '@angular/material/dialog';
import { MyFirstComponentComponent } from '../my-first-component/my-first-component.component';
import { ContentNodeSelectorComponentData } from '../Classes/ContentTypeInterface';
import { Subject } from 'rxjs';
import { DocumentActionsService, ContentTypeService } from '@alfresco/adf-content-services';
import { MyDialogComponentComponent } from '../my-dialog-component/my-dialog-component.component';
import { MetadataComponentComponent } from '../metadata-component/metadata-component.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
  //   providers: [
  //     { provide: SearchConfigurationService, useClass: TestSearchConfigurationService },
  //     SearchService
  // ]
})


export class DocumentsComponent {

  @Input()
  showViewer = false;
  nodeId: string = null;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  // ngAfterViewInit() {
  //   console.log(this.documentList);
  // }

  constructor(private notificationService: NotificationService, private preview: PreviewService, private apiService: ApiService, private dialog: MatDialog, private documentActions: DocumentActionsService, private contentservice: ContentTypeService) {
   
  }

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  showPreview(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onGoBack(event: any) {
    this.showViewer = false;
    this.nodeId = null;
  }
  onUploadPermissionFailed(event: any) {
    this.notificationService.openSnackMessage(
      `you don't have the ${event.permission} permission to ${event.action} the ${event.type} `, 4000
    );
  }
  openSelectorDialog(event) {
    let entry = event.value.entry;
    var nodeId = entry.id;
    let dialogRef = this.dialog.open(
      MyFirstComponentComponent,
      {
        //data:{node:entry},
         width: '900px',height:'700px'
      }
    );
    dialogRef.componentInstance.nodevalue = entry;
    dialogRef.componentInstance.nodeId = nodeId;
  }
  openbulkupdateDialog(event){
    let entry = event.value.entry;
    var nodeId = entry.id;
    let dialogRef = this.dialog.open(
      MyDialogComponentComponent,
      {
         // width: '700px',
      }
    );
    dialogRef.componentInstance.nodeId = nodeId;
  }
  openmetaDialog(event){
    let entry = event.value.entry;
    var nodeId = entry.id;
    let dialogRef = this.dialog.open(
      MetadataComponentComponent,
      {
      }
    );
  }
  myCustomActionAfterDelete(event) {
    let entry = event.value.entry;
    let item = "";
    if (entry.isFile) {
      item = "file";
    } else if (entry.isFolder) {
      item = "folder"
    }
    this.notificationService.openSnackMessage(`Deleted ${item} "${entry.name}" `, 20000);
    this.documentList.reload();
  }
  listnodedatas: any;
  FolderCount: any = [];
  FileCount: any = [];

  myfoldercountdetails(event) {
    let entry = event.value.entry;
    var nodeId = entry.id;
    this.apiService.getfolderCount(nodeId)
      .subscribe(
        res => {
          this.listnodedatas = res;
          var FolderCount = this.listnodedatas.list.pagination.count;
          this.notificationService.openSnackMessage("FolderCount:" + FolderCount);
        },
        err => {
          console.log('Error occured');
        }
      );
  }

  myfilecountdetails(event) {
    let entry = event.value.entry;
    var nodeId = entry.id;
    this.apiService.getfileCount(nodeId)
      .subscribe(
        res => {
          this.listnodedatas = res;
          var FileCount = this.listnodedatas.list.pagination.count;
          this.notificationService.openSnackMessage("FileCount:" + FileCount);
        },
        err => {
          console.log('Error occured');
        }
      );
  }
  secondaychildcount(event) {
    let entry = event.value.entry;
    var nodeId = entry.id;
    this.apiService.getsecondarychild(nodeId)
      .subscribe(
        res => {
          this.listnodedatas = res;
          var SecChildCount = this.listnodedatas.list.pagination.count;
          this.notificationService.openSnackMessage("Secondary Child Count:" + SecChildCount);
        },
        err => {
          console.log('Error occured');
        }
      );
  }


  onSearchSubmit(event) {
    let entry = event.value;
    var name = entry;
    this.apiService.getsimplesearch(name)
      .subscribe(
        res => {
          this.listnodedatas = res;
        },
        err => {
          console.log('Error occured while searching data');
        }
      );
  }

  onSearchevent(event) {
    // var divElement = document.getElementById("search");
    let entry = event.value.entry;
    // var name = entry.nodeType;
    var name = entry.name;
    var path = entry.path.name;
    // var documentLibrary = companyhome.childByNamePath("path");
    // var folder = search.luceneSearch("+PATH:\"/app:company_home/cm:Test_x0020_Folder//*\" AND (TYPE:\"cm:content\" OR TYPE:\"cm:folder\")");
    this.apiService.searchdata(name)
      .subscribe(
        res => {
          this.listnodedatas = res;
          var output = this.listnodedatas.list.pagination.count;
          this.notificationService.openSnackMessage("Nested Folder Count data:" + output);
        },
        err => {
          console.log('Error occured while searching data');
        }
      );
  }
}



