import type { User, Group } from "@prisma/client";

import { prisma } from "~/db.server";
import { getGroupUsersAvailabilities } from "~/services/availabilities.server";
import type { Periods } from "~/utilities/periods";

export type { Group } from "@prisma/client";

type GetGroupOutput = Promise<
  | (Pick<Group, "id" | "name" | "description"> & {
      periods: Periods[];
      users: User[];
      admin: User;
    })
  | undefined
>;

async function getGroupByQuery({ query }: any): GetGroupOutput {
  const dbGroup = await prisma.group.findFirst({
    select: {
      id: true,
      description: true,
      name: true,
      periods: true,
      users: true,
      admin: true,
    },
    where: query,
  });

  if (!dbGroup) return;

  return {
    ...dbGroup,
    periods: (dbGroup?.periods.map(({ period }) => period) as Periods[]) || [],
  };
}

export async function getGroup({
  id,
  userId,
}: Pick<Group, "id"> & {
  userId: User["id"];
}): GetGroupOutput {
  return getGroupByQuery({ id, users: { some: { userId } } });
}

export async function getAdministeredGroup({
  id,
  adminId,
}: Pick<Group, "id"> & {
  adminId: User["id"];
}): GetGroupOutput {
  return getGroupByQuery({ id, adminId });
}

export function listUserGroups({ userId }: { userId: User["id"] }) {
  return prisma.group.findMany({
    where: { users: { some: { id: userId } } },
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
      periods: { connect: periods.map((p) => ({ period: p })) },
      admin: { connect: { id: adminId } },
      users: { connect: { id: adminId } },
    },
  });
}

export async function updateGroup({
  id,
  description,
  periods,
  name,
  emails,
  adminEmail,
}: Pick<Group, "description" | "name" | "id"> & {
  periods: string[];
  emails: string[];
  adminEmail: string | null;
}) {
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true, email: true },
  });

  const setUsers = existingUsers.map(({ id }) => ({ id }));

  const newEmails = emails.filter((email) => {
    return !existingUsers.some((u) => u.email === email);
  });

  const createUsers = newEmails.map((email) => ({ email }));

  return prisma.group.update({
    where: { id },
    data: {
      name,
      description,
      periods: { set: periods.map((p) => ({ period: p })) },
      users: {
        set: setUsers,
        create: createUsers,
      },
      ...(adminEmail && { admin: { connect: { email: adminEmail } } }),
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

const getGroupUsersAndSlots = async (id: Group["id"]) => {
  const groupWithUsers = await prisma.group.findFirst({
    where: { id },
    select: {
      periods: true,
      users: true,
    },
  });
  const group = {
    ...groupWithUsers,
    periods: groupWithUsers?.periods.map(({ period }) => period) || [],
    users: groupWithUsers?.users || [],
  };
  return group;
};

export const getGroupAvailabilities = async ({
  groupId,
  start,
  end,
}: {
  groupId: Group["id"];
  start: Date;
  end: Date;
}) => {
  const group = await getGroupUsersAndSlots(groupId);

  return getGroupUsersAvailabilities({
    users: group.users,
    possibilities: group.periods as Periods[],
    start,
    end,
  });
};
