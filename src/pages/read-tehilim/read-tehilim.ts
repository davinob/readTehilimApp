import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the ReadTehilimPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-read-tehilim',
  templateUrl: 'read-tehilim.html',
})
export class ReadTehilimPage {

  @ViewChild('myObjectView') myObjectView;

  

  start:number;
  end:number;
  url:string;
  favorites:Array<number>;
  typeOfRead:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.start=navParams.get('start');
    this.end=navParams.get('end');
    this.favorites=navParams.get('favorites');
    this.typeOfRead=navParams.get('typeOfRead');
    
    
  }
  
 
  
makeFavoritesString():string
{
  let favStr="";
this.favorites.forEach(element => {
  favStr=element+","+favStr;
});
return favStr;
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadTehilimPage');

    if (this.typeOfRead=="Zhuiot")
    {
      this.url="assets/iframeTemplates/zhouiot.html";
      this.myObjectView.nativeElement.data=this.url;

      return;
    }
   
  this.url="assets/iframeTemplates/Tehilim/"+this.start+".html?typeOfRead="+this.typeOfRead+"&start="+this.start+"&end="+this.end;

  if (this.favorites)
  {
    
    this.url="assets/iframeTemplates/Tehilim/"+this.favorites[0]+".html?typeOfRead="+this.typeOfRead+"&favorites="+this.makeFavoritesString()+"&start="+this.favorites[0];
  }

  if (this.start==119.1)
  {
    this.url="assets/iframeTemplates/Tehilim/119.html?typeOfRead=KYT&start=119&end=119&part1or2=1";
  }
  if (this.start==119.2)
  {
    this.url="assets/iframeTemplates/Tehilim/119.html?typeOfRead=KYT&start=119&end=119&part1or2=2";
  }
  
  if (this.start==0)//tikunHaklali
  {
    console.log("TIKUN HAKLALI");
    this.url="assets/iframeTemplates/Tehilim/16.html?typeOfRead="+this.typeOfRead+"&start=16&end=150&typeOfRead=TikunHaklali";
  }
  

  console.log(this.url);
    console.log(this.myObjectView);
    this.myObjectView.nativeElement.data=this.url;
  }


 

}
