app.directive('songDisplayDir', ['songBase', function(songBase){
	return {
		restrict: 'A', //E for element or A for attribute
		templateUrl: '../../partials/songDisplay.html',
   	link: function(scope, elem, attrs) {
			scope.maxRating = 5;
      /*
        Create a new key on the song called `stars`. It's
        an array of objects. Each object contains which
        class to use on each of the stars.
       */
      function setStars() {
        scope.stars = [];
        var rating = parseInt(scope.song.rating);
        for (var i = 0; i < scope.maxRating; i++) {
          var clazz = (rating <= i) ? "star--empty" : "star--filled";
          scope.stars.push({class: clazz,
            value: i + 1,
            key: scope.song.key});
        }
      }

      /*
        Since the selectedSong in the `song-view` template
        is bound directly to an object in the controller
        that gets updated after an XHR, I have to watch that
        variable for changes and then run the logic again
        once it gets updated values.
       */

      scope.songsArray = songBase.getSongsArray;
      scope.$watch(function(){
        return songBase.reloadStars;
      }, function(){
        setStars();
        console.log('reloading stars');
        songBase.reloadStars = false;
      });

      setStars();
    }
	};
}]);