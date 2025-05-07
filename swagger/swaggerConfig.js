import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shop Sphere API",
      version: "1.0.0",
      description: "API documentation for Shop Sphere backend",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: [
    "./routes/*.js", 
    "./rent_folder/routes/*.js"
  ], // Adjust based on route locations
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
