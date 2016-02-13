Playlists = new Mongo.Collection('playlists');

Playlists.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 20,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    } //end autoValue
  } //end createdAt
}));
