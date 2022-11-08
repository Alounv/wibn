export enum P {
  Morning = "M",
  Afternoon = "A",
  Evening = "E",
}

export enum D {
  Monday = "MO",
  Tuesday = "TU",
  Wednesday = "WE",
  Thursday = "TH",
  Friday = "FR",
  Saturday = "SA",
  Sunday = "SU",
}

export const days: { label: string; id: D }[] = [
  { label: "Monday", id: D.Monday },
  { label: "Tuesday", id: D.Tuesday },
  { label: "Wednesday", id: D.Wednesday },
  { label: "Thursday", id: D.Thursday },
  { label: "Friday", id: D.Friday },
  { label: "Saturday", id: D.Saturday },
  { label: "Sunday", id: D.Sunday },
];

export const dayPeriods: { label: string; id: P }[] = [
  { label: "Morning", id: P.Morning },
  { label: "Afternoon", id: P.Afternoon },
  { label: "Evening", id: P.Evening },
];

export enum Periods {
  MOM = "MO-M",
  MOA = "MO-A",
  MOE = "MO-E",
  TUM = "TU-M",
  TUA = "TU-A",
  TUE = "TU-E",
  WEM = "WE-M",
  WEA = "WE-A",
  WEE = "WE-E",
  THM = "TH-M",
  THA = "TH-A",
  THE = "TH-E",
  FRM = "FR-M",
  FRA = "FR-A",
  FRE = "FR-E",
  SAM = "SA-M",
  SAA = "SA-A",
  SAE = "SA-E",
  SUM = "SU-M",
  SUA = "SU-A",
  SUE = "SU-E",
}
