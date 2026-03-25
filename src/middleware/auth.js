const authenticate = async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { authenticate };