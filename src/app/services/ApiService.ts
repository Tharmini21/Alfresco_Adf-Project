import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NodeDatas } from 'app/Classes/NodeDatas';
import { QueryBody } from '@alfresco/js-api';
import { SearchConfigurationInterface } from '@alfresco/adf-core';

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

    searchdata(name: string) {
        let searchdata = name;
        let querydata=this.generateQueryBody(searchdata,100,0);
       // let query=({ query: querydata});
        let query=JSON.stringify(querydata)
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz",
            'accept': 'application/json'
         });
        return this.httpclient.post(`${this.dataUrl}/alfresco/api/-default-/public/search/versions/1/search`,query,{ headers: reqHeader});
    }

    GetModelContentType() {
        let searchdata = "(namespaceUri matches('http://www.mycompany.com/model/finance/1.0.'))";
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz",
            'accept': 'application/json'
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/types?where=(${searchdata})`,{ headers: reqHeader});
    }
    getnodedata_datatable(nodeId: string ,nodeType:string) {
        let node_id = nodeId;
        node_id = node_id.replace(/"/g, "");
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
       // (nodeType='finance:FileId')
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${node_id}/children?where=(nodeType=${nodeType})`,{ headers: reqHeader });
    }
    getnodedatalist(nodeId: string) {
        let node_id = nodeId;
        node_id = node_id.replace(/"/g, "");
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46QWxmcmVzY29AMTIz"
         });
        return this.httpclient.get(`${this.dataUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${node_id}/children`,{ headers: reqHeader });
    }

    public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody {
        const defaultQueryBody: QueryBody = {
            query: {
                // query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
                // query: searchTerm ? `SITE:${searchTerm}` : searchTerm
                query: `SITE:${searchTerm}` 
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                { query: "TYPE:'cm:folder'" },
                { query: 'NOT cm:creator:System' }]
        };
          return defaultQueryBody;
    }

}
// export class TestSearchConfigurationService implements SearchConfigurationInterface {

//     constructor() {
//     }
  
//     public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody {
//         const defaultQueryBody: QueryBody = {
//             query: {
//                 query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
//             },
//             include: ['path', 'allowableOperations'],
//             paging: {
//                 maxItems: maxResults,
//                 skipCount: skipCount
//             },
//             filterQueries: [
//                 { query: "TYPE:'cm:folder'" },
//                 { query: 'NOT cm:creator:System' }]
//         };
  
//         return defaultQueryBody;
//     }
//   }
