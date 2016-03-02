Likes = new Mongo.Collection('likes');

Likes.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    label: 'userId'
  },
  targetId: {
    type: String,
    label: 'targetId'
  },
  choice: {
    type: String,
    label: 'choice'
  },
  type: {
    type: String,
    label: 'type'
  }
}));
