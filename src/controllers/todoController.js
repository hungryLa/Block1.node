const Todo = require('../models/Todo');
const { todoIndexSchema, todoCreateSchema, todoUpdateSchema } = require('../schemas/validation');

async function getTodos(request, reply) {
    const { error, value } = todoIndexSchema.validate(request.body);
    if (error) {
        return reply.status(400).send({ error: error.details[0].message });
    }
    try {
        const todos = await Todo.findAll({ where: { userId: value.user.id } });
        return reply.send(todos);
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}

async function createTodo(request, reply) {
    const { error, value } = todoCreateSchema.validate(request.body);
    if (error) {
        return reply.status(400).send({ error: error.details[0].message });
    }

    try {
        const todo = await Todo.create({
            ...value,
            userId: request.user.id,
        });
        return reply.status(201).send(todo);
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}

async function updateTodoStatus(request, reply) {
    const { id } = request.params;
    const { error, value } = todoUpdateSchema.validate(request.body);
    if (error) {
        return reply.status(400).send({ error: error.details[0].message });
    }

    try {
        const todo = await Todo.findOne({ where: { id, userId: request.user.id } });
        if (!todo) {
            return reply.status(404).send({ error: 'Todo not found' });
        }
        todo.status = value.status;
        await todo.save();
        return reply.send(todo);
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}

async function deleteTodo(request, reply) {
    const { id } = request.params;
    try {
        const todo = await Todo.findOne({ where: { id, userId: request.user.id } });
        if (!todo) {
            return reply.status(404).send({ error: 'Todo not found' });
        }
        await todo.destroy();
        return reply.status(204).send();
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = {
    getTodos,
    createTodo,
    updateTodoStatus,
    deleteTodo,
};