import { mongoose } from '#root/databases/mongoose.database.js';

const schema = new mongoose.Schema({
  phone: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  }
}, {
  timestamps: true,
});

const model = mongoose.model("customer", schema);

// await model.createIndexes({
//   phone: 1,
// });

export default model;

export {
  model,
}
