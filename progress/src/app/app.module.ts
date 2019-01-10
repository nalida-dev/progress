import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarProgressComponent } from './bar-progress/bar-progress.component';
import { HttpClientModule } from '@angular/common/http';
import { PersonalHistoryComponent } from './personal-history/personal-history.component';
import { WeeklyProgressComponent } from './weekly-progress/weekly-progress.component';
import { HotProjectsComponent } from './hot-projects/hot-projects.component';

@NgModule({
  declarations: [
    AppComponent,
    BarProgressComponent,
    PersonalHistoryComponent,
    WeeklyProgressComponent,
    HotProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
