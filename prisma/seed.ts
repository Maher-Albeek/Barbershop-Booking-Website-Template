import { BookingStatus, PrismaClient, Role } from "../lib/generated/prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "DemoAdmin123!";

const shopSeed = {
  name: "Demo Barbershop",
  slug: "demo-barbershop",
  primaryColor: "#111111",
  secondaryColor: "#C59D5F",
  address: "123 Demo Street, 10115 Berlin, Germany",
  phone: "+49 30 12345678",
  email: "info@demo-barbershop.com"
};

const adminSeed = {
  name: "Admin",
  email: "admin@demo-barbershop.com",
  role: Role.shop_admin
};

const employeeSeeds = [
  {
    name: "Marco Russo",
    email: "marco@demo-barbershop.com",
    bio: "Classic barbering specialist focused on sharp fades, scissors work, and polished everyday styling.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
    role: Role.employee
  },
  {
    name: "Daniel Carter",
    email: "daniel@demo-barbershop.com",
    bio: "Known for beard shaping, clean skin fades, and relaxed customer service with precise finishing details.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    role: Role.employee
  }
] as const;

const serviceSeeds = [
  { name: "Haircut" },
  { name: "Beard Trim" },
  { name: "Haircut + Beard" }
] as const;

const assignmentSeeds = {
  "Marco Russo": [
    { service: "Haircut", durationMinutes: 30, price: 28 },
    { service: "Beard Trim", durationMinutes: 20, price: 18 },
    { service: "Haircut + Beard", durationMinutes: 50, price: 42 }
  ],
  "Daniel Carter": [
    { service: "Haircut", durationMinutes: 35, price: 30 },
    { service: "Beard Trim", durationMinutes: 25, price: 20 },
    { service: "Haircut + Beard", durationMinutes: 60, price: 46 }
  ]
} as const;

const workingHourSeeds = {
  "Marco Russo": [
    { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isOff: false },
    { dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isOff: false },
    { dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isOff: false },
    { dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isOff: false },
    { dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isOff: false },
    { dayOfWeek: 6, startTime: "09:00", endTime: "15:00", isOff: false }
  ],
  "Daniel Carter": [
    { dayOfWeek: 1, startTime: "10:00", endTime: "19:00", isOff: false },
    { dayOfWeek: 2, startTime: "10:00", endTime: "19:00", isOff: false },
    { dayOfWeek: 3, startTime: "10:00", endTime: "19:00", isOff: false },
    { dayOfWeek: 4, startTime: "10:00", endTime: "19:00", isOff: false },
    { dayOfWeek: 5, startTime: "10:00", endTime: "19:00", isOff: false },
    { dayOfWeek: 6, startTime: "09:00", endTime: "14:00", isOff: false }
  ]
} as const;

const galleryImageSeeds = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"
] as const;

const offerSeeds = [
  {
    title: "Weekday Grooming Combo",
    description: "Book a haircut and beard service together on weekdays and get the combo at a reduced rate."
  },
  {
    title: "Fresh Fade Friday",
    description: "Friday appointments for premium fade styling include complimentary beard line cleanup."
  }
] as const;

