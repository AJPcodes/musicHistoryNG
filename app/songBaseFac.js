//factory for working with user's songs
app.factory("songBase", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {


		//create a globally available 'songs' object
	var songsObject = {};
	var songsArray = [];
	var currentUser, ref;


  return {
  	setUser: function(userData) {
  		currentUser = userData;
  		ref = new Firebase("https://ajpmusichistory.firebaseio.com/users/" + currentUser.uid + "/songs");
  		  // download the data into a local object
  		songsObject = $firebaseObject(ref);
 		 	songsArray = $firebaseArray(ref);
  	},
    getSongsObject: function() {
      return songsObject;
    },
    getSongsArray: function() {
      return songsArray;
    },
    getSong: function(key) {
      return songsArray.filter(function(song){
      	// console.log(key);
      	// console.log(song.key);
      	// console.log(song.key == key);
        return song.key == key;
      })[0];
    },
    addSong: function(newSong) {
      // song_list.push(song);
			songsArray.$add(newSong)
				.then(function(newSongRef) {
					//add generated key as 'key' and save again
		  		var id = newSongRef.key();
		  		// console.log("added record with id " + id);
					var index = songsArray.$indexFor(id);
					// console.log(index);
					songsArray[index].key = id;
					songsArray.$save(index);
				}); //end then
   	}, //end add song
		removeSong: function(songKey) {
					var index = songsArray.$indexFor(songKey);
					songsArray.$remove(index);
   	}, //end remove song
   	editSong: function(editedSongData) {
   		var index = songsArray.$indexFor(editedSongData.key);
   		songsArray[index] = editedSongData;
   		songsArray.$save(index);

   	} //end edit song
  }; //end return

}]);
