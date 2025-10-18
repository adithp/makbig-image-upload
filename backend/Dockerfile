# Use a small base image with Alpine Linux
FROM alpine:3.17

# Install certificates so HTTPS works
RUN apk add --no-cache ca-certificates

# Set working directory inside the container
WORKDIR /app

# Copy all files from your project into the container
COPY . .

# Make sure the PocketBase binary is executable
RUN chmod +x pocketbase

# Expose the port PocketBase will run on
EXPOSE 8090

# Command to run PocketBase when container starts
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
