import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    users: {
      type: Array,
      required: true,
    },
    avatarImage: {
      type: String,
      default: '',
    },
    chatType: {
      type: String,
      default: 'room',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
