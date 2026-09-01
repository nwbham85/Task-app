import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    needType: {
      type: [String],
      required: [true, 'At least one type of assistance is required.'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Need type cannot be empty.'
      },
      enum: {
        values: [
          'Food',
          'Water',
          'medical',
          'Shelter',
          'transport',
          'medicalStorage'
        ],
        message: '{VALUE} is not a valid assistance category.'
      }
    },
    description: {
      type: String,
      required: [true, 'Situation description is required.'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },
    representation: {
      type: String,
      enum: ['Myself', 'Group'],
      default: 'Myself',
      required: true
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required.'],
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Please enter a valid phone number.'
      ]
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending'
    }
  },
  {
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
  }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;