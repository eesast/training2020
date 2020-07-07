# Builder stage

FROM node:13-alpine AS builder

RUN apk add python3 make gcc g++

# Create app directory
WORKDIR /home/node/app

# Install app devDependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache

# Bundle app source
COPY . .

# Build
RUN yarn build


# Runner stage

FROM node:13-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Copy dependencies
COPY package.json yarn.lock ./
COPY --from=builder /home/node/app/node_modules ./node_modules

# Copy build files
COPY --from=builder /home/node/app/build ./build

# Copy doc files
COPY docs ./docs

EXPOSE 28888

CMD yarn serve
