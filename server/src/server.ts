import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'

const server = fastify({
  logger: true,
})

server.register(memoriesRoutes)

server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
