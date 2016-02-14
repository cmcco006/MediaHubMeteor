Songs = new Mongo.Collection('songs');

Songs.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    label: 'userId'
  },
  title: {
    type: String,
    label: 'title'
  },
  videoId: {
    type: String,
    label: 'videoId'
  },
  kind: {
    type: String,
    label: 'kind'
  },
  thumbnail: {
    type: String,
    label: 'thumbnail'
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
