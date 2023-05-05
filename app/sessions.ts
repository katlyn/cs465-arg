import { createSessionStorage } from "@remix-run/node";
import prisma from "~/prisma.server";
import {AllowedUser} from "~/keys.server";

type SessionData = {
  user: AllowedUser
  doneSecond: boolean|undefined
  doneThird: boolean|undefined
};
function createDatabaseSessionStorage(cookie: Parameters<typeof createSessionStorage>[0]["cookie"]) {
  return createSessionStorage<SessionData>({
    cookie,
    async createData(data, expires) {
      // `expires` is a Date after which the data should be considered
      // invalid. You could use it to invalidate the data somehow or
      // automatically purge this record from your database.
      const session = await prisma.session.create({
        data: {
          data: JSON.stringify(data),
          expires
        }
      })
      return session.id;
    },
    async readData(id) {
      const session = await prisma.session.findUnique({
        where: { id }
      })

      if (session == null) {
        return null
      }

      return JSON.parse(session.data)
    },
    async updateData(id, data, expires) {
      await prisma.session.upsert({
        where: { id },
        update: {
          data: JSON.stringify(data),
          expires
        },
        create: {
          data: JSON.stringify(data),
          expires
        }
      });
    },
    async deleteData(id) {
      await prisma.session.delete({
        where: { id }
      })
    },
  });
}

export const { getSession, commitSession, destroySession } = createDatabaseSessionStorage({
  name: "__session",
  sameSite: "lax",
});
