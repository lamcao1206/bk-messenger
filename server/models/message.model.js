import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'text',
      enum: ['text', 'img', 'file'],
    },
    url: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readers: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
