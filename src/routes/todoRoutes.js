async function todoRoutes(fastify, options) {
    const {
        getTodos,
        createTodo,
        updateTodoStatus,
        deleteTodo,
    } = require('../controllers/todoController');


    fastify.get('/todos', {preHandler: [fastify.authenticate] }, getTodos);
    fastify.post('/todos', {preHandler: [fastify.authenticate] }, createTodo);
    fastify.patch('/todos/:id', {preHandler: [fastify.authenticate] },  updateTodoStatus);
    fastify.delete('/todos/:id', {preHandler: [fastify.authenticate] }, deleteTodo);
}

module.exports = todoRoutes;