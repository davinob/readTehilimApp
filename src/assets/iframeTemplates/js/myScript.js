
	var url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);
	
	var start = searchParams.get('start');
	var end =searchParams.get('end');
	var part1or2 =searchParams.get('part1or2');
	var typeOfRead =searchParams.get('typeOfRead');
	var favorites =searchParams.get('favorites');
	var cssText=searchParams.get('cssText');

	console.log("CSS TEXT FROM PARAMS:"+cssText);
	
	if (cssText)
	{
		localStorage.setItem("cssText",cssText);
	}
	else
	{
		cssText=localStorage.getItem("cssText");
	}

	console.log(cssText);
	updateFont();

	var myFavorites;

	
	var lastStartForThisTypeOfRead;

	if (start)
	{
		localStorage.setItem('start', start);
		localStorage.setItem('end',end);
		localStorage.setItem('typeOfRead',typeOfRead);
		localStorage.setItem('favorites',favorites);


		lastStartForThisTypeOfRead=localStorage.getItem(typeOfRead+"Start");
		console.log("LAST START AND NEW START");
		console.log(lastStartForThisTypeOfRead);
		console.log(start);
		if (lastStartForThisTypeOfRead!=start ||typeOfRead=="KYT") //in that case no need to update to LastPageSeen for this Type of read
		{
			localStorage.setItem(typeOfRead+"Start",start);
		}
		else
		{
			let lastVisited = localStorage.getItem(typeOfRead+"LastVisited");
			console.log(lastVisited);
			
			let actualPage=window.location.href.substring(0,window.location.href.indexOf("?"));
			console.log(actualPage);

			if (lastVisited && lastVisited!=actualPage)
				 {
					window.location.replace(lastVisited);
				
				}
		}
		
	}
	else
	{
	

	start=localStorage.getItem('start');
	end=localStorage.getItem('end');
	typeOfRead=localStorage.getItem('typeOfRead');
	favorites=localStorage.getItem('favorites');
	

	localStorage.setItem(typeOfRead+"LastVisited",window.location.href);
	console.log("I PUT the last visited: "+typeOfRead+"LastVisited : "+window.location.href);
		
	}


function openNav() {
    document.getElementById("mySidenav").style.width = "50%";
	document.getElementById("buttonNav").style.display = "none";
	}

			function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("buttonNav").style.display = "";
	}



function updateFont()
{
	var html=document.getElementsByTagName('html')[0];
	if (cssText==null ||cssText=="NaN")
	{
		console.log("CSS TEXT NULL OR NAN");
		cssText="  --fontSizeIvrit:28px;"+
		"--fontFamilyIvrit:'Arial';"+
		"--fontSizepassukFr:23px;"+
		"--fontFamilypassukFr:'Arial';"+
		"--fontSizepassukEn:23px;"+
		"--fontFamilypassukEn:'Arial';"+
		"--fontSizerashi:23px;"+
		"--fontFamilyrashi:'Arial';"+
		"--fontSizeonkelos:23px;"+
		"--fontFamilyonkelos:'Arial';"+
		"--fontSizemezudatDavid:23px;"+
		"--fontFamilymezudatDavid:'Arial';"+
		"--fontSizeralbag:23px;"+
		"--fontFamilyralbag:'Arial';"+
		"--fontSizemalbim:23px;"+
		"--fontFamilymalbim:'Arial';"+
		"--fontSizemezudatZion:23px;"+
		"--fontFamilymezudaZion:'Arial';"
	}

	console.log(cssText);
	html.style.cssText=cssText;
}






	

function hideShowById(id) {
	var x = document.getElementById(id);
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
}



var activeClasses;




	



