async function todoRoutes(fastify, options) {
    const {
        getTodos,
        createTodo,
        updateTodoStatus,
        deleteTodo,
    } = require('../controllers/todoController');


    fastify.get('/', {preHandler: [fastify.authenticate] }, getTodos);
    fastify.post('/store', {preHandler: [fastify.authenticate] }, createTodo);
    fastify.patch('/:id', {preHandler: [fastify.authenticate] },  updateTodoStatus);
    fastify.delete('/:id', {preHandler: [fastify.authenticate] }, deleteTodo);
}

module.exports = todoRoutes;