function atTime(baseDate: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function nextWeekday(weekday: number) {
  const today = new Date();
  const result = new Date(today);
  result.setHours(0, 0, 0, 0);

  while (result.getDay() !== weekday) {
    result.setDate(result.getDate() + 1);
  }

  if (result <= today) {
    result.setDate(result.getDate() + 7);
  }

  return result;
}

async function upsertUsers(shopId: number, passwordHash: string) {
  const adminUser = await prisma.user.upsert({
    where: { email: adminSeed.email },
    update: {
      shopId,
      name: adminSeed.name,
      role: adminSeed.role,
      password: passwordHash
    },
    create: {
      shopId,
      name: adminSeed.name,
      email: adminSeed.email,
      role: adminSeed.role,
      password: passwordHash
    }
  });

  const employeeUsers = await Promise.all(
    employeeSeeds.map((employee) =>
      prisma.user.upsert({
        where: { email: employee.email },
        update: {
          shopId,
          name: employee.name,
          role: employee.role,
          password: passwordHash
        },
        create: {
          shopId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          password: passwordHash
        }
      })
    )
  );

  return { adminUser, employeeUsers };
}

async function resetDemoShopData(shopId: number) {
  const employees = await prisma.employee.findMany({
    where: { shopId },
    select: { id: true }
  });
  const employeeIds = employees.map((employee) => employee.id);

  await prisma.booking.deleteMany({ where: { shopId } });

  if (employeeIds.length > 0) {
    await prisma.blockedTime.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await prisma.workingHour.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await prisma.employeeService.deleteMany({ where: { employeeId: { in: employeeIds } } });
  }

  await prisma.employee.deleteMany({ where: { shopId } });
  await prisma.service.deleteMany({ where: { shopId } });
  await prisma.galleryImage.deleteMany({ where: { shopId } });
  await prisma.offer.deleteMany({ where: { shopId } });
}

async function seedEmployees(shopId: number, employeeUsers: Array<{ id: number; email: string }>) {
  const employees = await Promise.all(
    employeeSeeds.map((employee) => {
      const user = employeeUsers.find((entry) => entry.email === employee.email);

      if (!user) {
        throw new Error(`Missing user for employee ${employee.email}`);
      }

      return prisma.employee.create({
        data: {
          shopId,
          userId: user.id,
          name: employee.name,
          bio: employee.bio,
          avatar: employee.avatar,
          isActive: true
        }
      });
    })
  );

  return new Map(employees.map((employee) => [employee.name, employee]));
}

async function seedServices(shopId: number) {
  const services = await Promise.all(
    serviceSeeds.map((service) =>
      prisma.service.create({
        data: {
          shopId,
          name: service.name,
          isActive: true
        }
      })
    )
  );

  return new Map(services.map((service) => [service.name, service]));
}

async function seedAssignments(
  employeesByName: Map<string, { id: number }>,
  servicesByName: Map<string, { id: number }>
) {
  for (const [employeeName, assignments] of Object.entries(assignmentSeeds)) {
    const employee = employeesByName.get(employeeName);

    if (!employee) {
      throw new Error(`Missing employee ${employeeName}`);
    }

    await prisma.employeeService.createMany({
      data: assignments.map((assignment) => {
        const service = servicesByName.get(assignment.service);

        if (!service) {
          throw new Error(`Missing service ${assignment.service}`);
        }

        return {
          employeeId: employee.id,
          serviceId: service.id,
          durationMinutes: assignment.durationMinutes,
          price: assignment.price,
          isActive: true
        };
      })
    });
  }
}

async function seedWorkingHours(employeesByName: Map<string, { id: number }>) {
  for (const [employeeName, workingHours] of Object.entries(workingHourSeeds)) {
    const employee = employeesByName.get(employeeName);

    if (!employee) {
      throw new Error(`Missing employee ${employeeName}`);
    }

    await prisma.workingHour.createMany({
      data: workingHours.map((workingHour) => ({
        employeeId: employee.id,
        dayOfWeek: workingHour.dayOfWeek,
        startTime: workingHour.startTime,
        endTime: workingHour.endTime,
        isOff: workingHour.isOff
      }))
    });
  }
}

async function seedBlockedTimes(employeesByName: Map<string, { id: number }>) {
  const nextTuesday = nextWeekday(2);
  const nextThursday = nextWeekday(4);

  await prisma.blockedTime.createMany({
    data: [
      {
        employeeId: employeesByName.get("Marco Russo")!.id,
        date: nextTuesday,
        startTime: "13:00",
        endTime: "13:45",
        reason: "Lunch break"
      },
      {
        employeeId: employeesByName.get("Daniel Carter")!.id,
        date: nextThursday,
        startTime: "15:00",
        endTime: "16:30",
        reason: "Supplier appointment"
      }
    ]
  });
}

async function seedGallery(shopId: number) {
  await prisma.galleryImage.createMany({
    data: galleryImageSeeds.map((imageUrl) => ({
      shopId,
      imageUrl,
      isVisible: true
    }))
  });
}

async function seedOffers(shopId: number) {
  await prisma.offer.createMany({
    data: offerSeeds.map((offer) => ({
      shopId,
      title: offer.title,
      description: offer.description,
      isActive: true
    }))
  });
}

async function seedBookings(
  shopId: number,
  employeesByName: Map<string, { id: number }>,
  servicesByName: Map<string, { id: number }>
) {
  const nextMonday = nextWeekday(1);
  const nextWednesday = nextWeekday(3);
  const nextFriday = nextWeekday(5);

  await prisma.booking.createMany({
    data: [
      {
        shopId,
        employeeId: employeesByName.get("Marco Russo")!.id,
        serviceId: servicesByName.get("Haircut")!.id,
        customerName: "Liam Becker",
        customerPhone: "+49 151 23456789",
        customerEmail: "liam.becker@example.com",
        bookingDate: nextMonday,
        startTime: atTime(nextMonday, "10:00"),
        endTime: atTime(nextMonday, "10:30"),
        durationSnapshot: 30,
        priceSnapshot: 28,
        status: BookingStatus.CONFIRMED,
        notes: "Prefers a low taper fade."
      },
      {
        shopId,
        employeeId: employeesByName.get("Daniel Carter")!.id,
        serviceId: servicesByName.get("Haircut + Beard")!.id,
        customerName: "Noah Schneider",
        customerPhone: "+49 152 87654321",
        customerEmail: "noah.schneider@example.com",
        bookingDate: nextWednesday,
        startTime: atTime(nextWednesday, "12:00"),
        endTime: atTime(nextWednesday, "13:00"),
        durationSnapshot: 60,
        priceSnapshot: 46,
        status: BookingStatus.CONFIRMED,
        notes: "Wedding event grooming appointment."
      },
      {
        shopId,
        employeeId: employeesByName.get("Marco Russo")!.id,
        serviceId: servicesByName.get("Beard Trim")!.id,
        customerName: "Elias Hoffmann",
        customerPhone: "+49 160 99887766",
        customerEmail: null,
        bookingDate: nextFriday,
        startTime: atTime(nextFriday, "16:00"),
        endTime: atTime(nextFriday, "16:20"),
        durationSnapshot: 20,
        priceSnapshot: 18,
        status: BookingStatus.CONFIRMED,
        notes: "Shape and line cleanup only."
      }
    ]
  });
}

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const shop = await prisma.shop.upsert({
    where: { slug: shopSeed.slug },
    update: shopSeed,
    create: shopSeed
  });

  const { employeeUsers } = await upsertUsers(shop.id, passwordHash);

  await resetDemoShopData(shop.id);

  const employeesByName = await seedEmployees(shop.id, employeeUsers);
  const servicesByName = await seedServices(shop.id);

  await seedAssignments(employeesByName, servicesByName);
  await seedWorkingHours(employeesByName);
  await seedBlockedTimes(employeesByName);
  await seedGallery(shop.id);
  await seedOffers(shop.id);
  await seedBookings(shop.id, employeesByName, servicesByName);

  console.log("Seed completed.");
  console.log(`Shop: ${shopSeed.name} (${shopSeed.slug})`);
  console.log(`Admin login: ${adminSeed.email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
