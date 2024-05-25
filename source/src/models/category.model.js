import { mongoose } from '#root/databases/mongoose.database.js';

const schema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
}, {
  timestamps: true,
});

const model = mongoose.model("category", schema);

// await model.createIndexes({
//   barcode: 1,
// });

export default model;

export {
  model,
}
