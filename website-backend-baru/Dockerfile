# Gunakan base image Node.js versi 18-alpine yang ringan
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk caching
COPY package*.json ./

# Instal semua dependensi proyek
RUN npm install

# Salin sisa kode aplikasi ke dalam direktori kerja
COPY . .

# Buat direktori untuk upload bukti pembayaran
RUN mkdir -p uploads/proofs

# Ekspos port yang digunakan oleh server backend
EXPOSE 5000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "node", "server.js" ]