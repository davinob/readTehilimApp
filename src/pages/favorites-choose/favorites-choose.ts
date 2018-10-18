import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the FavoritesChoosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites-choose',
  templateUrl: 'favorites-choose.html',
})
export class FavoritesChoosePage {

  favorites:Array<number>;

  constructor(public viewCtrl: ViewController,private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesChoosePage');
    this.loadFavorites();
  }

  async loadFavorites()
  {
    this.favorites= await this.storage.get('favorites');
    if (!this.favorites)
    this.favorites=new Array();
  
  }

  close() {
    this.viewCtrl.dismiss();
  } 


  counter(i: number) {
    return new Array(i);
  }


  async addRemoveToFavorites(dayNum)
  {
    
    console.log("ADDREMOVE"+dayNum);
    console.log(this.favorites);
    if (this.isNumInFavorites(dayNum))
    {
      this.favorites=this.favorites.filter(day => day !== dayNum); 
      
     
    }
    else
    {
      this.favorites.push(dayNum);
    }

    
    this.storage.set('favorites',this.favorites );
    
    console.log(this.favorites);

  }

  isNumInFavorites(dayNum)
  {
    if (this.favorites)
    return this.favorites.find(day=>dayNum==day);
  }

}
