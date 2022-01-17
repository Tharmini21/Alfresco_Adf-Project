import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService';
@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.css']
})
export class ContractHomeComponent implements OnInit {
  nodeId: string;
  constructor(private apiService: ApiService) { }

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
