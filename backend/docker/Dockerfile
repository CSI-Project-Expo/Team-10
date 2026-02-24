# Dockerfile for Judge Microservice with multi-language runtimes
FROM node:20-bullseye

WORKDIR /app

# Install runtimes: Python, Java, and C++ toolchain
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		python3 \
		openjdk-17-jdk-headless \
		g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY judge-microservice/package*.json ./
RUN npm install

COPY judge-microservice/ .

CMD ["node", "index.js"]
