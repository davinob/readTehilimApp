import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  @ViewChild(Content) content: Content;

 

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad SettingsPage');
    this.updateOnInit();
  }

  async updateOnInit()
  {
    await this.loadSettings();
    setTimeout(() => {
      this.pirushim.forEach(pirush=>this.updateFont(pirush));
      console.log("Update done");
      this.content.resize();
  }, 100);
    
  }

  async loadSettings()
  {
    this.pirushim= await this.storage.get('pirushimSettings');
    if (!this.pirushim)
    {
    this.pirushim=[{
      name:"passukIvrit",
      title:"פסוק בעברית",
      size:23,
      font:"Arial"},
      {
        name:"passukEn",
        title:"English",
        size:23,
        font:"Arial"},
      {
        name:"passukFr",
        title:"Français",
        size:23,
        font:"Arial"},
    
        {
          name:"rashi",
          title:"רש\"י",
          size:23,
          font:"Arial"}
          ,
          {
            name:"mezudatDavid",
            title:"מצודת דוד",
            size:23,
            font:"Arial"}
            ,
            {
              name:"mezudatZion",
              title:"מצודת ציון",
              size:23,
              font:"Arial"
            }
  
            ,
            {
              name:"malbim",
              title:"מלבים",
              size:23,
              font:"Arial"}
  
       /* {
          name:"onkelos",
          title:"אונקלוס",
          size:23,
          font:"Arial"}
          ,
          {
            name:"ralbag",
            title:"רלבג",
            size:23,
            font:"Arial"}
          */
       
      ];
    }
  
  
  console.log(this.pirushim);
  }



  pirushim:Array<any>=new Array();

  fonts=["Alef", "David","Rubik","Hillel","Hadasim",  "Arial", "Times New Roman"];


async updateStorageAndFont(pirush)
{
   this.updateFont(pirush);
  this.storage.set("pirushimSettings",this.pirushim);


}

updateFont(pirush)
{
  let eleme:HTMLElement=document.getElementById('font'+pirush.name);
  eleme.setAttribute("style","font-size:"+pirush.size+ "px; font-family:"+pirush.font);
  this.setCssText();
  
}

setCssText()
{
  let cssText=
	" --fontSizeIvrit:"+this.pirushim.find(pirush=>pirush.name=="passukIvrit").size+"px;"+
	" --fontSizepassukFr:"+this.pirushim.find(pirush=>pirush.name=="passukFr").size+"px;"+
	" --fontSizepassukEn:"+this.pirushim.find(pirush=>pirush.name=="passukEn").size+"px;"+
   " --fontSizerashi:"+this.pirushim.find(pirush=>pirush.name=="rashi").size+"px;"+
//    " --fontSizeonkelos:"+this.pirushim.find(pirush=>pirush.name=="onkelos").size+"px;"+
    " --fontSizemezudatDavid:"+this.pirushim.find(pirush=>pirush.name=="mezudatDavid").size+"px;"+
  //  " --fontSizeralbag:"+this.pirushim.find(pirush=>pirush.name=="ralbag").size+"px;"+
   " --fontSizemalbim:"+this.pirushim.find(pirush=>pirush.name=="malbim").size+"px;"+
  " --fontSizemezudatZion:"+this.pirushim.find(pirush=>pirush.name=="mezudatZion").size+"px;"+
  " --fontFamilyIvrit:"+this.pirushim.find(pirush=>pirush.name=="passukIvrit").font+";"+
	" --fontFamilypassukFr:"+this.pirushim.find(pirush=>pirush.name=="passukFr").font+";"+
	" --fontFamilypassukEn:"+this.pirushim.find(pirush=>pirush.name=="passukEn").font+";"+
   " --fontFamilyrashi:"+this.pirushim.find(pirush=>pirush.name=="rashi").font+";"+
 //   " --fontFamilyonkelos:"+this.pirushim.find(pirush=>pirush.name=="onkelos").font+";"+
    " --fontFamilymezudatDavid:"+this.pirushim.find(pirush=>pirush.name=="mezudatDavid").font+";"+
//    " --fontFamilyralbag:"+this.pirushim.find(pirush=>pirush.name=="ralbag").font+";"+
   " --fontFamilymalbim:"+this.pirushim.find(pirush=>pirush.name=="malbim").font+";"+
  " --fontFamilymezudatZion:"+this.pirushim.find(pirush=>pirush.name=="mezudatZion").font+";"
  ;

  console.log("CSS text : "+cssText);
  this.storage.set("cssText",cssText);

  
}



}
