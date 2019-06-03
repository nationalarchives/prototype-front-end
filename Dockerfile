FROM node:12-alpine
RUN apk update && apk add git && yarn config set unsafe-perm true