FROM nginx
COPY ./docs/.vuepress/dist /usr/share/nginx/html/
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# FROM node:10
# COPY  ./ /app
# WORKDIR /app
# FROM nginx
# RUN mkdir /app
# COPY --from=0 /app/ /app
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf