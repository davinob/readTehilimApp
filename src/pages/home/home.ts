import { Component } from '@angular/core';
import { NavController,PopoverController, ToastController } from 'ionic-angular';



import Hebcal from "hebcal";

import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todayDayInMonth:number;
  tomorrowDay:number;
  todayDayInWeek:number;
  selectedDayInWeek:number;
  selectedDayInMonth:number;

  showFavorites:boolean=false;
  selectedFavorites:Array<number>;

  selectOptions = {
    title: 'Favorites',
    mode: 'md'
  };

  tehilimDaysInMonth=[
    {start:1, end:9},
    {start:10,end:17},
    {start:18,end:22},
    {start:23,end:28},
    {start:29,end:34},
    {start:35,end:38},
    {start:39,end:43},
    {start:44,end:48},
    {start:49,end:54},
    {start:55,end:59},
    {start:60,end:65},
    {start:66,end:68},
    {start:69,end:71},
    {start:72,end:76},
    {start:77,end:78},
    {start:79,end:82},
    {start:83,end:87},
    {start:88,end:89},
    {start:90,end:96},
    {start:97,end:103},
    {start:104,end:105},
    {start:106,end:107},
    {start:108,end:112},
    {start:113,end:118},
    {start:119.1,end:119.1},
    {start:119.2,end:119.2},
    {start:120,end:134},
    {start:135,end:139},
    {start:140,end:144},
    {start:145,end:150}
  ];

  tehilimDaysInWeek=[
    {start:1, end:29},
    {start:30,end:50},
    {start:51,end:72},
    {start:73,end:89},
    {start:90,end:106},
    {start:107,end:120},
    {start:121,end:150}
  ];
  

  favorites:Array<number>;

  constructor(public navCtrl: NavController,public toastCtrl:ToastController,public popoverCtrl: PopoverController,public storage:Storage) {
    this.getTodayDate();
    this.selectedDayInWeek=this.todayDayInWeek;
    this.selectedDayInMonth=this.todayDayInMonth;
    

  }

  presentPopoverFavorites(myEvent) {
    let popover = this.popoverCtrl.create('FavoritesChoosePage');
    popover.present({
      ev: myEvent
    });
  }

  async loadFavorites()
  {
    this.favorites= await this.storage.get('favorites');
    if (!this.favorites)
    this.favorites=new Array();
  }

  getTodayDate():string
  {
    let hebcal = new Hebcal();
    let todayDayHeb=hebcal.find('today')[0];
   
    this.todayDayInMonth = todayDayHeb.day;
    this.tomorrowDay = hebcal.find('tomorrow')[0].day;
    let date=new Date();
    this.todayDayInWeek=date.getDay()+1;
    let dayNames=["Monday","Tuesday","Wednesday","Thursday","Friday","Shabbat","Sunday"];
   
    return dayNames[date.getDay()-1]+" "+todayDayHeb.toString();

    
  }

 

  goToTehilimDayMonth(){

    console.log(this.todayDayInMonth-1);
    console.log(this.tehilimDaysInMonth[0]);

    if (this.todayDayInMonth==29&&this.tomorrowDay==1)
    {
      this.navCtrl.push('ReadTehilimPage',{typeOfRead:"DayMonth",start:140,end:150});
   
    }
    else
    {
    this.navCtrl.push('ReadTehilimPage',{typeOfRead:"DayMonth",start:this.tehilimDaysInMonth[this.selectedDayInMonth-1].start,end:this.tehilimDaysInMonth[this.selectedDayInMonth-1].end});
    }
  }

  goToTehilimDayWeek(){

    console.log(this.selectedDayInWeek-1);
    console.log(this.tehilimDaysInWeek[0]);
    
    
    this.navCtrl.push('ReadTehilimPage',{typeOfRead:"DayWeek",start:this.tehilimDaysInWeek[this.selectedDayInWeek-1].start,end:this.tehilimDaysInWeek[this.selectedDayInWeek-1].end});
  }

  goToAllTehilim()
  {
    this.navCtrl.push('ReadTehilimPage',{typeOfRead:"AllTehilim",start:1,end:150});
  
  }

  goToTikunHaklali()
  {
    this.navCtrl.push('ReadTehilimPage',{typeOfRead:"TikunHaklali",start:0,end:0});
  }

  counter(i: number) {
    return new Array(i);
  }

  async goToFavorites()
  {
    await this.loadFavorites();
    console.log("THE FAVORITES");
    console.log(this.favorites);
    console.log(this.favorites.length);
    if (this.favorites && this.favorites.length>0)
      this.navCtrl.push('ReadTehilimPage',{typeOfRead:"Favorites",favorites:this.favorites});
    else
      this.presentToast("No Favorites chosen yet. Please add some.");
  }



  presentToast(message:any)
  {
    console.log("TOAST:");
    console.log(message);
    var errorMessage: string = message;
    let toast = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
} 

