import { type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export type BookingRecord = {
  id: string;
  status: "confirmed";
  locale: Locale;
  serviceSlug: string;
  serviceName: string;
  employeeSlug: string;
  employeeName: string;
  date: string;
  start: string;
  end: string;
  durationSnapshot: number;
  priceSnapshot: string;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export type AvailableSlot = {
  dateKey: string;
  start: string;
  end: string;
  employeeSlug: string;
  employeeName: string;
  durationMinutes: number;
  priceLabel: string;
};

type CreateBookingInput = {
  locale: Locale;
  serviceSlug: string;
  employeeSlug: string;
  date: string;
  start: string;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __barbershopBookings: BookingRecord[] | undefined;
}

function getBookingStore() {
  if (!globalThis.__barbershopBookings) {
    globalThis.__barbershopBookings = [];
  }

  return globalThis.__barbershopBookings;
}

export function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutes(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function overlaps(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && endA > startB;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getActiveService(locale: Locale, serviceSlug: string) {
  return siteConfig.services[locale].services.find(
    (service) => service.isActive && service.slug === serviceSlug
  );
}

function getEligibleEmployees(locale: Locale, serviceSlug: string) {
  const assignments = siteConfig.booking.employeeServices.filter(
    (assignment) => assignment.isActive && assignment.serviceSlug === serviceSlug
  );

  return siteConfig.team[locale].members.filter(
    (member) =>
      member.isActive &&
      member.bookingServiceSlugs.includes(serviceSlug) &&
      assignments.some((assignment) => assignment.employeeSlug === member.slug)
  );
}

export function listAvailableSlots(locale: Locale, serviceSlug: string, employeeSlug?: string) {
  const service = getActiveService(locale, serviceSlug);

  if (!service) {
    return [];
  }

  const eligibleEmployees = getEligibleEmployees(locale, serviceSlug);
  const requestedEmployees = employeeSlug
    ? eligibleEmployees.filter((member) => member.slug === employeeSlug)
    : eligibleEmployees;
  const today = startOfLocalDay(new Date());
  const createdBookings = getBookingStore();

  return requestedEmployees
    .flatMap((member) => {
      const assignment = siteConfig.booking.employeeServices.find(
        (item) =>
          item.employeeSlug === member.slug && item.serviceSlug === serviceSlug && item.isActive
      );

      if (!assignment) {
        return [];
      }

      const slots: AvailableSlot[] = [];

      for (let dayOffset = 0; dayOffset < siteConfig.booking.searchWindowDays; dayOffset += 1) {
        const day = addDays(today, dayOffset);
        const dateKey = formatDateKey(day);
        const workingDay = siteConfig.booking.workingHours.find(
          (entry) => entry.employeeSlug === member.slug && entry.weekday === day.getDay()
        );

        if (!workingDay || workingDay.isOff) {
          continue;
        }

        const shiftStart = parseTimeToMinutes(workingDay.start);
        const shiftEnd = parseTimeToMinutes(workingDay.end);
        const blockers = [
          ...siteConfig.booking.blockedTimes
            .filter((item) => item.employeeSlug === member.slug && item.date === dateKey)
            .map((item) => ({
              start: parseTimeToMinutes(item.start),
              end: parseTimeToMinutes(item.end)
            })),
          ...siteConfig.booking.existingBookings
            .filter((item) => item.employeeSlug === member.slug && item.date === dateKey)
            .map((item) => ({
              start: parseTimeToMinutes(item.start),
              end: parseTimeToMinutes(item.end)
            })),
          ...createdBookings
            .filter((item) => item.employeeSlug === member.slug && item.date === dateKey)
            .map((item) => ({
              start: parseTimeToMinutes(item.start),
              end: parseTimeToMinutes(item.end)
            }))
        ];

        for (
          let startMinutes = shiftStart;
          startMinutes + assignment.durationMinutes <= shiftEnd;
          startMinutes += siteConfig.booking.slotIntervalMinutes
        ) {
          const endMinutes = startMinutes + assignment.durationMinutes;
          const collides = blockers.some((blocker) =>
            overlaps(startMinutes, endMinutes, blocker.start, blocker.end)
          );

          if (collides) {
            continue;
          }

          slots.push({
            dateKey,
            start: formatMinutes(startMinutes),
            end: formatMinutes(endMinutes),
            employeeSlug: member.slug,
            employeeName: member.name,
            durationMinutes: assignment.durationMinutes,
            priceLabel: assignment.priceLabel
          });
        }
      }

      return slots;
    })
    .sort((left, right) => {
      const leftKey = `${left.dateKey}-${left.start}-${left.employeeSlug}`;
      const rightKey = `${right.dateKey}-${right.start}-${right.employeeSlug}`;
      return leftKey.localeCompare(rightKey);
    });
}

export function createConfirmedBooking(input: CreateBookingInput) {
  const service = getActiveService(input.locale, input.serviceSlug);

  if (!service) {
    throw new Error("invalid_service");
  }

  const employee = getEligibleEmployees(input.locale, input.serviceSlug).find(
    (member) => member.slug === input.employeeSlug
  );

  if (!employee) {
    throw new Error("invalid_employee");
  }

  const slot = listAvailableSlots(input.locale, input.serviceSlug, input.employeeSlug).find(
    (item) => item.dateKey === input.date && item.start === input.start
  );

  if (!slot) {
    throw new Error("slot_unavailable");
  }

  const booking: BookingRecord = {
    id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    status: "confirmed",
    locale: input.locale,
    serviceSlug: service.slug,
    serviceName: service.name,
    employeeSlug: employee.slug,
    employeeName: employee.name,
    date: slot.dateKey,
    start: slot.start,
    end: slot.end,
    durationSnapshot: slot.durationMinutes,
    priceSnapshot: slot.priceLabel,
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    notes: input.notes,
    createdAt: new Date().toISOString()
  };

  getBookingStore().push(booking);
  return booking;
}

export function getBookingById(id: string) {
  return getBookingStore().find((booking) => booking.id === id);
}
