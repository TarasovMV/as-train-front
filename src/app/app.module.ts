import { AppConfigService } from './services/app-config.service';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './pages/main/main.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { PageCreateCategoryComponent } from './pages/create/page-create-category/page-create-category.component';
import { PageCreateTestComponent } from './pages/create/page-create-test/page-create-test.component';
import { TestCardComponent } from './components/test-card/test-card.component';
import { CategoryCardPopupComponent } from './components/category-card-popup/category-card-popup.component';
import { AcceptPopupComponent } from './components/accept-popup/accept-popup.component';
import { PageCreateSetComponent } from './pages/create/page-create-set/page-create-set.component';
import { SetCardComponent } from './components/set-card/set-card.component';
import { SetPopupComponent } from './components/set-popup/set-popup.component';
import { PageCreateTestQuizComponent } from './pages/create/page-create-test-quiz/page-create-test-quiz.component';
import { QuizCardComponent } from './components/quiz-card/quiz-card.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { TestPopupComponent } from './components/test-popup/test-popup.component';
import { PageInfoReportComponent } from './pages/info/page-info-report/page-info-report.component';
import { PageInfoResultComponent } from './pages/info/page-info-result/page-info-result.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { FreeCheckPopupComponent } from './components/free-check-popup/free-check-popup.component';
import { HelperPopupComponent } from './components/helper-popup/helper-popup.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        CategoryCardComponent,
        PageCreateCategoryComponent,
        PageCreateTestComponent,
        TestCardComponent,
        CategoryCardPopupComponent,
        AcceptPopupComponent,
        PageCreateSetComponent,
        SetCardComponent,
        SetPopupComponent,
        PageCreateTestQuizComponent,
        QuizCardComponent,
        LoaderComponent,
        TestPopupComponent,
        PageInfoReportComponent,
        PageInfoResultComponent,
        ResultCardComponent,
        FreeCheckPopupComponent,
        HelperPopupComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => {
                return async () => await appConfigService.loadAppConfig();
            }
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