function initClassesBasedOnCookies() {

	activeClasses = localStorage.getItem('actives');
	console.log(activeClasses);
	if (activeClasses == null) {
		activeClasses = {
			onkelos: true,
			yonatan: true,
			passukEn: true,
			passukFr: false,
			rashi: true,
			siftey: true,
			ibnEzra: true,
			ramban: true,
			sforno: true,
			baalHaturim: true,
			orHaHaim: true,
			kliYakar: true,
			malbim: true,
			ralbag: true,
			mezudatDavid: true,
			mezudatZion: true
		};
		localStorage.setItem('actives', JSON.stringify(activeClasses));
	}
	else {
		activeClasses = JSON.parse(activeClasses);
	}

	keys = Object.keys(activeClasses);



	for (i = 0; i < keys.length; i += 1) {
		var key = keys[i];
		var appear = activeClasses[key];
		if (document.getElementById(key) != null) {
			makeDisappearAppearDivsBasedOnClass(key, appear);
			if (appear) {
				document.getElementById(key).className = document.getElementById(key).className.replace("button", "button active");
			}
			else {
				document.getElementById(key).className = document.getElementById(key).className.replace("button active", "button");
			}


		}
	}


	console.log(url);
	console.log(start);
	console.log(end);
	console.log(part1or2);

	if (part1or2==1)
	{
		document.getElementById("part2").style.display = 'none';
		start=119;
		end=119;
	}
	else
	if (part1or2==2)
	{
		document.getElementById("part1").style.display = 'none';
		start=119;
		end=119;
	}



	if (typeOfRead=="Favorites") //Favorites
	{
		myFavorites=favorites.split(",");
	
		
		for (pageNum=1;pageNum<=150;pageNum++)
			{
				
				if (myFavorites.indexOf(""+pageNum)==-1)
				{
				document.getElementById("perekTitle"+pageNum).style.display = 'none';
				document.getElementById("perekTitleFoot"+pageNum).style.display = 'none';
	
				}
			}
	}
	else
	if (typeOfRead=="TikunHaklali") //tikun haklali
	{
	start=16;
	end=150;
	var tikunHaklaliPrakim=[16,32,41,42,59,77,90,105,137,150];
	for (pageNum=1;pageNum<=150;pageNum++)
		{
			if (tikunHaklaliPrakim.indexOf(pageNum)==-1)
			{
			document.getElementById("perekTitle"+pageNum).style.display = 'none';
			document.getElementById("perekTitleFoot"+pageNum).style.display = 'none';

			}
		}
		makeDisappearAppearDivsBasedOnClass("tikunHaklali", true);
		
	}	
		else
	{
	
	
		for (pageNum=1;pageNum<start;pageNum++)
		{
    
			document.getElementById("perekTitle"+pageNum).style.display = 'none';
			document.getElementById("perekTitleFoot"+pageNum).style.display = 'none';
		}
	
		let endFrom=parseInt(end)+1;
	
    	for (pageNum=endFrom;pageNum<=150;pageNum++)
		{
     	
			document.getElementById("perekTitle"+pageNum).style.display = 'none';
			document.getElementById("perekTitleFoot"+pageNum).style.display = 'none';
		}
	
	}



		makeDisappearAppearDivsBasedOnClass("theContent", true);


			//Setting the chapters toolbar in the center of the screen where num is chosen
	console.log(document.getElementById('linkSelectedHead'));
	console.log(document.getElementById('prakimHead')); 
		var myElement = document.getElementById('linkSelectedHead');
		var scrollBarMiddle = document.getElementById('prakimHead').offsetWidth / 2;
		var leftPos = myElement.offsetLeft;
		console.log(myElement);
		console.log(scrollBarMiddle);
	  console.log(leftPos);
	
		document.getElementById('prakimHead').scrollLeft = leftPos - scrollBarMiddle;
		document.getElementById('prakimFoot').scrollLeft = leftPos - scrollBarMiddle;
	
	

}



function hideShow(theClass, obj) {
	console.log(obj);
	if (obj.className == "button") {
		obj.className = obj.className.replace("button", "button active");
		console.log(activeClasses[theClass]);
		console.log(theClass);
		activeClasses[theClass] = true;
		console.log(activeClasses);
		localStorage.setItem('actives', JSON.stringify(activeClasses));

	}
	else {
		obj.className = obj.className.replace("button active", "button");
		console.log(activeClasses[theClass]);
		console.log(theClass);
		activeClasses[theClass] = false;
		console.log(activeClasses);
		localStorage.setItem('actives', JSON.stringify(activeClasses));
	}


	var elements = document.getElementsByClassName(theClass), i;
	for (i = 0; i < elements.length; i += 1) {
		if (elements[i].style.display === 'none') {
			elements[i].style.display = '';
		} else {
			elements[i].style.display = 'none';
		}
	}
}

function makeDisappearAppearDivsBasedOnClass(theClass, toAppear) {
	//console.log(theClass);
	var elements = document.getElementsByClassName(theClass), i;
//	console.log(elements);
	
	for (i = 0; i < elements.length; i += 1) {
		if (toAppear) {
			elements[i].style.display = '';
		} else {
			elements[i].style.display = 'none';
		}
	}

}