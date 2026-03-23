import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonRange, IonLabel, IonSelect, IonSelectOption,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';

interface Pirush {
  name: string;
  title: string;
  size: number;
  font: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonRange, IonLabel, IonSelect, IonSelectOption,
    IonButtons, IonBackButton,
  ],
})
export class SettingsPage implements OnInit {
  pirushim: Pirush[] = [];
  fonts = ['Alef', 'David', 'Rubik', 'Hillel', 'Hadasim', 'Arial', 'Times New Roman'];

  private readonly defaultPirushim: Pirush[] = [
    { name: 'passukIvrit', title: 'פסוק בעברית', size: 23, font: 'Arial' },
    { name: 'passukEn', title: 'English', size: 23, font: 'Arial' },
    { name: 'passukFr', title: 'Français', size: 23, font: 'Arial' },
    { name: 'rashi', title: 'רש"י', size: 23, font: 'Arial' },
    { name: 'mezudatDavid', title: 'מצודת דוד', size: 23, font: 'Arial' },
    { name: 'mezudatZion', title: 'מצודת ציון', size: 23, font: 'Arial' },
    { name: 'malbim', title: 'מלבים', size: 23, font: 'Arial' },
  ];

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async ionViewDidEnter() {
    await this.loadSettings();
    setTimeout(() => {
      this.pirushim.forEach(pirush => this.updateFont(pirush));
    }, 100);
  }

  async loadSettings() {
    const saved = await this.storage.get('pirushimSettings');
    this.pirushim = saved ?? [...this.defaultPirushim];
  }

  updateStorageAndFont(pirush: Pirush) {
    this.updateFont(pirush);
    this.storage.set('pirushimSettings', this.pirushim);
  }

  updateFont(pirush: Pirush) {
    const el = document.getElementById('font' + pirush.name);
    if (el) {
      el.setAttribute('style', `font-size:${pirush.size}px; font-family:${pirush.font}`);
    }
    this.setCssText();
  }

  private findPirush(name: string): Pirush {
    return this.pirushim.find(p => p.name === name) ?? { name, title: '', size: 23, font: 'Arial' };
  }

  setCssText() {
    const cssText =
      ` --fontSizeIvrit:${this.findPirush('passukIvrit').size}px;` +
      ` --fontSizepassukFr:${this.findPirush('passukFr').size}px;` +
      ` --fontSizepassukEn:${this.findPirush('passukEn').size}px;` +
      ` --fontSizerashi:${this.findPirush('rashi').size}px;` +
      ` --fontSizemezudatDavid:${this.findPirush('mezudatDavid').size}px;` +
      ` --fontSizemalbim:${this.findPirush('malbim').size}px;` +
      ` --fontSizemezudatZion:${this.findPirush('mezudatZion').size}px;` +
      ` --fontFamilyIvrit:${this.findPirush('passukIvrit').font};` +
      ` --fontFamilypassukFr:${this.findPirush('passukFr').font};` +
      ` --fontFamilypassukEn:${this.findPirush('passukEn').font};` +
      ` --fontFamilyrashi:${this.findPirush('rashi').font};` +
      ` --fontFamilymezudatDavid:${this.findPirush('mezudatDavid').font};` +
      ` --fontFamilymalbim:${this.findPirush('malbim').font};` +
      ` --fontFamilymezudatZion:${this.findPirush('mezudatZion').font};`;
    this.storage.set('cssText', cssText);
  }
}
