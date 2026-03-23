const User = require('../models/User')
const {loginSchema, registerSchema} = require('../schemas/validation');
async function register(request, reply){
    const {error, value} = registerSchema.validate(request.body);
    if (error) {
        return reply.status(400).send({ error: error.details[0].message });
    }

    const { email, password } = value;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return reply.status(409).send({ error: 'Email already in use' });
        }

        const user = await User.create({ email, password });
        return reply.status(201).send({ id: user.id, email: user.email });
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}
async function login(request, reply){
    const { error, value } = loginSchema.validate(request.body);
    if (error) {
        return reply.status(400).send({ error: error.details[0].message });
    }

    const { email, password } = value;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        const token = request.server.jwt.sign({ id: user.id, email: user.email });
        return reply.send({ token });
    } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = {register, login};