FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn backend
COPY . .

# Chạy app
CMD ["node", "app.js"]
