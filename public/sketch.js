var socket;

socket = io.connect('http://192.168.1.110:3000');
socket.on('UpdateOthers', UpdateOthers);
socket.on('newUser', newUser);
socket.on('userLeft', userLeft);
var earth;

var users={};

var thisUser={
	lat:0,
	lon:0,
	id:null,
};

var markers = [];

function initialize() {

	var options = {atmosphere: true, center: [0, 0], zoom: 0};

	earth = new WE.map('earth_div', options);
	WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
		minZoom: 0,
		maxZoom: 5,
		attribution: 'Siroi'
	}).addTo(earth);

	getLocation();

}


var Location={lat:0,lon:0};
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(updatePosition);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function updatePosition(position) {
	Location.lat=position.coords.latitude + Math.random()*10-5;
	Location.lon=position.coords.longitude+ Math.random()*10-5;
	earth.setCenter([Location.lat, Location.lon]);
	var marker = WE.marker([Location.lat, Location.lon]).addTo(earth)
	thisUser.lat=Location.lat;
	thisUser.lon=Location.lon;
	socket.emit('newLocation',thisUser);
}
function UpdateOthers(others) {
	users=others;
	refreshMarkers();
}
function newUser(user) {
	users[user.id]=user;
	thisUser=user;
	refreshMarkers();
}
function userLeft(arg){
	users=arg;
	for (var i = markers.length - 1; i >= 0; i--) {
		markers[i].removeFrom(earth);
	}
	markers=[];
	refreshMarkers();
}
function refreshMarkers() {
	Object.keys(users).forEach(function (key){
		var m = WE.marker([users[key].lat, users[key].lon]).addTo(earth);
		markers.push(m);
	});

	earth.setCenter([Location.lat, Location.lon]);
}