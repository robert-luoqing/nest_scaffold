# FROM --platform=linux/amd64 node:20.12.2
FROM docker.m.daocloud.io/library/node:18-alpine

# 替换为阿里云的镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 node-gyp 所需的构建工具和 Python3
RUN apk add --no-cache python3 make g++ 

# 设置环境变量
ENV NODE_ENV=production

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 或 yarn.lock
COPY package.json ./
# COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
RUN npm i

# 复制项目的所有文件
COPY . .

# 构建项目
RUN npm run build

# 暴露 Nest.js 默认端口
EXPOSE 3020

# 启动应用
CMD ["npm", "run", "start:prod"]
