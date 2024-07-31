"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking, getCabin } from "./data-service";
import { redirect } from "next/navigation";

export async function updateProfile(formData) {
  const session = await auth();

  if (!session?.user) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Invalid national ID number");

  const { error } = await supabase
    .from("guests")
    .update({
      nationality,
      nationalID,
      countryFlag,
    })
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId) {
  const session = await auth();

  if (!session?.user) throw new Error("You must be logged in");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(bookingId, formData) {
  const session = await auth();

  if (!session?.user) throw new Error("You must be logged in");

  const reservation = await getBooking(bookingId);

  if (!reservation) throw new Error("Reservation not found");

  if (reservation.guestId !== session.user.guestId)
    throw new Error("You are not allowed to edit this reservation");

  const cabin = await getCabin(reservation.cabinId);

  const numGuests = formData.get("numGuests");

  if (numGuests > cabin.maxCapacity)
    throw new Error("Number of guests exceeds cabin capacity");

  const { error } = await supabase
    .from("bookings")
    .update({
      numGuests,
      observations: formData.get("observations").slice(0, 1000),
    })
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  // revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();

  if (!session?.user) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function login() {
  return await signIn("google", {
    redirectTo: "/account",
  });
}

export async function logout() {
  return await signOut({
    redirectTo: "/",
  });
}
