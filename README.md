# FYMIE

**Find Your Match in the Event**

Treks and events are more popular than ever, but two problems keep people home:

1. You often do not know what is happening nearby
2. Even when you do, friends may not want to join

FYMIE shows events around you and matches a partner or group based on interests, hobbies, and likes so you can enjoy the experience together.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MVP (local demo)

No backend required. Auth and data live in the browser (`localStorage`).

1. Create an account at `/signup` as a traveler, organizer, or tour company
2. Set fit prefs + phone OTP on `/profile` (demo code `123456`)
3. Browse `/events` by launch region: Delhi NCR, Mumbai, Himachal, Uttarakhand
4. List a plan at `/events/new`
5. Tap **I want to go** (public meetup checklist required)
6. Tap **Interested in going together** on a companion; mutual unlock opens `/chat`

Demo logins: `aria@demo.fymie`, `kai@demo.fymie`, `noor@demo.fymie`, `dev@demo.fymie`

Aria and Dev already have mutual interest on Triund. Sign in as either to open Chats.

Clear site localStorage once if you still see old seed data (`fymie-seeded-v4`).

## Roadmap

1. Landing page
2. MVP - auth, profiles, event browse, interest matching (current)
3. Matching algorithm polish, event feed, chat
