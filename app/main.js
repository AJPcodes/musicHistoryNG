//initialize app
var app = angular.module('MusicHistoryApp', ["firebase", 'angular.filter'])

//controller to populate filter options
app.controller('FilterCtrl',['$scope','$rootScope', '$firebaseObject', function($scope, $rootScope, $firebaseObject) {

	//create a globally available 'songs' object
	$rootScope.songs = {};
	var ref = new Firebase("https://ajpmusichistory.firebaseio.com/songs/songs");
  // download the data into a local object
  $rootScope.songs = $firebaseObject(ref);
	//populate songs object from firebase


}]); //end TodoCtrl