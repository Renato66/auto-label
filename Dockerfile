FROM node:20-slim

# Create a directory for the action code
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/lib/main.js"]
