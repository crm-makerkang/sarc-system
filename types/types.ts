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
  calf_grith: string,
  grip_strength: string,
  chair_standup5: string,
  muscle_quantity: string,
  gait_speed4: string,
  gait_speed6: string,
  balanceA: string,
  balanceB: string,
  balanceC: string,
  uid: string,
  rid: string
}

export type Diagonose = {
  calf_grith: string,
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
  dia_examiner: string,
  sarc_f_Q1: string,
  sarc_f_Q2: string,
  sarc_f_Q3: string,
  sarc_f_Q4: string,
  sarc_f_Q5: string
}