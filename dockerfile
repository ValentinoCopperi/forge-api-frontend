# builder
FROM node:22 AS builder

WORKDIR /app

# copia los archivos de dependencias (si package*.json no cambia, esta capa no se reconstruye gracias al cache)
COPY package*.json ./    
RUN pnpm install            # esta capa solo depende de package*.json


#copy . . , copia todos los archivos del proyecto en /app (con dockerignore, elegimos que archivos copiar y cuales ignorar)
# copia el resto del codigo (si no cambia, esta capa no se reconstruye gracias al cache)
COPY . .                  
RUN pnpm run build



# nginx
FROM nginx:alpine AS production


#todo lo que esta en /app/dist, lo copia en /usr/share/nginx/html , aqui nginx se encarga de servir los archivos estaticos
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80