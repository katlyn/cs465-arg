FROM node:19

ENV DATABASE_URL="file:./dev.db"

WORKDIR /usr/arg

EXPOSE 80

COPY . .

RUN npm i -g pnpm
RUN pnpm i

RUN pnpm prisma migrate deploy
RUN pnpm build

CMD ["pnpm", "start"]
