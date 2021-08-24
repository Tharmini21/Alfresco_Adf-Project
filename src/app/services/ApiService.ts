import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NodeDatas } from 'app/Classes/NodeDatas';

@Injectable()
export class ApiService {
    constructor(private httpclient: HttpClient) { }
    // Baseurl = 'http://127.0.0.1:8080';
    // dataUrl = 'http://localhost:8080';
    dataUrl = 'http://localhost:4200';
    data;

    getfileCount(nodeId: string) {
        let node_id = nodeId;
        var isfile="isFile=true";
        node_id = node_id.replace(/"/g, "");
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${node_id}/children?where=(${isfile})`,{ headers: reqHeader });
    }
    getfolderCount(nodeId: string) {
        let node_id = nodeId;
        var isfolder="isFolder=true";
        node_id = node_id.replace(/"/g, "");
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${node_id}/children?where=(${isfolder})`,{ headers: reqHeader });
    }
    getsimplesearch(name: string) {
        let searchdata = name;
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/queries/sites?term=${searchdata}`,{ headers: reqHeader });

       // return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes?term=${searchdata}`,{ headers: reqHeader });
    }
    getsecondarychild(nodeId: string) {
        let node_id = nodeId;
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${node_id}/secondary-children`,{ headers: reqHeader });
    }
}

