import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { NodesApiService } from '@alfresco/adf-core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-metadata-component',
  templateUrl: './metadata-component.component.html',
  styleUrls: ['./metadata-component.component.css']
})
export class MetadataComponentComponent implements OnInit {

  nodeId: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private nodeApiService: NodesApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params.nodeId;
      if (id) {
        this.nodeApiService.getNode(id).subscribe(
          (node) => {
            if (node && node.isFile) {
              this.nodeId = id;
              return;
            }
            this.router.navigate(['/files', id]);
          },
          () => this.router.navigate(['/files', id])
        );
      }
    });
  }

}
