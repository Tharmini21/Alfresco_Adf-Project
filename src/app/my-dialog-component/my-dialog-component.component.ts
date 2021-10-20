import { Component, OnInit, ViewChild } from '@angular/core';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentTypeService } from '@alfresco/adf-content-services';
import { ApiService } from '../services/ApiService';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JsonCellComponent, NodesApiService, AlfrescoApiService, CardViewUpdateService, CardViewBaseItemModel, UpdateNotification } from '@alfresco/adf-core';
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
  isedit: boolean;
  dtlistlength: boolean;
  tempid: any;
  tempcellname: any;
  constructor(private dialog: MatDialog, private contentservice: ContentTypeService, private apiService: ApiService, private nodeApiService: NodesApiService, private alfrescoApiService: AlfrescoApiService, private cardViewUpdateService: CardViewUpdateService) { }
  listcontentdatas: any = [];
  listnodedatas: any = [];
  listnodewithcontenttype: any = [];
  ischeckboxevent: boolean;
  changedProperties = {
    name:null,
    modifiedByUser:{
      displayName:null,
      id: "admin"
    },
  };
  hasMetadataChanged = false;
  private targetProperty: CardViewBaseItemModel;
  ngOnInit() {
    this.getcontenttypelist();
    //this.getnodedatalist();
    this.cardViewUpdateService.itemUpdated$
      .subscribe(
        (updatedNode: UpdateNotification) => {
          this.hasMetadataChanged = true;
          this.targetProperty = updatedNode.target;
          this.updateChanges(updatedNode.changed);
          // if (this.ischeckboxevent == true && this.fileslist.length > 0) {
          //   for (let i = 0; i < this.fileslist.length; i++) {
          //     this.cardViewUpdateService.update(this.targetProperty, updatedNode.changed)
          //   }
          // }
        }
      );
  }
  changecontenttype(event) {
    this.listnodewithcontenttype = [];
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
          let lengthval = this.listnodedatas.list.entries.length;
          for (let i = 0; i < lengthval; i++) {

            JSON.parse(this.listnodewithcontenttype.push(this.listnodedatas.list.entries[i]));
          }
          console.log(this.listnodewithcontenttype);
          if (this.listnodewithcontenttype.length == 0) {
            this.dtlistlength = false;
          }
          else {
            this.dtlistlength = true;
          }
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    //this.listnodewithcontenttype[id][property] = editField;
    // this.changedProperties = ({this.listnodewithcontenttype[id][property]:editField});
    this.changedProperties = JSON.parse('{ "myString": "string", "myNumber": 4 }');
    var propdata = property;
    this.changedProperties.name =  editField;
    this.changedProperties.modifiedByUser.displayName =  editField;
    // this.updateChanges({property:editField});
    this.isedit = true;
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
  changeValue(event: any) {
    this.editField = event;
    this.isedit = true;
  }
  updatemethod(id: number, cellname: any, properties: any) {
    this.tempid = this.listnodewithcontenttype[id].entry.id;
    this.tempcellname = cellname;
  }
  checkboxevent(event) {
    let entry = event.checked;
    this.ischeckboxevent = entry;
    const editField = this.editField;

    if (entry) {
      var celval = this.listnodewithcontenttype.filter(s => s.entry.id == this.tempid);
      switch (this.tempcellname) {
        case "name":
          this.changedProperties.name =  editField;
          if (celval && celval.length > 0) {
            this.listnodewithcontenttype.forEach(element => {
              element.entry.name = celval[0].entry.name
            });
          }
          break;
        case "modifiedByUser":
        this.changedProperties.modifiedByUser.displayName =  editField;
          if (celval && celval.length > 0) {
            this.listnodewithcontenttype.forEach(element => {
              element.entry.modifiedByUser.displayName = celval[0].entry.modifiedByUser.displayName
            });
          }
          break;
      }
      this.updateNode();
    }
    // if (this.ischeckboxevent == true && this.listnodewithcontenttype.length > 0 && this.isedit == true) {
    //   this.updateNode();
    // }
  }
  private updateNode() {
    for (let i = 0; i < this.listnodewithcontenttype.length; i++) {
      this.nodeApiService.updateNode(this.listnodewithcontenttype[i].entry.id, this.changedProperties).subscribe(data => {
        Object.assign(this.listnodewithcontenttype[i], data);
        this.alfrescoApiService.nodeUpdated.next(this.listnodewithcontenttype[i]);
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
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





