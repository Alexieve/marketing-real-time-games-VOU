# FROM node:alpine AS build

# WORKDIR /app
# COPY package.json .
# COPY package-lock.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:stable-alpine

# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]


FROM node:alpine AS build

ENV TZ=Asia/Bangkok
RUN apk add --no-cache tzdata

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000


CMD ["npm", "start"]