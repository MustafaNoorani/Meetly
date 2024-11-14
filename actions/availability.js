"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import {
  startOfDay,
  addDays,
  format,
  parseISO,
  isBefore,
  addMinutes,
} from "date-fns";
export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { ClerkUserid: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });
  if (!user || !user.availability) {
    return null;
  }
  const availabilityData = {
    timegap: user.availability.timegap,
  };
  [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ].forEach((day) => {
    const dayAvailability = user.availability.days.find(
      (d) => d.day === day.charAt(0).toUpperCase() + day.slice(1)
    );
    availabilityData[day] = {
      isAvailable: !!dayAvailability,
      startTime: dayAvailability
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : "09: 00 ",
      endTime: dayAvailability
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : "17: 00 ",
    };
  });
  return availabilityData;
}

export async function updateAvailability(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { ClerkUserid: userId },
    include: { availability: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const availabilityData = Object.entries(data).flatMap(
    ([day, { isAvailable, startTime, endTime }]) => {
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        return [
          {
            day: day.charAt(0).toUpperCase() + day.slice(1),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }
      return [];
    }
  );

  if (user.availability) {
    await db.availability.update({
      where: { id: user.availability.id },
      data: {
        timegap: data.timegap,
        days: {
          deleteMany: {},
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: user.id,
        timegap: data.timegap,
        days: {
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}
export async function getEventAvailability(eventId) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timegap: true,
            },
          },
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.user.availability) {
    return [];
  }

  const { availability, bookings } = event.user;
  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 30); // Get availability for the next 30 days

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, "EEEE");
    const dayAvailability = availability?.days?.find(
      (d) => d.day === dayOfWeek
    );

    if (dayAvailability) {
      const dateStr = format(date, "yyyy-MM-dd");
      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timegap
      );

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  return availableDates;
}

function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0 
) {
  const slots = [];
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  // If the date is today, start from the next available slot after the current time
  const now = new Date();
  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEnd;
  }

  return slots;
}
