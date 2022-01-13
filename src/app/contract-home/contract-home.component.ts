import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService';
@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.css']
})
export class ContractHomeComponent implements OnInit {

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
