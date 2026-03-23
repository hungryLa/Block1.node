async function authRoutes(fastify, options){
    const { register, login } = require('../controllers/authController');
    fastify.post('/register', register);
    fastify.post('/login', login);
}

module.exports = authRoutes;