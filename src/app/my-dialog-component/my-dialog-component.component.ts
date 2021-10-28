import { Component, OnInit, ViewChild } from '@angular/core';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentTypeService } from '@alfresco/adf-content-services';
import { ApiService } from '../services/ApiService';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JsonCellComponent, NodesApiService, AlfrescoApiService, CardViewUpdateService, CardViewBaseItemModel, UpdateNotification } from '@alfresco/adf-core';
import { element } from 'protractor';
import { MatMenuTrigger } from '@angular/material/menu';

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
  rows: any;
  schema: any;
  tabledata: any = [];
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
  editedcontenttype: string;
  changedProperties = {
    name: "",
    // nodeType: ""
    "properties":
    {
      "cm:title": "",
      "cm:author": ""
    }
  };
  hasMetadataChanged = false;
  isEditable = false;
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
    this.getnodedatalist();

  }
  editcontenttype(event) {
    let entry = event.value;
    this.editedcontenttype = entry;
    this.editField = this.editedcontenttype;
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
  remove(id: string) {
    this.apiService.Deletenode(this.listnodewithcontenttype[id].entry.id)
      .subscribe(
        res => {
          this.listnodewithcontenttype = [];
          this.getnodedatalist();
        },
        err => {
          console.log('Error occured:' + err);
        }
      );
  }
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // this.contextMenu.menuData = { 'item': item };
    // this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
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
            // for (let i = 0; i < this.listnodewithcontenttype.length; i++) {
            //   this.tabledata.push = (
            //     {
            //       id: this.listnodewithcontenttype[i].entry.id,
            //       name: this.listnodewithcontenttype[i].entry.name,
            //       "createdByUser.displayName": this.listnodewithcontenttype[i].entry.createdByUser.displayName,
            //       createdAt: this.listnodewithcontenttype[i].entry.createdAt,
            //       "modifiedByUser.displayName": this.listnodewithcontenttype[i].entry.modifiedByUser.displayName,
            //       modifiedAt: this.listnodewithcontenttype[i].entry.modifiedAt,
            //       nodeType: this.listnodewithcontenttype[i].entry.nodeType,
            //     });
            // }
          }
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );

    // this.rows = this.tabledata;
    // this.schema =
    //   [
    //     {
    //       type: 'text',
    //       key: 'id',
    //       title: 'Id',
    //       sortable: true
    //     },
    //     {
    //       type: 'text',
    //       key: 'name',
    //       title: 'Name',
    //       sortable: true
    //     },
    //     {
    //       type: 'text',
    //       key: 'createdByUser.displayName',
    //       title: 'Created By',
    //       sortable: true
    //     },
    //     {
    //       type: 'date',
    //       key: 'createdAt',
    //       title: 'Created On',
    //       sortable: true
    //     },
    //     {
    //       type: 'text',
    //       key: 'modifiedByUser.displayName',
    //       title: 'Modified By',
    //       sortable: true
    //     },
    //     {
    //       type: 'date',
    //       key: 'modifiedAt',
    //       title: 'Modified On',
    //       sortable: true
    //     },
    //     {
    //       type: 'text',
    //       key: 'nodeType',
    //       title: 'Content Type',
    //       sortable: true
    //     }
    //   ];
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    // this.changedProperties.name = editField;
    // this.changedProperties.modifiedByUser.displayName = editField;
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
  public onEditClick() {
    this.isEditable = true;
  }
  changeValue(event: any) {
    this.editField = event;
    this.isedit = true;
  }
  updatemethod(id: number, cellname: any) {
    this.tempid = this.listnodewithcontenttype[id].entry.id;
    this.tempcellname = cellname;
    const editField = this.editField;
    switch (this.tempcellname) {
      case "name":
        this.changedProperties.name = editField;
        break;
      // case "modifiedByUser":
      //   this.changedProperties.modifiedByUser.displayName = editField;
      //   break;
      // case "nodeType":
      //   this.changedProperties.nodeType = editField;
      //   break;
      case "author":
        this.changedProperties.properties['cm:author'] = editField;
        break;
      // case "title":
      //   this.changedProperties.properties['cm:title'] = editField;
      //   break;
    }
    this.updateNode(this.tempid);
  }
  checkboxevent(event) {
    let entry = event.checked;
    this.ischeckboxevent = entry;
    if (entry) {
      var celval = this.listnodewithcontenttype.filter(s => s.entry.id == this.tempid);
      switch (this.tempcellname) {
        case "name":
          if (celval && celval.length > 0) {
            this.listnodewithcontenttype.forEach(element => {
              element.entry.name = celval[0].entry.name
            });
          }
          break;
        case "author":
          if (celval && celval.length > 0) {
            this.listnodewithcontenttype.forEach(element => {
              element.entry.properties['cm:author'] = celval[0].entry.properties['cm:author']
            });
          }
          break;
        // case "title":
        // if (celval && celval.length > 0) {
        //   this.listnodewithcontenttype.forEach(element => {
        //     element.entry.properties['cm:title'] = celval[0].entry.properties['cm:title']
        //   });
        // }
        // break;
        // case "nodeType":
        //   if (celval && celval.length > 0) {
        //     this.listnodewithcontenttype.forEach(element => {
        //       element.entry.nodeType = celval[0].entry.nodeType
        //     });
        //   }
        //   break;
      }
      this.updateNode(null);
    }
  }
  private updateNode(id?: string) {
    if (id != null) {
      this.nodeApiService.updateNode(id, this.changedProperties).subscribe(data => {
        Object.assign(id, data);
        console.log(data);
      }, error => {
        console.log(error);
      });
    }
    else {
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





