import {mongoose} from '#root/databases/mongoose.database.js';
import {permissions} from "#root/configs/permissions.config.js";

const schema = new mongoose.Schema({
    avatar: {
        type: String,
    },
    fullName: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    permissions: {
        type: [String],
        default: [permissions.SALESPERSON],
    },
    isActive: {
        type: Boolean,
        default: true,
        require: true,
    },
    isLocked: {
        type: Boolean,
        default: false,
        require: true,
    },
}, {
    timestamps: true,
});

const model = mongoose.model("account", schema);

// await model.createIndexes({
//   username: 1,
// });

export default model;

export {
    model,
}
