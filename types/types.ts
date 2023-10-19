export type UserInfo = {
  id: string,
  name: string,
  card_no: string,
  phone: string,
  email: string,
  gender: string,
  age: string,
  height: string,
  weight: string
}

export type Measurement = {
  datetime: string,
  name: string,
  calf_girth: string,
  grip_strength: string,
  chair_standup5: string,
  muscle_quantity: string,
  gait_speed4: string,
  gait_speed6: string,
  balanceA: string,
  balanceB: string,
  balanceC: string,
  asm: string,
  tug: string,
  walk_400m: string
  uid: string,
  rid: string
}

export type Diagnose = {
  calf_girth: string,
  grip_strength: string,
  chair_standup5: string,
  muscle_quantity: string,
  gait_speed4: string,
  gait_speed6: string,
  balanceA: string,
  balanceB: string,
  balanceC: string,
  uid: string,
  rid: string,
  dia_id: string,
  dia_datetime: string,
  dia_result: string,
  primary_examiner: string,
  hospital_examiner: string,
  sarc_f_Q1: string,
  sarc_f_Q2: string,
  sarc_f_Q3: string,
  sarc_f_Q4: string,
  sarc_f_Q5: string,
  sarc_f_score: string,
  sarc_calf_score: string,
  sppb_score: string,
  primary_comments: string,
  clinicalIssues: string,
  hospital_comments: string,
  asm: string,
  tug: string,
  walk_400m: string
}