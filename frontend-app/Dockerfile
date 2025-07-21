# Tahap 1: Build aolikasi React
FROM node:18-alpine AS build

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Argumen build untuk URL API dari docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build aplikasi untuk production
RUN npm run build

# Tahap 2: Sajikan dengan Nginx
FROM nginx:stable-alpine

# Salin hasil build dari tahap sebelumnya ke direktori root Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Salin file konfigurasi Nginx kustom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ekspos port 80 yang digunakan Nginx
EXPOSE 80

# Perintah untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]