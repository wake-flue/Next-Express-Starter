const mongoose = require("mongoose");
const config = require("../config");
const COLLECTIONS = config.db.collections;

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const TodoModel = mongoose.model(COLLECTIONS.TODOS, todoSchema);

module.exports = TodoModel;
