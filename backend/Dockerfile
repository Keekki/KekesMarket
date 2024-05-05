FROM node:18-alpine
COPY . /opt/app/
WORKDIR /opt/app
ENV PORT=8000
EXPOSE 8000
RUN npm install --omit=dev
CMD ["npm", "run", "start"]