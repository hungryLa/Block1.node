const fastify = require('fastify')({ logger: true });
const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Регистрация плагинов
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
});

// Декоратор для аутентификации
fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

// Регистрация маршрутов
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(todoRoutes, { prefix: '/api/todos' });

const start = async () => {
    try {
        // Инициализация базы данных
        await initDatabase();
        console.log('✅ Database connection established');

        // Запуск сервера
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();