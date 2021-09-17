import { Component, ViewEncapsulation } from '@angular/core';
import { TranslationService, AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { ApiService } from './services/ApiService';
import { NodeDatas } from './Classes/NodeDatas';
import { MyFirstComponentComponent } from './my-first-component/my-first-component.component';
import { ContentTypeService } from '@alfresco/adf-content-services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(translationService: TranslationService,
              private authService: AuthenticationService,
              private router: Router,
              private apiService: ApiService,
              private contentservice: ContentTypeService) {
    translationService.use('en');
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}

