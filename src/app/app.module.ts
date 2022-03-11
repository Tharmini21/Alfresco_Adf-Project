import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule, TRANSLATION_PROVIDER, TranslateLoaderService, CoreAutomationService } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { appRoutes } from './app.routes';
import { PreviewService } from './services/preview.service';
import { FileViewComponent } from './file-view/file-view.component';
import { ApiService } from './services/ApiService';
import { ProcessService, ProcessInstance, ProcessInstanceVariable, 
    ProcessDefinitionRepresentation, ProcessFilterParamRepresentationModel, TaskDetailsModel } from '@alfresco/adf-process-services';


// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DocumentsComponent } from './documents/documents.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';

// Localization
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import localeCh from '@angular/common/locales/zh';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localePl from '@angular/common/locales/pl';
import localeFi from '@angular/common/locales/fi';
import localeDa from '@angular/common/locales/da';
import localeSv from '@angular/common/locales/sv';
import { MyFirstComponentComponent } from './my-first-component/my-first-component.component';
import { MyDialogComponentComponent } from './my-dialog-component/my-dialog-component.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MetadataComponentComponent } from './metadata-component/metadata-component.component';
import { ContractHomeComponent } from './contract-home/contract-home.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { DatePipe } from '@angular/common';

registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localeIt);
registerLocaleData(localeEs);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeNb);
registerLocaleData(localeRu);
registerLocaleData(localeCh);
registerLocaleData(localeAr);
registerLocaleData(localeCs);
registerLocaleData(localePl);
registerLocaleData(localeFi);
registerLocaleData(localeDa);
registerLocaleData(localeSv);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: true }),
        // ADF modules
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
        }),
        HttpClientModule,
        MatStepperModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        DocumentsComponent,
        AppLayoutComponent,
        FileViewComponent,
        MyFirstComponentComponent,
        MyDialogComponentComponent,
        MetadataComponentComponent,
        ContractHomeComponent,
        ContractDetailsComponent
        // MatStepperModule
    ],
    providers: [
        PreviewService,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        ApiService
        // {
        //     provide: STEPPER_GLOBAL_OPTIONS,
        //     useValue: { displayDefaultIndicatorType: false }
        // }
        , DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(automationService: CoreAutomationService) {
        automationService.setup();
    }
}
