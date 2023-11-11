# FROM node:21-alpine3.17 as build
# WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# COPY package.json .
# COPY package-lock.json .

# Install packages without using the old lockfile
# RUN npm install --no-package-lock

# COPY . .
# RUN npm run build --prod


# FROM nginx:alpine
# COPY --from=build /usr/src/app/dist/e-commerce-ui/ /usr/share/nginx/html

FROM node:21-alpine3.17 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .
RUN npm run build
FROM nginx:stable
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/e-commerce-ui/ /usr/share/nginx/html
EXPOSE 80