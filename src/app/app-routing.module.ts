import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NidAuthComponent} from "./nid-auth/nid-auth.component";
import {FaceAuthComponent} from "./face-auth/face-auth.component";
import {EkycErrorComponent} from "./ekyc-error/ekyc-error.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'nid-auth',
    component: NidAuthComponent,
  },
  {
    path: 'face-auth',
    component: FaceAuthComponent,
  },
  {
    path: 'ekyc-error',
    component: EkycErrorComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
