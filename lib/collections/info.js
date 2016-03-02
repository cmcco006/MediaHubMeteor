Info = new Mongo.Collection('info');

Info.attachSchema(new SimpleSchema({
  id: {
    type: String,
    label: 'id'
  },
  views: {
    type: Number,
    label: 'views'
  },
  likes: {
    type: Number,
    label: 'likes'
  },
  dislikes: {
    type: Number,
    label: 'dislikes'
  }
}));
