import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, PopoverController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, timeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import Hebcal from 'hebcal';

interface TehilimRange {
  start: number;
  end: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon],
})
export class HomePage implements OnInit {
  todayDayInMonth: number = 1;
  tomorrowDay: number = 2;
  todayDayInWeek: number = 1;
  selectedDayInWeek: number = 1;
  selectedDayInMonth: number = 1;
  selectedBook: number = 1;
  favorites: number[] = [];

  tehilimDaysInMonth: TehilimRange[] = [
    { start: 1, end: 9 }, { start: 10, end: 17 }, { start: 18, end: 22 },
    { start: 23, end: 28 }, { start: 29, end: 34 }, { start: 35, end: 38 },
    { start: 39, end: 43 }, { start: 44, end: 48 }, { start: 49, end: 54 },
    { start: 55, end: 59 }, { start: 60, end: 65 }, { start: 66, end: 68 },
    { start: 69, end: 71 }, { start: 72, end: 76 }, { start: 77, end: 78 },
    { start: 79, end: 82 }, { start: 83, end: 87 }, { start: 88, end: 89 },
    { start: 90, end: 96 }, { start: 97, end: 103 }, { start: 104, end: 105 },
    { start: 106, end: 107 }, { start: 108, end: 112 }, { start: 113, end: 118 },
    { start: 119.1, end: 119.1 }, { start: 119.2, end: 119.2 },
    { start: 120, end: 134 }, { start: 135, end: 139 },
    { start: 140, end: 144 }, { start: 145, end: 150 },
  ];

  tehilimDaysInWeek: TehilimRange[] = [
    { start: 1, end: 29 }, { start: 30, end: 50 }, { start: 51, end: 72 },
    { start: 73, end: 89 }, { start: 90, end: 106 }, { start: 107, end: 120 },
    { start: 121, end: 150 },
  ];

  tehilimBooks: TehilimRange[] = [
    { start: 1, end: 41 }, { start: 42, end: 72 }, { start: 73, end: 89 },
    { start: 90, end: 106 }, { start: 107, end: 150 },
  ];

  constructor(
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
  ) {
    addIcons({ settingsOutline, timeOutline });
    this.getTodayDate();
    this.selectedDayInWeek = this.todayDayInWeek;
    this.selectedDayInMonth = this.todayDayInMonth;
  }

  async ngOnInit() {
    await this.storage.create();
    await this.loadSelectedBook();
  }

  async presentPopoverFavorites(ev: Event) {
    const { FavoritesChooseComponent } = await import('../favorites-choose/favorites-choose.component');
    const popover = await this.popoverCtrl.create({
      component: FavoritesChooseComponent,
      event: ev,
    });
    await popover.present();
  }

  async loadFavorites() {
    this.favorites = (await this.storage.get('favorites')) ?? [];
  }

  async loadSelectedBook() {
    this.selectedBook = (await this.storage.get('selectedBook')) ?? 1;
  }

  getTodayDate(): string {
    const hebcal = new Hebcal();
    const todayDayHeb = hebcal.find('today')[0];
    this.todayDayInMonth = todayDayHeb.day;
    this.tomorrowDay = hebcal.find('tomorrow')[0].day;
    const date = new Date();
    this.todayDayInWeek = date.getDay() + 1;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat', 'Sunday'];
    return dayNames[((date.getDay() - 1) + 7) % 7] + ' ' + todayDayHeb.toString();
  }

  goToTehilimDayMonth() {
    if (this.todayDayInMonth === 29 && this.tomorrowDay === 1) {
      this.navigateToRead('DayMonth', 140, 150);
    } else {
      const range = this.tehilimDaysInMonth[this.selectedDayInMonth - 1];
      this.navigateToRead('DayMonth', range.start, range.end);
    }
  }

  goToTehilimDayWeek() {
    const range = this.tehilimDaysInWeek[this.selectedDayInWeek - 1];
    this.navigateToRead('DayWeek', range.start, range.end);
  }

  goToTehilimBook() {
    this.storage.set('selectedBook', this.selectedBook);
    const range = this.tehilimBooks[this.selectedBook - 1];
    this.navigateToRead('BookNum', range.start, range.end);
  }

  goToAllTehilim() {
    this.navigateToRead('AllTehilim', 1, 150);
  }

  goToTikunHaklali() {
    this.navigateToRead('TikunHaklali', 0, 0);
  }

  async goToFavorites() {
    await this.loadFavorites();
    if (this.favorites && this.favorites.length > 0) {
      this.router.navigate(['/read-tehilim'], {
        queryParams: {
          typeOfRead: 'Favorites',
          favorites: this.favorites.join(','),
        },
      });
    } else {
      this.presentToast('No Favorites chosen yet. Please add some.');
    }
  }

  goToZhuiot() {
    this.router.navigate(['/read-tehilim'], {
      queryParams: { typeOfRead: 'Zhuiot' },
    });
  }

  goToHistory() {
    this.router.navigate(['/read-history']);
  }

  counter(i: number) {
    return new Array(i);
  }

  private navigateToRead(typeOfRead: string, start: number, end: number) {
    this.router.navigate(['/read-tehilim'], {
      queryParams: { typeOfRead, start, end },
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
