import fastify from 'fastify'
import { cardFromData } from './act1/helpers';

const server = fastify()

server.get('/act1/', async (request, reply) => {
  const card = cardFromData(request.query);

  reply.send(JSON.stringify(card))
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
