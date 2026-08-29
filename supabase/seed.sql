-- MediBook doctor seed data
-- Sources: mock API (VITE_API_BASE_URL/dotcors) for doctors 1-4;
-- doctors 5-6 reconstructed to match project constants and local avatars.

insert into public.doctors (
  id,
  name,
  specialty,
  avatar,
  rating,
  reviews,
  experience,
  city,
  price,
  available,
  languages,
  insurance,
  about,
  address
) values
  (
    1,
    'Dr. Amara Okafor',
    'Cardiologist',
    '/doctors/doctor-1.png',
    4.9,
    312,
    14,
    'San Francisco',
    180.00,
    true,
    'English, French',
    'Aetna, Blue Cross, Cigna',
    'Dr. Okafor is a board-certified cardiologist specializing in preventive heart care and arrhythmia management.',
    '450 Sutter St, Suite 1200, San Francisco, CA 94108'
  ),
  (
    2,
    'Dr. Sofia Patel',
    'Dermatologist',
    '/doctors/doctor-2.png',
    4.7,
    198,
    10,
    'New York',
    160.00,
    true,
    'English, Hindi',
    'Aetna, Medicare, Cigna',
    'Dr. Patel specializes in clinical and cosmetic dermatology with a focus on skin cancer prevention.',
    '123 Fifth Ave, Suite 300, New York, NY 10001'
  ),
  (
    3,
    'Dr. James Osei',
    'Neurologist',
    '/doctors/doctor-3.png',
    4.8,
    143,
    18,
    'Chicago',
    210.00,
    false,
    'English',
    'Blue Cross, UnitedHealthcare',
    'Dr. Osei is an expert in epilepsy and movement disorders with over 18 years of clinical experience.',
    '676 N St Clair St, Chicago, IL 60611'
  ),
  (
    4,
    'Dr. Mia Tanaka',
    'Pediatrician',
    '/doctors/doctor-4.png',
    5.0,
    276,
    8,
    'Seattle',
    130.00,
    true,
    'English, Japanese',
    'Aetna, Cigna, Medicare',
    'Dr. Tanaka is passionate about child wellness and developmental pediatrics.',
    '1100 9th Ave, Seattle, WA 98101'
  ),
  (
    5,
    'Dr. David Kim',
    'Orthopedist',
    '/doctors/doctor-5.png',
    4.6,
    167,
    12,
    'Austin',
    175.00,
    true,
    'English, Korean',
    'Blue Cross, Cigna, UnitedHealthcare',
    'Dr. Kim focuses on sports medicine and minimally invasive joint procedures for active patients.',
    '901 W 38th St, Suite 200, Austin, TX 78705'
  ),
  (
    6,
    'Dr. Rachel Nguyen',
    'Orthopedist',
    '/doctors/doctor-6.png',
    4.5,
    121,
    15,
    'Austin',
    190.00,
    true,
    'English, Vietnamese',
    'Aetna, Blue Cross, Medicare',
    'Dr. Nguyen specializes in spine care and rehabilitation for chronic back and neck conditions.',
    '1301 Barbara Jordan Blvd, Austin, TX 78723'
  )
on conflict (id) do nothing;

-- Keep identity sequence aligned after explicit ids
select setval(
  pg_get_serial_sequence('public.doctors', 'id'),
  coalesce((select max(id) from public.doctors), 1)
);
