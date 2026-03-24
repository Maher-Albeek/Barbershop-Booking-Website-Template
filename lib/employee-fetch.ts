import { prisma } from "@/lib/prisma";

export async function getActiveEmployees() {
  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      bio: true,
      avatar: true,
      isActive: true
    },
    orderBy: { name: "asc" }
  });

  return employees;
}

export async function getEmployeeById(id: number) {
  return prisma.employee.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      avatar: true,
      isActive: true
    }
  });
}

export async function getAllEmployees() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      name: true,
      bio: true,
      avatar: true,
      isActive: true
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }]
  });

  return employees;
}
