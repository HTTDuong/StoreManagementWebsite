import { mongoose } from '#root/databases/mongoose.database.js';

const schema = new mongoose.Schema({
  customer: {
    type: String,
    require: true,
  },
  employee: {
    type: String,
    require: true,
  },
  products: {
    type: Array,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  receive: {
    // Số tiền nhận từ khách
    type: Number,
    require: true,
  },
  remain: {
    // Số tiền còn dư
    type: Number,
    require: true,
  }
}, {
  timestamps: true,
});

const model = mongoose.model("transaction", schema);

// await model.createIndexes({
//   customer: 1,
// });
//
// await model.createIndexes({
//   employee: 1,
// });

export default model;

export {
  model,
}
