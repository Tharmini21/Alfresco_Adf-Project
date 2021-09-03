import { Subject } from 'rxjs';
export interface ContentNodeSelectorComponentData {
    title: string;
    actionName?: string;
    currentFolderId: string;
    select: Subject<Node[]>;
}