import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService';
@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {
  nodeId: string;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getnodedatalist();
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
