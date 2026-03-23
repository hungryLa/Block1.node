const fastify = require('fastify');
const jwt = require('@fastify/jwt');
const cors = require('@fastify/cors');

function buildApp() {
    const app = fastify({ logger: true });

    app.register(cors);
    app.register(jwt, { secret: process.env.JWT_SECRET });

    app.register(require('./routes/authRoutes'), { prefix: '/api/auth' });
    app.register(require('./routes/todoRoutes'), { prefix: '/api' });

    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        reply.status(500).send({ error: 'Internal server error' });
    });

    return app;
}

module.exports = buildApp;