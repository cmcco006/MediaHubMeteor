
/* Event handler that triggers when the YouTube player is ready */
onReady = function (event) {
  player.playVideo();
  Session.set('CurrentPlayingArrayNum', 0);
};

/* Event handler that triggers when the Youtube player changes state
  -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering
   5: video cued
*/
onStateChange = function (event) {
    if(player.getPlayerState() === 0){
      var sarr = Songs.find({userId: Meteor.userId()}).fetch();
      var next = Session.get('CurrentPlayingArrayNum') + 1;
      if(next >= sarr.length){
        next = 0;
      }
      Session.set('CurrentPlayingArrayNum', next);
      console.log("Setting CurrentPlayingArrayNum: " + Session.get('CurrentPlayingArrayNum'));
      console.log("Starting song: " + next);
      player.loadVideoById(
        sarr[next].videoId,
        0,
        'highres'
      );
      Session.set('videoId', sarr[next].videoId);
      Session.set('views', sarr[next].views);
      Session.set('likes', sarr[next].likes);
      Session.set('dislikes', sarr[next].dislikes);
      player.playVideo();
    }
};

/* Function called when the YouTube IFrame API is loaded and ready */
onYouTubeIframeAPIReady = function () {
  // New Video Player, the first argument is the id of the div.
  // Make sure it's a global variable.
  var sarr = Songs.find({userId: Meteor.userId()}).fetch();
  Session.set('videoId', sarr[0].videoId);
  var doc = Info.findOne({'id': sarr[0].videoId});
  Session.set('likes', doc.likes);
  Session.set('dislikes', doc.dislikes);
  Session.set('views', doc.views);
  player = new YT.Player("youtube-main-player", {
    height: "280",
    width: "500",
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
};

/* Template functions for use with Spacebars */

Template.library.helpers({
  songList: function () {
    return Songs.find({userId: Meteor.userId()}).fetch();
  }
});

/* Library onClick event handler for play button */
Template.library.events({
  'click #SongList-PlayButton': function(event){
    Session.set('videoId', this.videoId);
    var doc = Info.findOne({'id': this.videoId});
    Session.set('likes', doc.likes);
    Session.set('dislikes', doc.dislikes);
    Session.set('views', doc.views + 1);
    Info.update(doc._id, {$set: {views: doc.views + 1}});
    var sarr = Songs.find({userId: Meteor.userId()}).fetch();
    var found = false;
    for(i = 0; i < sarr.length && found === false; ++i){
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
    );
    player.playVideo();
  },
  'click #remove': function(event) {
    Songs.remove(this._id);
  }
});

Session.setDefault('views', 0);
Session.setDefault('likes', 0);
Session.setDefault('dislikes', 0);
Session.setDefault('id', '');
Session.setDefault('videoId', '');
Session.setDefault('sortby', 'none');

Template.metadata.helpers({
  views: function() {
    return Info.findOne({'id': Session.get('videoId')}).views;
  },
  likes: function() {
    return Info.findOne({'id': Session.get('videoId')}).likes;
  },
  dislikes: function() {
    return Info.findOne({'id': Session.get('videoId')}).dislikes;
  },
});

Template.metadata.helpers({
  comments: function() {
    return Comments.find({'id': Session.get('videoId')});
  }
});

Template.metadata.events({
  'submit .like': function() {
    var doc = Info.findOne({id: Session.get('videoId')});
    if (doc) {
      var ldoc = Likes.findOne({userId: Meteor.userId(),
        targetId: doc._id, type: 'media'});
      if (!ldoc) {
        Info.update(doc._id, {$set: {likes: doc.likes + 1}});
        Session.set('likes', Session.get('likes') + 1);
        Likes.insert({
          userId: Meteor.userId(),
          targetId: doc._id,
          choice: 'like',
          type: 'media'
        });
      }
      else {
        if (ldoc.choice == 'like') {
          Info.update(doc._id, {$set: {likes: doc.likes - 1}});
          Session.set('likes', Session.get('likes') - 1);
          Likes.remove(ldoc._id);
        }
        else {
          Info.update(doc._id, {$set: {likes: doc.likes + 1}});
          Info.update(doc._id, {$set: {dislikes: doc.dislikes - 1}});
          Session.set('likes', Session.get('likes') + 1);
          Session.set('dislikes', Session.get('dislikes') - 1);
          Likes.update(ldoc._id, {$set: {choice: 'like'}});
        }
      }
    }
    return false;
  },

  'submit .dislike': function() {
    var doc = Info.findOne({id: Session.get('videoId')});
    if (doc) {
      var ldoc = Likes.findOne({userId: Meteor.userId(),
        targetId: doc._id, type: 'media'});
      if (!ldoc) {
        Info.update(doc._id, {$set: {dislikes: doc.dislikes + 1, }});
        Session.set('dislikes', Session.get('dislikes') + 1);
        Likes.insert({
          userId: Meteor.userId(),
          targetId: doc._id,
          choice: 'dislike',
          type: 'media'
        });
      }
      else {
        if (ldoc.choice == 'dislike') {
          Info.update(doc._id, {$set: {dislikes: doc.dislikes - 1}});
          Session.set('dislikes', Session.get('dislikes') - 1);
          Likes.remove(ldoc._id);
        }
        else {
          Info.update(doc._id, {$set: {likes: doc.likes - 1}});
          Info.update(doc._id, {$set: {dislikes: doc.dislikes + 1}});
          Session.set('likes', Session.get('likes') - 1);
          Session.set('dislikes', Session.get('dislikes') + 1);
          Likes.update(ldoc._id, {$set: {choice: 'dislike'}});
        }
      }
    }
    return false;
  },

  'submit .comment': function() {
    Comments.insert({
      id: Session.get('videoId'),
      text: document.getElementById('comment').value,
      author: Meteor.user().username,
      date: new Date(),
      likes: 0,
      dislikes: 0
    });
    document.getElementById('comment').value = '';
    return false;
  }
});

Template.comment.helpers({
  dateFormat: function() {
    return this.date.toDateString().substring(4);
  },
  isAuthor: function() {
    return this.author === Meteor.user().username;
  }
});

Template.comment.events({
  'submit .clike': function() {
    var ldoc = Likes.findOne({userId: Meteor.userId(),
      targetId: this._id, type: 'comment'});
    if (!ldoc) {
      Comments.update(this._id, {$set: {likes: this.likes + 1}});
      Likes.insert({
        userId: Meteor.userId(),
        targetId: this._id,
        choice: 'like',
        type: 'comment'
      });
    }
    else {
      if (ldoc.choice == 'like') {
        Comments.update(this._id, {$set: {likes: this.likes - 1}});
        Likes.remove(ldoc._id);
      }
      else {
        Comments.update(this._id, {$set: {likes: this.likes + 1}});
        Comments.update(this._id, {$set: {dislikes: this.dislikes - 1}});
        Likes.update(ldoc._id, {$set: {choice: 'like'}});
      }
    }
    return false;
  },

  'submit .cdislike': function() {
    var ldoc = Likes.findOne({userId: Meteor.userId(),
      targetId: this._id, type: 'comment'});
    if (!ldoc) {
      Comments.update(this._id, {$set: {dislikes: this.dislikes + 1}});
      Likes.insert({
        userId: Meteor.userId(),
        targetId: this._id,
        choice: 'dislike',
        type: 'comment'
      });
    }
    else {
      if (ldoc.choice == 'dislike') {
        Comments.update(this._id, {$set: {dislikes: this.dislikes - 1}});
        Likes.remove(ldoc._id);
      }
      else {
        Comments.update(this._id, {$set: {likes: this.likes - 1}});
        Comments.update(this._id, {$set: {dislikes: this.dislikes + 1}});
        Likes.update(ldoc._id, {$set: {choice: 'dislike'}});
      }
    }
    return false;
  },

  'submit .cdelete': function() {
    Comments.remove(this._id);
    return false;
  }
});
