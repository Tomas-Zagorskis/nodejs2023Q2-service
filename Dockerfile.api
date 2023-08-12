###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.17.0-alpine As development

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start:dev" ]

###################
# BUILD FOR PRODUCTION
###################

FROM node:18.17.0-alpine As build

WORKDIR /app

COPY package*.json .

COPY --from=development /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:18.17.0-alpine As production

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]