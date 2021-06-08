FROM nginx

# file is copied from: https://deb.nodesource.com/setup_15.x
COPY ./react-fe/docker/nginx-react-fe/setup_node.sh /tmp/setup_node.sh

COPY ./react-fe /tmp/react-fe

WORKDIR /tmp/react-fe

RUN apt update
RUN apt -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_15.x  | bash -
RUN apt -y install nodejs
RUN npm install
RUN npm run build

RUN mkdir -p /var/www/html
RUN cp -r ./build/* /var/www/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./react-fe/docker/nginx-react-fe/nginx.conf /etc/nginx/conf.d