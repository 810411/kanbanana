const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model(
  'boards',
  Schema(
    {
      title: {
        type: String,
        required: true
      },
      descr: {
        type: String
      },
      creator: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
      },
      project: {
        ref: 'projects',
        type: Schema.Types.ObjectId,
        required: true
      },
      columns: [
        {
          ref: 'board-columns',
          type: Schema.Types.ObjectId
        }
      ]
    },
    {timestamps: true}
  )
);
