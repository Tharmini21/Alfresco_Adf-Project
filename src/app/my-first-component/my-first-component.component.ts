// import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// //import { ContentNodeSelectorComponent} from '@alfresco/adf-content-services';
// import { ContentNodeSelectorComponentData} from '../Classes/ContentTypeInterface';
// import { Subject } from 'rxjs';

// @Component({
//   selector: 'app-my-first-component',
//   templateUrl: './my-first-component.component.html',
//   styleUrls: ['./my-first-component.component.css']
// })
// export class MyFirstComponentComponent implements OnInit {

//   constructor(private dialog: MatDialog) { }

//   ngOnInit(): void {
    
//   }
//   openSelectorDialog() {
//     var data: ContentNodeSelectorComponentData = {
//        title: "Choose an item",
//        actionName: "Choose",
//        currentFolderId: "someFolderId",
//        select: new Subject<Node[]>()
//      };
 
   
//      this.dialog.open(
//         //  ContentNodeSelectorComponent,
//         //  {
//         //    data, 
//         //    //panelClass: 'adf-content-type-dialog',
//         //      // data, panelClass: 'adf-content-node-selector-dialog',
//         //      width: '630px'
//         //  }
//         {
         
//      );
 
//      data.select.subscribe((selections: Node[]) => {
//          // Use or store selection...
//      }, 
//      (error)=>{
//          //your error handling
//      }, 
//      ()=>{
//          //action called when an action or cancel is clicked on the dialog
//          this.dialog.closeAll();
//      });
//    }

// }


import { Component } from '@angular/core';  
import { FormGroup, FormControl, Validators} from '@angular/forms'; 
import { ApiService } from '../services/ApiService'; 
// import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ContentNodeSelectorComponentData} from '../Classes/ContentTypeInterface';
import { Subject } from 'rxjs';
    
@Component({  
  selector: 'app-my-first-component',
  templateUrl: './my-first-component.component.html',
  styleUrls: ['./my-first-component.component.css']
})  
    
export class MyFirstComponentComponent {  
 
  constructor(private apiService: ApiService){}
  
  isShown: boolean = true;
  //isShown = false;
  checked: boolean = true;
  contentTypes: any[] = [
    { value: '0', displayValue: 'cm:content' },
    { value: '1', displayValue: 'cm:folder' },
    { value: '2', displayValue: 'dc:whitepaper' }
];
  
  form = new FormGroup({  
    contenttype: new FormControl('', Validators.required)  
  });  

  get f(){  
    return this.form.controls;  
  }  
  changecontenttype(event)
  {
    let entry = event.value.entry;
    this.isShown = ! this.isShown;
    this.checked=false;
    //this.isShown = true;
  }

  listcontentdatas: any;

  // mycontentdetails() {
  //   this.apiService.GetModelContentType()
  //     .subscribe(
  //       res => {
  //         this.listcontentdatas = res;
  //       },
  //       err => {
  //         console.log('Error occured');
  //       }
  //     );
  // }
};  

// export class DialogElementsExample {
//   constructor(public dialog: MatDialog) {}

//   openDialog() {
//     this.dialog.open(DialogElements);
//   }
// }
// export class DialogElements {}

  