const express = require("express");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(express.static("build"));

const morgan = require("morgan");
app.use(
    morgan(function(tokens, req, res) {
        let postObject = "";
        if (tokens.method(req, res) === "POST") {
            const person = req.body;
            postObject = JSON.stringify(person);
        }

        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            postObject
        ].join(" ");
    })
);

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

const Person = require("./models/person");

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    });
});
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);

    const findPerson = persons.find(person => person.id === id);
    findPerson ? res.json(findPerson) : res.status(404).end();
});

// app.post("/api/persons", (req, res) => {
//     const person = req.body;

//     if (!person.name || !person.number) {
//         console.log(person.name);
//         console.log(person.number);

//         return res.status(400).json({ error: "name or number is missing" });
//     }

//     findDuplicate = persons.find(item => item.name === person.name);
//     if (findDuplicate) {
//         return res.status(400).json({ error: "name must be unique" });
//     }

//     const randomId = Math.floor(Math.random() * 100000);
//     person.id = randomId;
//     persons = [...persons, person];
//     res.json(persons);
// });

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            console.log(result);
            res.status(200).end();
        })
        .catch(error => next(error));
});

app.get("/api/info", (req, res) => {
    const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `;
    res.send(html);
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const { name, number } = body;
    console.log(body);

    if (!name || !number) {
        return res.status(400).json({ error: "name or number is missing" });
    }

    const person = new Person({
        name,
        number
    });
    person.save().then(response => {
        console.log(`added ${name} number ${number} to phonebook`);
        res.json({
            name,
            number
        });
        // mongoose.connection.close();
    });
});

app.put("/api/persons/:id", (req, res) => {
    const body = req.body;
    const { name, number } = body;

    Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true })
        .then(updatedNote => {
            res.json(updatedNote.toJSON());
        })
        .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError" && error.kind == "ObjectId") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
