# Dispo

Dispo or Wibn* is an app that allow to find common free slot in users calendars.
It can be tested here: https://dispo.fly.dev/.

(* for Wouldn't It Be Nice)

## What

1. You login with Google and connect your agenda (only free / busy slots)
2. You create a group with other users.
3. On a regular basis, the app scans the group members calendar and choose the best time to meet.
4. Then it sends an email to everyone

<img width="500" alt="Screenshot 2022-12-02 at 23 16 04" src="https://user-images.githubusercontent.com/34238160/205399366-a0a2ded5-5cca-4a74-9c01-58db962659f7.png">


## Why

This is a personal project to learn:
- Prisma
- Remix
- Google API
- Nodemailer

## Env

```
DATABASE_URL="file:./data.db?connection_limit=1"
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ORIGIN=
EMAIL_SENDER_USERNAME="a.gmail.username.to.send.email"
EMAIL_SENDER_PASSWORD="an.associated.gmail.password"
TZ="Europe/Paris"
```
