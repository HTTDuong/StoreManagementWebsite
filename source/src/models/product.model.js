import { mongoose } from '#root/databases/mongoose.database.js';

const schema = new mongoose.Schema({
  barcode: {
    // [day][month][year][hour][minute][random]
    // day: --
    // month: --
    // year: --
    // random: ------ random
    // ex: 01010001060645
    type: String,
    unique: true,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  importPrice: {
    type: Number,
    require: true,
  },
  retailPrice: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
    default: 0,
  }
}, {
  timestamps: true,
});

const model = mongoose.model("product", schema);

// await model.createIndexes({
//   barcode: 1,
// });

export default model;

export {
  model,
}
