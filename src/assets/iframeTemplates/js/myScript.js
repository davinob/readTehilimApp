
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

var tehilimReadTime = {
	1:13,2:18,3:14,4:15,5:22,6:17,7:28,8:15,9:34,10:34,
	11:14,12:16,13:11,14:14,15:11,16:18,17:26,18:78,19:26,20:14,
	21:21,22:50,23:11,24:18,25:30,26:17,27:29,28:18,29:18,30:19,
	31:43,32:22,33:31,34:32,35:45,36:19,37:58,38:33,39:25,40:36,
	41:23,42:26,43:11,44:38,45:31,46:20,47:15,48:22,49:32,50:34,
	51:30,52:17,53:15,54:12,55:38,56:24,57:21,58:20,59:30,60:23,
	61:13,62:22,63:18,64:17,65:22,66:29,67:11,68:63,69:56,70:10,
	71:39,72:32,73:39,74:38,75:17,76:17,77:31,78:106,79:26,80:28,
	81:25,82:12,83:25,84:23,85:18,86:29,87:11,88:29,89:75,90:28,
	91:22,92:22,93:9,94:33,95:18,96:22,97:19,98:15,99:17,100:9,
	101:16,102:42,103:33,104:53,105:58,106:66,107:57,108:19,109:45,110:12,
	111:15,112:16,113:11,114:11,115:26,116:25,117:3,118:39,119:207,120:10,
	121:11,122:13,123:8,124:12,125:10,126:10,127:11,128:10,129:11,130:11,
	131:6,132:26,133:7,134:5,135:33,136:33,137:16,138:14,139:36,140:23,
	141:19,142:15,143:22,144:27,145:29,146:17,147:28,148:21,149:13,150:8
};

var _historyTimer = null;

function startHistoryTracking() {
	var path = window.location.pathname;
	var match = path.match(/\/(\d+)\.html/);
	if (!match) return;
	var chapter = parseInt(match[1]);
	if (chapter < 1 || chapter > 150) return;

	var delaySec = tehilimReadTime[chapter] || 30;
	var delayMs = delaySec * 1000;

	if (_historyTimer) clearTimeout(_historyTimer);
	_historyTimer = setTimeout(function () {
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
	}, delayMs);
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

	var _todayStr = (function() {
		var d = new Date();
		return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
	})();

	if (start)
	{
		localStorage.setItem('start', start);
		localStorage.setItem('end', end);
		localStorage.setItem('typeOfRead', typeOfRead);
		localStorage.setItem('favorites', favorites);

		var storedKey = typeOfRead + "Start";
		var lastStart = localStorage.getItem(storedKey);

		// Use per-start keys so different 'start' values (e.g., different days) keep their own lastVisited.
		var lastVisitedKey = typeOfRead + "LastVisited:" + start;
		var lastVisitedDateKey = typeOfRead + "LastVisitedDate:" + start;
		var lastVisited = localStorage.getItem(lastVisitedKey);
		var lastDate = localStorage.getItem(lastVisitedDateKey);

		// For 'AllTehilim' we want to remember the last visited chapter across days,
		// so the user can continue reading sequentially. Other views reset daily.
		var requireSameDay = typeOfRead !== 'AllTehilim';
		if (lastStart == start && (!requireSameDay || lastDate == _todayStr) && lastVisited)
		{
			var actualPage = window.location.href.substring(0, window.location.href.indexOf("?"));
			if (lastVisited != actualPage)
			{
				window.location.replace(lastVisited);
			}
		}

		localStorage.setItem(storedKey, start);
	}
	else
	{
		start = localStorage.getItem('start');
		end = localStorage.getItem('end');
		typeOfRead = localStorage.getItem('typeOfRead');
		favorites = localStorage.getItem('favorites');

		// store last visited per start so different choices don't interfere
		var key = typeOfRead + "LastVisited:" + start;
		var dateKey = typeOfRead + "LastVisitedDate:" + start;
		localStorage.setItem(key, window.location.href);
		localStorage.setItem(dateKey, _todayStr);
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
