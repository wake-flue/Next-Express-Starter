const mongoose = require("mongoose");
const config = require("../config");
const COLLECTIONS = config.db.collections;

const todoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        required: true
    },
    title: {
        type: String,
        required: [true, "标题不能为空"],
        trim: true,
        minlength: [2, "标题长度不能少于2个字符"],
        maxlength: [100, "标题长度不能超过100个字符"],
        validate: {
            validator: function(v) {
                if (typeof v !== 'string') {
                    throw new Error('标题必须是字符串类型');
                }
                if (v.length > 100) {
                    throw new Error('标题长度不能超过100个字符');
                }
                return true;
            },
            message: error => error.message
        }
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
