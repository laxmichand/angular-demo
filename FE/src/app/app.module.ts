import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'; // add this line

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemotableService } from "./demotable.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [DemotableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
