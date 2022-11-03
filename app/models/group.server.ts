import type { User, Group } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Group } from "@prisma/client";

export function getGroup({
  id,
  userId,
}: Pick<Group, "id"> & {
  userId: User["id"];
}) {
  return prisma.group.findFirst({
    select: { id: true, description: true, name: true },
    where: { id, userId },
  });
}

export function getGroupListItems({ userId }: { userId: User["id"] }) {
  return prisma.group.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createGroup({
  description,
  name,
  userId,
}: Pick<Group, "description" | "name"> & {
  userId: User["id"];
}) {
  return prisma.group.create({
    data: {
      name,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteGroup({
  id,
  userId,
}: Pick<Group, "id"> & { userId: User["id"] }) {
  return prisma.group.deleteMany({
    where: { id, userId },
  });
}
