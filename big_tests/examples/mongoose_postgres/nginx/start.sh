apt-get update
apt-get install -y nginx

# configure nginx to load balance tcp on 5222
cp ./etc/nginx.conf /etc/nginx/

nginx -g 'daemon off;'