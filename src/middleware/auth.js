async function authMiddleware(request, reply){
    try {
        await request
    } catch (err) {
        reply.status(401).send({
            error: 'Unauthorized'
        });
    }
}

module.exports = authMiddleware()