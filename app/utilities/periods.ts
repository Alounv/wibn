export enum P {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening",
}

export enum D {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export const days: D[] = [
  D.Monday,
  D.Tuesday,
  D.Wednesday,
  D.Thursday,
  D.Friday,
  D.Saturday,
  D.Sunday,
];

export const periods: P[] = [P.Morning, P.Afternoon, P.Evening];
