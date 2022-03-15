import { Component, OnInit } from '@angular/core';
import { SelectAppsDialogComponent } from '@alfresco/adf-process-services';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-process-details',
  templateUrl: './process-details.component.html',
  styleUrls: ['./process-details.component.css']
})
export class ProcessDetailsComponent implements OnInit {
  processId: string = null;

  constructor(private dialog: MatDialog,private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  startSelectDialog(){
    const dialogRef = this.dialog.open(SelectAppsDialogComponent, {
        width: '630px',
        panelClass: 'adf-version-manager-dialog'
    });
    
    dialogRef.afterClosed().subscribe(selectedProcess => {
        this.processId = selectedProcess.id;
    });
 }
}


   
