const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
    .connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log("connected to MongoDB");
    })
    .catch(error => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 3 },
    number: { type: Number, required: true, min: 8 },
    id: { type: Number }
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

var uniqueValidator = require("mongoose-unique-validator");
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);
