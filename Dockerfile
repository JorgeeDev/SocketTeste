FROM node:16
WORKDIR /usr/src/app
COPY . .
COPY package*.json ./
RUN yarn
EXPOSE 80
ENTRYPOINT [ "yarn", "start" ]