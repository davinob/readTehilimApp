
// ==================== FONT SIZE / ZOOM ====================

var ivritFont = parseInt(localStorage.getItem("ivritFont")) || 28;
var othersFont = parseInt(localStorage.getItem("othersFont")) || 23;
updateFont();

function updateFont() {
	var html = document.getElementsByTagName('html')[0];
	html.style.cssText =
		"--fontSizeIvrit:" + ivritFont + "px;" +
		"--fontSizeOthers:" + othersFont + "px;";
}

function zoomIn() {
	ivritFont = Math.min(ivritFont + 2, 60);
	othersFont = Math.min(othersFont + 2, 55);
	localStorage.setItem("ivritFont", ivritFont);
	localStorage.setItem("othersFont", othersFont);
	updateFont();
	showZoomToast();
}

function zoomOut() {
	ivritFont = Math.max(ivritFont - 2, 12);
	othersFont = Math.max(othersFont - 2, 10);
	localStorage.setItem("ivritFont", ivritFont);
	localStorage.setItem("othersFont", othersFont);
	updateFont();
	showZoomToast();
}

function zoomReset() {
	ivritFont = 28;
	othersFont = 23;
	localStorage.setItem("ivritFont", ivritFont);
	localStorage.setItem("othersFont", othersFont);
	updateFont();
	showZoomToast();
}

var zoomToastTimer = null;
function showZoomToast() {
	var t = document.getElementById('zoomToast');
	if (!t) return;
	t.textContent = Math.round((ivritFont / 28) * 100) + '%';
	t.classList.add('visible');
	clearTimeout(zoomToastTimer);
	zoomToastTimer = setTimeout(function () { t.classList.remove('visible'); }, 1200);
}

function initZoomControls() {
	if (document.getElementById('zoomControls')) return;

	var bar = document.createElement('div');
	bar.id = 'zoomControls';
	bar.innerHTML =
		"<button onclick='zoomOut()'>−</button>" +
		"<button onclick='zoomReset()'>⟲</button>" +
		"<button onclick='zoomIn()'>+</button>";
	document.body.appendChild(bar);

	var toast = document.createElement('div');
	toast.id = 'zoomToast';
	document.body.appendChild(toast);
}

function initPinchZoom() {
	var origDist = 0, scaling = false;
	document.body.addEventListener("touchstart", function (e) {
		if (e.touches.length === 2) {
			origDist = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY);
			scaling = true;
		}
	});

	document.body.addEventListener("touchmove", function (e) {
		if (!scaling || e.touches.length < 2) return;
		var curDist = Math.hypot(
			e.touches[0].pageX - e.touches[1].pageX,
			e.touches[0].pageY - e.touches[1].pageY);
		var ratio = curDist / origDist;
		if (ratio > 1.08) {
			zoomIn();
			origDist = curDist;
		} else if (ratio < 0.92) {
			zoomOut();
			origDist = curDist;
		}
	});

	document.body.addEventListener("touchend", function () {
		scaling = false;
		origDist = 0;
	});
}

// ==================== READ HISTORY TRACKING ====================

function startHistoryTracking() {
	var path = window.location.pathname;
	var match = path.match(/\/(\d+)\.html/);
	if (!match) return;
	var chapter = parseInt(match[1]);
	if (chapter < 1 || chapter > 150) return;

	var history = JSON.parse(localStorage.getItem("readHistory") || "[]");
	var now = new Date();
	var dateStr = now.getFullYear() + '-' +
		String(now.getMonth() + 1).padStart(2, '0') + '-' +
		String(now.getDate()).padStart(2, '0');

	history.push({
		date: dateStr,
		chapter: chapter,
		timestamp: now.getTime()
	});

	localStorage.setItem("readHistory", JSON.stringify(history));
}

// ==================== URL PARAMS & NAVIGATION ====================

	var url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);
	
	var start = searchParams.get('start');
	var end = searchParams.get('end');
	var part1or2 = searchParams.get('part1or2');
	var typeOfRead = searchParams.get('typeOfRead');
	var favorites = searchParams.get('favorites');

	var myFavorites;
	var lastStartForThisTypeOfRead;

	if (start)
	{
		localStorage.setItem('start', start);
		localStorage.setItem('end', end);
		localStorage.setItem('typeOfRead', typeOfRead);
		localStorage.setItem('favorites', favorites);

		lastStartForThisTypeOfRead = localStorage.getItem(typeOfRead + "Start");
		if (lastStartForThisTypeOfRead != start || typeOfRead == "KYT")
		{
			localStorage.setItem(typeOfRead + "Start", start);
		}
		else
		{
			let lastVisited = localStorage.getItem(typeOfRead + "LastVisited");
			let actualPage = window.location.href.substring(0, window.location.href.indexOf("?"));

			if (lastVisited && lastVisited != actualPage)
			{
				window.location.replace(lastVisited);
			}
		}
	}
	else
	{
		start = localStorage.getItem('start');
		end = localStorage.getItem('end');
		typeOfRead = localStorage.getItem('typeOfRead');
		favorites = localStorage.getItem('favorites');

		localStorage.setItem(typeOfRead + "LastVisited", window.location.href);
	}


