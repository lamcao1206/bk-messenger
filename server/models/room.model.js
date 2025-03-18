import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'A room must have at least one user',
      },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.chatType === 'room';
      },
    },
    avatarImage: {
      type: String,
      default: '',
    },
    chatType: {
      type: String,
      default: 'chatbox',
      enum: ['chatbox', 'room'],
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
