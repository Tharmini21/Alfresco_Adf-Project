import { Component, OnInit, ViewChild } from '@angular/core';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentTypeService } from '@alfresco/adf-content-services';
import { ApiService } from '../services/ApiService';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JsonCellComponent } from '@alfresco/adf-core';
import { element } from 'protractor';


export interface dtElement {
  name: string;
  nodeType: string;
}

// const ELEMENT_DATA: dtElement[] = [
//   {name: 'Hydrogen',nodeType:''},
// ];

@Component({
  selector: 'app-my-dialog-component',
  templateUrl: './my-dialog-component.component.html',
  styleUrls: ['./my-dialog-component.component.css']
})
export class MyDialogComponentComponent implements OnInit {
  nodeId: string;
  selectedcontenttype: string;
  editField: string;
  constructor(private dialog: MatDialog, private contentservice: ContentTypeService, private apiService: ApiService) { }
  listcontentdatas: any = [];
  listnodedatas: any = [];
  listnodewithcontenttype: any = [];
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
    this.apiService.getnodedata_datatable(this.nodeId, this.selectedcontenttype)
      .subscribe(
        res => {
          this.listnodedatas = res;
          let lengthval=this.listnodedatas.list.entries.length;
          for (let i = 0; i < lengthval; i++) {

            JSON.parse(this.listnodewithcontenttype.push(this.listnodedatas.list.entries[i]));
          }
          console.log(this.listnodewithcontenttype);
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.listnodewithcontenttype[id][property] = editField;
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  ELEMENT_DATA: dtElement[] = this.listnodewithcontenttype;
 
  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      // cell: (element:dtElement) => `${element.name}`
    },
    {
      columnDef: 'nodeType',
      header: 'Content Type',
      //cell: (element: dtElement) => `${element.nodeType}`
    }
  ];
  dataSource = this.ELEMENT_DATA;
  
  displayedColumns = this.columns.map(c => c.columnDef);
  // const ELEMENT_DATA: dtcolumns[] = [

  // ];
  //displayedColumns: string[] = ['name', 'Content Type', 'Created By', 'Modified On'];
  displayedColumnsData: string[] = ['name', 'Content Type'];
  // dataSource = ELEMENT_DATA;
  
  
}