function openNav() {
	document.getElementById("mySidenav").style.width = "50%";
	document.getElementById("buttonNav").style.display = "none";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("buttonNav").style.display = "";
}

document.addEventListener('DOMContentLoaded', function() {
	var btnHitPending = false;

	function hitTestBtn(x, y) {
		var btn = document.getElementById('buttonNav');
		if (!btn || btn.style.display === 'none') return false;
		var r = btn.getBoundingClientRect();
		return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
	}

	document.addEventListener('touchstart', function(e) {
		if (hitTestBtn(e.touches[0].clientX, e.touches[0].clientY)) {
			btnHitPending = true;
			openNav();
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}, true);

	document.addEventListener('click', function(e) {
		if (btnHitPending) {
			btnHitPending = false;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			return false;
		}
	}, true);
});


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
	initPinchZoom();
	initZoomControls();
	startHistoryTracking();

	activeClasses = localStorage.getItem('actives');
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

	if (part1or2 == 1)
	{
		document.getElementById("part2").style.display = 'none';
		start = 119;
		end = 119;
	}
	else if (part1or2 == 2)
	{
		document.getElementById("part1").style.display = 'none';
		start = 119;
		end = 119;
	}

	if (typeOfRead == "Favorites")
	{
		myFavorites = favorites.split(",");
		for (pageNum = 1; pageNum <= 150; pageNum++)
		{
			if (myFavorites.indexOf("" + pageNum) == -1)
			{
				document.getElementById("perekTitle" + pageNum).style.display = 'none';
				document.getElementById("perekTitleFoot" + pageNum).style.display = 'none';
			}
		}
	}
	else if (typeOfRead == "TikunHaklali")
	{
		start = 16;
		end = 150;
		var tikunHaklaliPrakim = [16, 32, 41, 42, 59, 77, 90, 105, 137, 150];
		for (pageNum = 1; pageNum <= 150; pageNum++)
		{
			if (tikunHaklaliPrakim.indexOf(pageNum) == -1)
			{
				document.getElementById("perekTitle" + pageNum).style.display = 'none';
				document.getElementById("perekTitleFoot" + pageNum).style.display = 'none';
			}
		}
		makeDisappearAppearDivsBasedOnClass("tikunHaklali", true);
	}
	else
	{
		for (pageNum = 1; pageNum < start; pageNum++)
		{
			document.getElementById("perekTitle" + pageNum).style.display = 'none';
			document.getElementById("perekTitleFoot" + pageNum).style.display = 'none';
		}

		let endFrom = parseInt(end) + 1;
		for (pageNum = endFrom; pageNum <= 150; pageNum++)
		{
			document.getElementById("perekTitle" + pageNum).style.display = 'none';
			document.getElementById("perekTitleFoot" + pageNum).style.display = 'none';
		}
	}

	makeDisappearAppearDivsBasedOnClass("theContent", true);

	var myElement = document.getElementById('linkSelectedHead');
	var prakimHead = document.getElementById('prakimHead');
	var prakimFoot = document.getElementById('prakimFoot');
	if (myElement && prakimHead && prakimFoot) {
		var scrollBarMiddle = prakimHead.offsetWidth / 2;
		var leftPos = myElement.offsetLeft;
		prakimHead.scrollLeft = leftPos - scrollBarMiddle;
		prakimFoot.scrollLeft = leftPos - scrollBarMiddle;
	}

}



function hideShow(theClass, obj) {
	if (obj.className == "button") {
		obj.className = obj.className.replace("button", "button active");
		activeClasses[theClass] = true;
		localStorage.setItem('actives', JSON.stringify(activeClasses));
	}
	else {
		obj.className = obj.className.replace("button active", "button");
		activeClasses[theClass] = false;
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
	var elements = document.getElementsByClassName(theClass), i;
	for (i = 0; i < elements.length; i += 1) {
		if (toAppear) {
			elements[i].style.display = '';
		} else {
			elements[i].style.display = 'none';
		}
	}
}
