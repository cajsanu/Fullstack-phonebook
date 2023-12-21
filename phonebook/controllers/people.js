
const personsRouter = require('express').Router();
const Person = require('../models/person');


personsRouter.get('/', (request, response) => {
    Person.find({}).then(result => {
        response.json(result);
    });
});

personsRouter.get('/info', (request, response) => {
    Person.find({}).then(result => {
        const number = result.length;
        const currentdate = new Date();

        response.send(`Phonebook has info for ${number} people 
        <br>${currentdate.toString()}<br/>`,
        );
    });
});

personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

personsRouter.post('/', (request, response, next) => {
    Person.find({ name: request.body.name })
        .then(result => {
            if (result.length > 0) {
                return response.status(400).json({
                    error: 'Name already exists',
                });
            }

            const newPerson = new Person({
                name: request.body.name,
                number: request.body.number,
            });
            newPerson.save()
                .then(newPersonSaved => {
                    logger.info('person saved!');
                    response.json(newPersonSaved);
                })
                .catch(error => next(error));
        });
});

personsRouter.put('/:id', (request, response, next) => {
    const numberUpdate = {
        name: request.body.name,
        number: request.body.number,
    };
    Person.findByIdAndUpdate(request.params.id, numberUpdate, { new: true, runValidators: true, context: 'query' })
        .then(result => {
            response.json(result);
        })
        .catch(error => next(error));
});


module.exports = personsRouter