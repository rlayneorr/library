sudo docker build -t library .

sudo docker run --env-file .env-list -p 5000:5000 library:latest
