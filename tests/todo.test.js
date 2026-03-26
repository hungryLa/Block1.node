const { describe, test, expect, beforeEach, beforeAll, afterAll } = require('@jest/globals');
const Fastify = require('fastify');
const todoRoutes = require('../src/routes/todoRoutes');
const { sequelize } = require('../src/config/database');
const Todo = require('../src/models/Todo');
const User = require('../src/models/User');
const prefix = '/api/todos';

describe('Todo Controller', () => {
    let fastify;
    let authToken;
    let testUser;
    let testTodo;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        testUser = await User.create({
            email: 'test1@example.com',
            password: 'password123',
            name: 'Test User'
        });

        fastify = Fastify();

        fastify.register(require('@fastify/jwt'), {
            secret: 'test-secret-key'
        });

        fastify.decorate('authenticate', async (request, reply) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.code(401).send({ error: 'Unauthorized' });
            }
        });

        fastify.register(todoRoutes, { prefix: prefix });

        await fastify.ready();

        authToken = fastify.jwt.sign({
            id: testUser.id,
            email: testUser.email
        });
    });

    afterAll(async () => {
        // Закрываем сервер и подключение к БД
        await fastify.close();
        await sequelize.close();
    });

    beforeEach(async () => {
        await Todo.destroy({ where: {}, truncate: true });

        testTodo = await Todo.create({
            name: 'Test Todo',
            description: 'Test Description',
            status: 'pending',
            user_id: testUser.id
        });
    });
    test('Получение списка задач', async () => {
        await Todo.create({
            name: 'Another Todo',
            description: 'Another Description',
            status: 'in_progress',
            user_id: testUser.id
        });

        const response = await fastify.inject({
            method: 'GET',
            url: prefix,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(response.statusCode).toBe(200);
        const todos = JSON.parse(response.body);
        expect(Array.isArray(todos)).toBe(true);
        expect(todos).toHaveLength(2);
        expect(todos[0]).toHaveProperty('name');
        expect(todos[0]).toHaveProperty('status');
    });

    test('Создание', async () => {
        const newTodo = {
            name: 'New Todo',
            description: 'New Description',
            status: 'pending'
        };

        const response = await fastify.inject({
            method: 'POST',
            url: prefix,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            payload: newTodo
        });

        expect(response.statusCode).toBe(201);
        const todo = JSON.parse(response.body);
        expect(todo).toHaveProperty('id');
        expect(todo.name).toBe(newTodo.name);
        expect(todo.description).toBe(newTodo.description);
        expect(todo.status).toBe(newTodo.status);
        expect(todo.user_id).toBe(testUser.id);
    });

    test('Обновление', async () => {
        const response = await fastify.inject({
            method: 'PATCH',
            url: `${prefix}/${testTodo.id}`,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            payload: {
                status: 'completed'
            }
        });

        expect(response.statusCode).toBe(200);
        const todo = JSON.parse(response.body);
        expect(todo.status).toBe('completed');
        expect(todo.id).toBe(testTodo.id);
    });

    test('Удаление', async () => {
        const response = await fastify.inject({
            method: 'DELETE',
            url: `${prefix}/${testTodo.id}`,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.message).toBe('Todo deleted successfully');

        // Проверяем, что задача действительно удалена
        const deletedTodo = await Todo.findByPk(testTodo.id);
        expect(deletedTodo).toBeNull();
    });
});