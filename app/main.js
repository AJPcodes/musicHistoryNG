//initialize app
var app = angular.module('MusicHistoryApp', ["firebase", 'angular.filter', 'ngRoute']);


//Setting Up routes
app.config(['$routeProvider', function($routeProvider){

	//route for main song view
	$routeProvider
		.when('/logIn', {
			templateUrl: 'partials/logIn.html',
			controller: 'AuthCtrl as authCtrl'
		})
		.when('/register', {
			templateUrl: 'partials/register.html',
			controller: 'AuthCtrl as authCtrl'
		})
		.when('/songs/list', {
			templateUrl: 'partials/songList.html',
			controller: 'ShowSongsCtrl as showSongsCtrl'
		})
		//route for add song form
		.when('/songs/new', {
			templateUrl: 'partials/songForm.html',
			controller: 'AddSongCtrl as addSongCtrl'
	})
    .when('/songs/:songKey', {
      templateUrl: 'partials/singleSong.html',
      controller: 'SingleSongCtrl as singleSongCtrl'
    })
    .otherwise({ redirectTo: 'logIn' });

}]);




