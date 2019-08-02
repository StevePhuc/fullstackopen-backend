const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

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

app.get("/api/persons", (req, res) => {
    res.json(persons);
});
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);

    const findPerson = persons.find(person => person.id === id);
    findPerson ? res.json(findPerson) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
    const person = req.body;

    if (!person.name || !person.number) {
        console.log(person.name);
        console.log(person.number);

        return res.status(400).json({ error: "name or number is missing" });
    }

    findDuplicate = persons.find(item => item.name === person.name);
    if (findDuplicate) {
        return res.status(400).json({ error: "name must be unique" });
    }

    const randomId = Math.floor(Math.random() * 100000);
    person.id = randomId;
    persons = [...persons, person];
    res.json(persons);
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
