import { Component, OnInit } from '@angular/core';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentTypeService } from '@alfresco/adf-content-services';
import { ApiService } from '../services/ApiService';

@Component({
  selector: 'app-my-dialog-component',
  templateUrl: './my-dialog-component.component.html',
  styleUrls: ['./my-dialog-component.component.css']
})
export class MyDialogComponentComponent implements OnInit {
  nodeId: string;
  selectedcontenttype: string;

  constructor(private dialog: MatDialog, private contentservice: ContentTypeService,private apiService: ApiService) {}
  listcontentdatas: any=[];
  listnodedatas: any=[];
  listnodewithcontenttype:any=[];
  ngOnInit() {
   this.getcontenttypelist();
   //this.getnodedatalist();
  }
  changecontenttype(event) {
    let entry = event.value;
    this.selectedcontenttype = entry;
    // if (this.listnodedatas != null && this.listnodedatas.list.entries.length!=0) {
    //   var nodelstlength=this.listnodedatas.list.entries.length;
    //   for (let i = 0; i < nodelstlength; i++) {
    //     if (this.selectedcontenttype == this.listnodedatas.list.entries[i].entry.nodeType) {
    //       this.listnodewithcontenttype.push(this.listnodedatas.list.entries[i]);
    //     }
    //   }
    //   console.log(this.listnodewithcontenttype);
    // }
    this.getnodedatalist();
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
  getnodedatalist() {
    this.apiService.getnodedata_datatable(this.nodeId,this.selectedcontenttype)
      .subscribe(
        res => {
          this.listnodedatas = res;
          this.listnodewithcontenttype.push(this.listnodedatas.list.entries);

          //for (let i = 0; i < this.listnodedatas; i++) {
          //this.listnodewithcontenttype.push(this.listnodedatas.list.entries[i]);
          //}
          console.log(this.listnodewithcontenttype);
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
}


