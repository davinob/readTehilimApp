import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonSegment, IonSegmentButton,
  IonLabel, IonList, IonItem, IonBadge, IonButton, IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

interface ReadEntry {
  date: string;
  chapter: number;
  timestamp: number;
}

interface ChapterWithCount {
  chapter: number;
  count: number;
}

interface DayGroup {
  date: string;
  displayDate: string;
  chapters: ChapterWithCount[];
  totalReadings: number;
}

interface ChapterStat {
  chapter: number;
  count: number;
}

@Component({
  selector: 'app-read-history',
  templateUrl: 'read-history.page.html',
  styleUrls: ['read-history.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonSegment, IonSegmentButton,
    IonLabel, IonList, IonItem, IonBadge, IonButton, IonIcon,
  ],
})
export class ReadHistoryPage implements OnInit {
  selectedTab: string = 'daily';
  dayGroups: DayGroup[] = [];
  chapterStats: ChapterStat[] = [];

  constructor(
    private alertCtrl: AlertController,
  ) {
    addIcons({ trashOutline });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadHistory();
  }

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  loadHistory() {
    const raw = localStorage.getItem('readHistory');
    const history: ReadEntry[] = raw ? JSON.parse(raw) : [];

    this.buildDayGroups(history);
    this.buildChapterStats(history);
  }

  private buildDayGroups(history: ReadEntry[]) {
    const map = new Map<string, Map<number, number>>();

    for (const entry of history) {
      if (!map.has(entry.date)) map.set(entry.date, new Map());
      const dayCounts = map.get(entry.date)!;
      dayCounts.set(entry.chapter, (dayCounts.get(entry.chapter) || 0) + 1);
    }

    this.dayGroups = Array.from(map.entries())
      .map(([date, dayCounts]) => {
        const chapters = Array.from(dayCounts.entries())
          .map(([chapter, count]) => ({ chapter, count }))
          .sort((a, b) => a.chapter - b.chapter);
        return {
          date,
          displayDate: this.formatDate(date),
          chapters,
          totalReadings: chapters.reduce((sum, c) => sum + c.count, 0),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  private buildChapterStats(history: ReadEntry[]) {
    const counts = new Map<number, number>();

    for (const entry of history) {
      counts.set(entry.chapter, (counts.get(entry.chapter) || 0) + 1);
    }

    this.chapterStats = Array.from(counts.entries())
      .map(([chapter, count]) => ({ chapter, count }))
      .sort((a, b) => a.chapter - b.chapter);
  }

  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  async clearHistory() {
    const alert = await this.alertCtrl.create({
      header: 'Clear History',
      message: 'Are you sure you want to clear all reading history?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            localStorage.removeItem('readHistory');
            this.dayGroups = [];
            this.chapterStats = [];
          },
        },
      ],
    });
    await alert.present();
  }
}
