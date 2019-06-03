FROM node:12-alpine
RUN apk update && apk add git \
               && git config --global user.email "github@sampalmer.dev" \
               && git config --global user.name "Sam Palmer"