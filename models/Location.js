const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  Location: {
    type: String,
    required: true
  },
  Hotels: [
    {
      HotelId: {
        type: Schema.Types.ObjectId,
        ref: 'hotel',
        required: true
      },
      Location: {
        type: {
          type: String, // Should always be 'Point' for geospatial indexing
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        }
      }
    }
  ]
});

// Create 2dsphere index on the coordinates field
LocationSchema.index({ 'Hotels.Location': '2dsphere' });

module.exports = mongoose.model('location', LocationSchema);
