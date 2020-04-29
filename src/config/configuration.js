let config = {};

/* Swagger Definition */
config.swaggerDefinition = {
  'info': {
    'title': 'Node Express Complete Training',
    'version': '1.0.0',
    'description': 'Demonstrating RESTful APIs.'
  },
  'host': process.env.HTTP_HOST || 'localhost:8080',
  'basePath': '/api',
  'securityDefinitions': {
    'bearerAuth': {
      'type': 'apiKey',
      'name': 'Authorization',
      'scheme': 'bearer',
      'in': 'header'
    }
  }
};

config.swaggerOptions = {
  'customSiteTitle': 'Node Express Training',
  'customCss': '.swagger-ui .topbar { display: none }',
  'customfavIcon': 'https://editor.swagger.io/dist/favicon-32x32.png'
};

module.exports = config
