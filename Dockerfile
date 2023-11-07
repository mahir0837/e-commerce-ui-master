FROM node:21-alpine3.17 as build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install packages without using the old lockfile
RUN npm install --no-package-lock

COPY . .
RUN npm run build --prod


FROM nginx:alpine
COPY --from=build /usr/src/app/dist/e-commerce-ui/ /usr/share/nginx/html