import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-read-tehilim',
  templateUrl: 'read-tehilim.page.html',
  styleUrls: ['read-tehilim.page.scss'],
  imports: [CommonModule],
})
export class ReadTehilimPage implements OnInit {
  safeUrl: SafeResourceUrl | null = null;

  private start: number = 0;
  private end: number = 0;
  private favorites: number[] = [];
  private typeOfRead: string = '';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.typeOfRead = params['typeOfRead'] || '';
      this.start = parseFloat(params['start'] || '0');
      this.end = parseFloat(params['end'] || '0');

      if (params['favorites']) {
        this.favorites = params['favorites'].split(',').map(Number).filter((n: number) => !isNaN(n));
      }

      this.buildUrl();
    });
  }

  private makeFavoritesString(): string {
    return this.favorites.map(f => f.toString()).join(',');
  }

  private buildUrl() {
    let url = '';

    if (this.typeOfRead === 'Zhuiot') {
      url = 'assets/iframeTemplates/zhouiot.html';
    } else if (this.favorites.length > 0) {
      url = `assets/iframeTemplates/Tehilim/${this.favorites[0]}.html?typeOfRead=${this.typeOfRead}&favorites=${this.makeFavoritesString()}&start=${this.favorites[0]}`;
    } else if (this.typeOfRead === 'TikunHaklali') {
      url = `assets/iframeTemplates/Tehilim/16.html?typeOfRead=TikunHaklali&start=16&end=150`;
    } else if (this.start === 119.1) {
      url = `assets/iframeTemplates/Tehilim/119.html?typeOfRead=KYT&start=119&end=119&part1or2=1`;
    } else if (this.start === 119.2) {
      url = `assets/iframeTemplates/Tehilim/119.html?typeOfRead=KYT&start=119&end=119&part1or2=2`;
    } else {
      url = `assets/iframeTemplates/Tehilim/${this.start}.html?typeOfRead=${this.typeOfRead}&start=${this.start}&end=${this.end}`;
    }

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
