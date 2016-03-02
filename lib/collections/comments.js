Comments = new Mongo.Collection('comments');

Comments.attachSchema(new SimpleSchema({
  id: {
    type: String,
    label: 'id'
  },
  text: {
    type: String,
    label: 'text'
  },
  author: {
    type: String,
    label: 'author'
  },
  date: {
    type: Date,
    label: 'date'
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
