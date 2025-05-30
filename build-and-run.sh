#!/bin/bash

# Build the Docker image
docker build -t space-impact .

# Run the container
docker run -d -p 8080:80 --name space-impact-game space-impact

echo "Space Impact game is now running at http://localhost:8080"
