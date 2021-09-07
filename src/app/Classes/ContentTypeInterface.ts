import { Subject } from 'rxjs';
// import {Component} from '@angular/core';

export interface ContentNodeSelectorComponentData {
    title: string;
    actionName?: string;
    currentFolderId: string;
    select: Subject<Node[]>;
}

// export class SelectData {
//     contentTypes: ContentType[] = [
//         { value: '0', displayValue: 'cm:content' },
//         { value: '1', displayValue: 'cm:folder' },
//         { value: '2', displayValue: 'dc:whitepaper' }
//     ];
// }
// class ContentType {
//     value: string;
//     displayValue: string;
// }