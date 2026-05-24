import { prisma } from "@/lib/prisma";
import { loadEmployeeProfiles } from "@/lib/employee-profile-storage";

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

  const employeeProfiles = loadEmployeeProfiles();

  return employees.map((employee) => ({
    ...employee,
    position: employeeProfiles[employee.id]?.position,
    instagramUrl: employeeProfiles[employee.id]?.instagramUrl
  }));
}

export async function getEmployeeById(id: number) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      avatar: true,
      isActive: true
    }
  });

  if (!employee) {
    return null;
  }

  const employeeProfiles = loadEmployeeProfiles();

  return {
    ...employee,
    position: employeeProfiles[id]?.position,
    instagramUrl: employeeProfiles[id]?.instagramUrl
  };
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

  const employeeProfiles = loadEmployeeProfiles();

  return employees.map((employee) => ({
    ...employee,
    position: employeeProfiles[employee.id]?.position,
    instagramUrl: employeeProfiles[employee.id]?.instagramUrl
  }));
}
