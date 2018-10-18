import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritesChoosePage } from './favorites-choose';

@NgModule({
  declarations: [
    FavoritesChoosePage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritesChoosePage),
  ],
})
export class FavoritesChoosePageModule {}
