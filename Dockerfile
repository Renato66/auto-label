FROM node:20-slim

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/lib/main.js"]
