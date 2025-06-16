const mongoose = require("mongoose");

const SingleCloudSchema = new mongoose.Schema({
    image: {
        url: String,
        id: String,

    },
});

const SingleCloud = mongoose.model('SingleCloud', SingleCloudSchema);

module.exports = SingleCloud;
