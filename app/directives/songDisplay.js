app.directive('songDisplayDir', ['songBase', function(songBase){
	return {
		restrict: 'A', //E for element or A for attribute
		templateUrl: '../../partials/songDisplay.html',
    scope:{

      selectedSong: "=song",
      rate: "=rate",
      reloadStars: "=reloadStars"

    },
   	link: function(scope, elem, attrs) {
			scope.maxRating = 5;
      /*
        Create a new key on the song called `stars`. It's
        an array of objects. Each object contains which
        class to use on each of the stars.
       */
      scope.setStars = function() {
        scope.stars = [];
        var rating = parseInt(scope.selectedSong.rating);
        for (var i = 0; i < scope.maxRating; i++) {
          var clazz = (rating <= i) ? "star--empty" : "star--filled";
          scope.stars.push({class: clazz,
            value: i + 1,
            key: scope.selectedSong.key});
        }
      }

      scope.setStars();
    }
	};
}]);