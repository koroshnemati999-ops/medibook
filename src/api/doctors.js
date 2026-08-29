// src/api/doctors.js

import { supabase } from "../supabase";

export async function getAllDoctors() {
  const { data, error } = await supabase.from("doctors").select("*");
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function getDoctorById(id) {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Response("Doctor not found", { status: 404 });
  }
  return data;
}
export async function doctorsLoader() {
  return await getAllDoctors();
}
export async function doctorProfileLoader({ params }) {
  return await getDoctorById(params.id);
}
