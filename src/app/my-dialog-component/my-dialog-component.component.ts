import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentTypeService } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-my-dialog-component',
  templateUrl: './my-dialog-component.component.html',
  styleUrls: ['./my-dialog-component.component.css']
})
export class MyDialogComponentComponent implements OnInit {
  
  constructor(private dialog: MatDialog, private contentservice: ContentTypeService) {}
  listcontentdatas: any;
  ngOnInit() {
   this.getcontenttypelist();
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
}


