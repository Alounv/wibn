import type { User, Group } from "@prisma/client";

import { prisma } from "~/db.server";
import type { Periods } from "~/utilities/periods";

export type { Group } from "@prisma/client";

export async function getGroup({
  id,
  userId,
}: Pick<Group, "id"> & {
  userId: User["id"];
}): Promise<
  | (Pick<Group, "id" | "name" | "description"> & { periods: Periods[] })
  | undefined
> {
  const dbGroup = await prisma.group.findFirst({
    select: { id: true, description: true, name: true, periods: true },
    where: { id, userId },
  });

  if (!dbGroup) return;

  return {
    ...dbGroup,
    periods: (dbGroup?.periods.map(({ period }) => period) as Periods[]) || [],
  };
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
  periods,
}: Pick<Group, "description" | "name"> & {
  userId: User["id"];
  periods: string[];
}) {
  return prisma.group.create({
    data: {
      name,
      description,
      periods: {
        connect: periods.map((p) => ({ period: p })),
      },
      user: {
        connect: {
          id: userId,
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
  userId,
}: Pick<Group, "id"> & { userId: User["id"] }) {
  return prisma.group.deleteMany({
    where: { id, userId },
  });
}
