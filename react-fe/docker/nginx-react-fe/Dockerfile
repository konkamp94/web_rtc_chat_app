FROM nginx

WORKDIR /var
RUN mkdir -p /var/www/html

# # add app
COPY ./react-fe/build/ /var/www/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./react-fe/docker/nginx-react-fe/nginx.conf /etc/nginx/conf.d