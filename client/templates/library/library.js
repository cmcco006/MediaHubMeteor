
/* Event handler that triggers when the YouTube player is ready */
onReady = function (event) {
  player.playVideo();
  Session.set('CurrentPlayingArrayNum', 0);
}

/* Event handler that triggers when the Youtube player changes state
  -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering
   5: video cued
*/
onStateChange = function (event) {
    if(player.getPlayerState() == 0){
      var sarr = Songs.find({userId: Meteor.userId()}).fetch();
      var next = Session.get('CurrentPlayingArrayNum') + 1;
      if(next >= sarr.length){
        next = 0;
        Session.set('CurrentPlayingArrayNum', 0);
      }
      else{
        Session.set('CurrentPlayingArrayNum', next);
      }
      console.log("Setting CurrentPlayingArrayNum: " + Session.get('CurrentPlayingArrayNum'));
      console.log("Starting song: " + next);
      player.loadVideoById(
        sarr[next].videoId,
        0,
        'highres'
      )
      player.playVideo();
    }
}
/* Function called when the YouTube IFrame API is loaded and ready */
onYouTubeIframeAPIReady = function () {
  // New Video Player, the first argument is the id of the div.
  // Make sure it's a global variable.
  var sarr = Songs.find({userId: Meteor.userId()}).fetch();
  player = new YT.Player("youtube-main-player", {
    height: "400",
    width: "600",
    // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
    videoId: sarr[0].videoId, //if not specified, youtube shows player error
    // Events like ready, state change,
    events: {
      onReady: onReady,
      onStateChange: onStateChange
    }
  });
};

Template.library.rendered = function(){
  YT.load();
}

/* Template functions for use with Spacebars */

Template.library.helpers({
  songList: function () {
    return Songs.find({userId: Meteor.userId()}).fetch();
  }
});

/* Library onClick event handler for play button */
Template.library.events({
  'click #SongList-PlayButton': function(event){
    var sarr = Songs.find({userId: Meteor.userId()}).fetch();
    var found = false;
    for(i = 0; i < sarr.length && found == false; ++i){
      if (sarr[i].videoId == this.videoId){
        Session.set('CurrentPlayingArrayNum', i);
        console.log("found i: " + i);
        found = true;
      }
    }
    console.log("Setting CurrentPlayingArrayNum: " + Session.get('CurrentPlayingArrayNum'));
    player.loadVideoById(
      this.videoId,
      0,
      'highres'
    )
    player.playVideo();
  }
});
