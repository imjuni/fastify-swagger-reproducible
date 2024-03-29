const fasfify = require('fastify');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUI = require('@fastify/swagger-ui');

async function bootstrap() {
  const server = fasfify();

  server.addSchema({
    definitions: {
      common: {
        'server-status': {
          properties: {
            stauts: { type: 'string' },
          },
        },
        hello: {
          'another-status': {
            $ref: '#/definitions/common/server-status',
          },
        },
      },
    },
  });

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Fastify Swagger Reproducible',
        version: '1.0.0',
      },
    },
  });
  await server.register(fastifySwaggerUI, {
    routePrefix: '/swagger.io',

    uiConfig: {
      deepLinking: true,
      filter: true,
    },
  });

  server.get(
    '/',
    {
      schema: {
        tags: ['Common'],
        summary: 'Server Health Check',
        operationId: 'get-server-status',
        description: 'Server Health Check',
        response: {
          200: { $ref: '#/definitions/common/server-status' },
        },
      },
    },
    async () => {
      return { status: 'healthy' };
    },
  );

  server.get(
    '/health',
    {
      schema: {
        tags: ['Common'],
        summary: 'Another Health Check',
        operationId: 'get-another-status',
        description: 'Another Health Check',
        response: {
          200: { $ref: '#/definitions/common/hello/another-status' },
        },
      },
    },
    async () => {
      return { status: 'healthy' };
    },
  );

  server.listen({ port: 7878 }, (err, address) => {
    if (err) {
      console.log(err.message);
    }

    console.log(address);
  });
}

bootstrap().catch((err) => {
  console.log(err.message);
});
