import { supabase } from "../supabase";

export async function createAppointment(
  doctor_id,
  date,
  time,
  location,
  total,
  status,
  patient_id,
) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({ doctor_id, date, time, location, total, status, patient_id })
    .select("*");

  if (error) {
    console.error(error.message);
    if (error.code === "23505") {
      throw new Error(
        "This time slot is already booked. Please choose another time.",
      );
    }
    throw new Error(error.message);
  }
  return data;
}
export async function getMyAppointments() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*, doctors(*)")
    .eq("patient_id", user.id);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
}
export async function cancelAppointment(id) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
}
