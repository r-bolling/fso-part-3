const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];

const getRandInt = (_) => Math.floor(Math.random() * (1000000 - 1) + 1);

morgan.token('reqBody', (req, res) => JSON.stringify(req.body));

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :reqBody'
);

app.use(logger);

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: getRandInt(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.get('/info', (req, res) => {
  content = `<div>Phonebook has info for ${
    persons.length
  } people <br/> <br/> ${new Date()}</div>`;
  res.send(content);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
