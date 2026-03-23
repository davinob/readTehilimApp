import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList, IonItem, IonLabel, IonCheckbox, PopoverController
} from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-favorites-choose',
  templateUrl: 'favorites-choose.component.html',
  styleUrls: ['favorites-choose.component.scss'],
  imports: [CommonModule, FormsModule, IonList, IonItem, IonLabel, IonCheckbox],
})
export class FavoritesChooseComponent implements OnInit {
  favorites: number[] = [];

  constructor(
    private popoverCtrl: PopoverController,
    private storage: Storage,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.loadFavorites();
  }

  async loadFavorites() {
    this.favorites = (await this.storage.get('favorites')) ?? [];
  }

  close() {
    this.popoverCtrl.dismiss();
  }

  counter(i: number) {
    return new Array(i);
  }

  async addRemoveToFavorites(dayNum: number) {
    if (this.isNumInFavorites(dayNum)) {
      this.favorites = this.favorites.filter(day => day !== dayNum);
    } else {
      this.favorites.push(dayNum);
    }
    this.storage.set('favorites', this.favorites);
  }

  isNumInFavorites(dayNum: number): boolean {
    return !!this.favorites?.find(day => dayNum === day);
  }
}
