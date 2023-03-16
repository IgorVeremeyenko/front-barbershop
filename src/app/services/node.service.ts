import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FILES_JSON, SERVICES_JSON } from 'src/assets/constants';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

    getFiles() {
    return this.http.get<any>(FILES_JSON)
      .toPromise()
      .then(res => <TreeNode[]>res.data);
    }

    getHairCuts() {
      return this.http.get<any>(SERVICES_JSON)
      .toPromise()
      .then(res => <TreeNode[]>res.data)
    }

    // getLazyFiles() {
    // return this.http.get<any>('assets/files-lazy.json')
    //   .toPromise()
    //   .then(res => <TreeNode[]>res.data);
    // }
}
