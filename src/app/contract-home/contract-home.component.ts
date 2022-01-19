import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService';
// import { SelectAppsDialogComponent } from '@alfresco/adf-process-services';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.css']
})
export class ContractHomeComponent implements OnInit {
  nodeId: string;
  processId: string;
  constructor(private apiService: ApiService, private dialog: MatDialog) { }
  // startSelectDialog() {
  //   const dialogRef = this.dialog.open(SelectAppsDialogComponent, {
  //     width: '630px',
  //     panelClass: 'adf-version-manager-dialog'
  //   });

  //   dialogRef.afterClosed().subscribe(selectedProcess => {
  //     this.processId = selectedProcess.id;
  //   });
  // }
  ngOnInit(): void {
    this.getnodedatalist();
    // this.nodeId = ((document.getElementById("nodeid") as HTMLInputElement).value);
    // console.log(this.nodeId);
  }
  listnodedatas: any = [];
  getnodedatalist() {
    this.apiService.getnodedatalist("-root-")
      .subscribe(
        (res: any) => {
          this.listnodedatas = res.list.entries;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
}
