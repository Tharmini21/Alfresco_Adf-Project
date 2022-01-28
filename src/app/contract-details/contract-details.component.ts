import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {
  nodeId: string;
  datePipeString : string;
  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute,private datePipe: DatePipe) { 
    this.datePipeString = datePipe.transform(Date.now(),'yyyy-MM-dd');
    console.log(this.datePipeString);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.nodeId = params['id'];
      console.log(this.nodeId);
    });
    this.getnodedetails();
    this.getnodedatalist();
    this.getcomments();
    this.getfiles();
  }
  nodechildrendetails: any = [];
  nodedetails: any = [];
  commentdetails: any = [];
  listfiles: any = [];
  getnodedetails() {
    this.apiService.getnodedetails(this.nodeId)
      .subscribe(
        (res: any) => {
          this.nodedetails = res;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
  getnodedatalist() {
    this.apiService.getnodedatalist(this.nodeId)
      .subscribe(
        (data: any) => {
          this.nodechildrendetails = data.list.entries;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
  getfiles() {
    this.apiService.getfiles(this.nodeId)
      .subscribe(
        (restdata: any) => {
          this.listfiles = restdata.list.entries;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
  
  getcomments() {
    this.apiService.getcommentdetails(this.nodeId)
      .subscribe(
        (val: any) => {
          this.commentdetails = val.list.entries;
        },
        err => {
          console.log('Error occured while fetching node data');
        }
      );
  }
}
