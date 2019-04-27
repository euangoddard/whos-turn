import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatRadioModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { APP_ROUTES } from 'src/app/app.routes';
import { AliasDirective } from 'src/app/directives/alias.directive';
import { ICONS, Icons } from 'src/app/icons';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { HomeComponent } from './components/home/home.component';
import { TurnEditComponent } from './components/turn-edit/turn-edit.component';
import { TurnComponent } from './components/turn/turn.component';
import { metaReducers, reducers } from './reducers';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatRadioModule,
  MatInputModule,
  MatChipsModule,
  MatMenuModule,
  MatSnackBarModule,
];

const CDK_MODULES = [LayoutModule];

@NgModule({
  declarations: [AppComponent, AliasDirective, HomeComponent, TurnComponent, TurnEditComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
    ...CDK_MODULES,
    StoreModule.forRoot(reducers, { metaReducers }),
    RouterModule.forRoot(APP_ROUTES),
    MatListModule,
    EffectsModule.forRoot([AppEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: Icons,
      useValue: ICONS,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
