module.exports = {
  schema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        host: {
          type: "string",
          minLength: 1,
        },
        port: {
          type: "integer",
          minimum: 1,
        },
        user: {
          type: "string",
          minLength: 1,
        },
        private_key: {
          type: "string",
          minLength: 1,
        },
        targets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              forwarding: {
                type: "string",
                enum: ["local", "remote"],
              },
              local_port: {
                type: "integer",
                minimum: 1,
              },
              remote_port: {
                type: "integer",
                minimum: 1,
              },
              addr: {
                type: "string",
                minLength: 1,
              },
            },
            required: ["forwarding", "local_port", "remote_port", "addr"],
          },
          minItems: 1,
        },
      },
      required: ["host", "port", "user", "private_key", "targets"],
    },
    minItems: 1,
  },
};
