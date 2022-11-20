import type { User, Group } from "@prisma/client";

import { prisma } from "~/db.server";
import type { Periods } from "~/utilities/periods";

export type { Group } from "@prisma/client";

export async function getGroup({
  id,
  adminId,
}: Pick<Group, "id"> & {
  adminId: User["id"];
}): Promise<
  | (Pick<Group, "id" | "name" | "description"> & {
      periods: Periods[];
      admin: User;
      users: User[];
    })
  | undefined
> {
  const dbGroup = await prisma.group.findFirst({
    select: {
      id: true,
      description: true,
      name: true,
      periods: true,
      admin: true,
      users: {
        select: {
          user: true,
        },
      },
    },
    where: { id, adminId },
  });

  if (!dbGroup) return;

  return {
    ...dbGroup,
    users: dbGroup.users.map(({ user }) => user),
    periods: (dbGroup?.periods.map(({ period }) => period) as Periods[]) || [],
  };
}

export function getGroupListItems({ adminId }: { adminId: User["id"] }) {
  return prisma.group.findMany({
    where: { adminId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createGroup({
  description,
  name,
  adminId,
  periods,
}: Pick<Group, "description" | "name"> & {
  adminId: User["id"];
  periods: string[];
}) {
  return prisma.group.create({
    data: {
      name,
      description,
      periods: {
        connect: periods.map((p) => ({ period: p })),
      },
      admin: {
        connect: {
          id: adminId,
        },
      },
    },
  });
}

export function updateGroup({
  id,
  description,
  periods,
  name,
}: Pick<Group, "description" | "name" | "id"> & {
  periods: string[];
}) {
  return prisma.group.update({
    where: { id },
    data: {
      name,
      description,
      periods: {
        set: periods.map((p) => ({ period: p })),
      },
    },
  });
}

export function deleteGroup({
  id,
  adminId,
}: Pick<Group, "id"> & { adminId: User["id"] }) {
  return prisma.group.deleteMany({
    where: { id, adminId },
  });
}
