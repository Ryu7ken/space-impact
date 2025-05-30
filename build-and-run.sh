#!/bin/bash

# Build the Docker image
sudo docker build -t space-impact .

# Run the container
sudo docker run -d -p 8080:80 --name space-impact-game space-impact

echo "Space Impact game is now running at http://localhost:8080"
