const express = require("express");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(express.static("build"));

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

app.delete("/api/person/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
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

    if (name === undefined || number == undefined) {
        return res.status(400).json({ error: "content missing" });
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
