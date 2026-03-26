const { describe, test, expect, beforeEach, beforeAll, afterAll } = require('@jest/globals');
const Fastify = require('fastify');
const authRoutes = require('../src/routes/authRoutes');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');
const prefix = '/api/auth';
describe('Auth Controller', () => {
    let fastify;
    let testUser;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        fastify = Fastify();

        fastify.register(require('@fastify/jwt'), {
            secret: 'test-secret-key'
        });
        fastify.register(authRoutes, { prefix: prefix });

        await fastify.ready();

    });

    afterAll(async () => {
        // Закрываем сервер и подключение к БД
        await fastify.close();
        await sequelize.close();
    });

    beforeEach(async () => {
        await User.destroy({ where: {}, truncate: { cascade: true } });
    });
    describe('Register', () => {
        test('Успешная регистрация', async () => {
            const response = await fastify.inject({
                method: 'POST',
                url: `${prefix}/register`,
                payload: {
                    email: 'test@example.com',
                    password: 'password123',
                }
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('email', 'test@example.com');
        });
    });

    describe('Login', () => {
        beforeEach(async () => {
            testUser = await User.create({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        test('Успешный вход', async () => {
            const response = await fastify.inject({
                method: 'POST',
                url: `${prefix}/login`,
                payload: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('token');
            expect(body.token).toBeDefined();
        });
    });
});