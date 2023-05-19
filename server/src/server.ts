import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

const server = fastify({
  logger: true,
})

server.register(cors, {
  origin: true,
})

server.register(jwt, {
  secret: 'spacetime',
})

server.register(authRoutes)
server.register(memoriesRoutes)

server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
