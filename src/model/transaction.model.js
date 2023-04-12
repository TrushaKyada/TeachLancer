const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    course_id: {
        type: ObjectId
    },
    amount: {
        type: String,  // float value
        required: true
    },
    type: {
        type: Number,  // 1-salary 2-fees
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: Number, // 1-transaction 2-refaund
        default: 1
    }
}, {
    timestamps: true
}, {
    collection: "transaction"
}
);

module.exports = mongoose.model("transaction", transactionSchema);