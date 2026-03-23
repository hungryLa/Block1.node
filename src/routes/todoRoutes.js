const authMiddleware = require('../middleware/auth');

async function todoRoutes(fastify, options) {
    const {
        getTodos,
        createTodo,
        updateTodoStatus,
        deleteTodo,
    } = require('../controllers/todoController');

    fastify.addHook('preHandler', authMiddleware);

    fastify.get('/todos', getTodos);
    fastify.post('/todos', createTodo);
    fastify.patch('/todos/:id', updateTodoStatus);
    fastify.delete('/todos/:id', deleteTodo);
}

module.exports = todoRoutes;