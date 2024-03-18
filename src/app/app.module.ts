import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {HeaderPasoComponent} from "./header-paso/header-paso.component";
import {NidAuthComponent} from "./nid-auth/nid-auth.component";
import {FaceAuthComponent} from "./face-auth/face-auth.component";
import {EkycErrorComponent} from "./ekyc-error/ekyc-error.component";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {EnvServiceProvider} from "./services/env.service.provider";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderPasoComponent,
    NidAuthComponent,
    FaceAuthComponent,
    EkycErrorComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatBottomSheetModule
  ],
  providers: [
    EnvServiceProvider,
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
