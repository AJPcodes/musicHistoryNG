//initialize app
var app = angular.module('MusicHistoryApp', ["firebase", 'angular.filter', 'ngRoute'])

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/songs/list', {
			templateUrl: 'partials/songList.html',
			controller: 'showSongsCtrl'
		})
		.when('/songs/new', {
			templateUrl: 'partials/songForm.html',
			controller: 'addSongCtrl'
		})

}]);

//controller to populate filter options
app.controller('showSongsCtrl',['$scope','$rootScope', '$firebaseObject', '$firebaseArray', function($scope, $rootScope, $firebaseObject, $firebaseArray) {

	//create a globally available 'songs' object
	$scope.songs = {};
	$scope.songsArray = [];

	var ref = new Firebase("https://ajpmusichistory.firebaseio.com/songs/songs");
  // download the data into a local object
  $scope.songs = $firebaseObject(ref);
  $scope.songsArray = $firebaseArray(ref);

	//populate songs object from firebase

}]); //end TodoCtrl

//controller to populate filter options
app.controller('addSongCtrl',['$scope','$rootScope', '$firebaseObject', '$firebaseArray', function($scope, $rootScope, $firebaseObject, $firebaseArray) {


	var ref = new Firebase("https://ajpmusichistory.firebaseio.com/songs/songs");
  // create a synchronized array
  var songsArray = $firebaseArray(ref);
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addNew = function(){
  	//check if fields are entered
  	if ($scope.newSongTitle.length > 0 &&
  			$scope.newSongArtist.length > 0 &&
  			$scope.newSongAlbum.length > 0 &&
  			$scope.newSongGenre.length > 0){

  		//build the new song
	  	var newSong = {
			title: $scope.newSongTitle,
			artist: $scope.newSongArtist,
			album: $scope.newSongAlbum,
			genre: $scope.newSongGenre
		};

			songsArray.$add(newSong)
				.then(function(ref) {
					//add generated key as 'key' and save again
		  		var id = ref.key();
		  		console.log("added record with id " + id);
					var index = songsArray.$indexFor(id);
					console.log(index);
					songsArray[index].key = id;
					songsArray.$save(index);
				});
				//reset fields
			$scope.newSongTitle = "";
			$scope.newSongArtist = "";
			$scope.newSongAlbum = "";
			$scope.newSongGenre = "";
		} //end if

	}; //end add new
}]); //end addSongCtrl

