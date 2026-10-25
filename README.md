# Smart Parking — IoT-Integrated Parking Management

A Next.js web application for viewing parking-slot availability, booking a slot for a time window, managing a user profile, and linking an RFID tag. The repository contains the web UI and API layer; it does not include Arduino/ESP firmware.

## Features in the code

- Landing page and account registration/login
- Authenticated dashboard with slot status and automatic refresh every five seconds
- Time-based slot bookings with a duration of 1–5 hours and overlap checks
- User profile and RFID-tag association
- RFID scan endpoint that finds a registered tag and assigns the first available slot
- API routes for slots, bookings, profiles, RFID, and authentication
- Responsive UI with Tailwind CSS and Framer Motion

## Technology

- Next.js App Router, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui-style components, Lucide icons
- Turso/libSQL via `@libsql/client`
- JWT sessions and bcryptjs password hashing
- Prisma is present, but the checked-in `prisma/schema.prisma` is still the generic User/Post starter schema; the application routes query parking tables directly through Turso.

## Local setup

Prerequisites: Node.js 20.9+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the repository root:

   ```dotenv
   TURSO_DATABASE_URL="libsql://your-database.turso.io"
   TURSO_AUTH_TOKEN="your-turso-auth-token"
   JWT_SECRET="replace-with-a-long-random-secret"
   ```

   Use your own Turso database and a unique `JWT_SECRET`. Do not commit real credentials.

3. Ensure your Turso database has a schema compatible with the queries in `src/app/api/`. Current handlers expect `users`, `slots`, and `bookings` tables, including fields for RFID tags, slot status, booking status, start time, and end time.

   **Schema note:** the repository does not currently include a canonical SQL migration for those runtime tables. The committed `db/custom.db` file is not automatically used by the application—the runtime connection in `src/lib/db-turso.ts` points to Turso. The generic Prisma starter schema does not provision the parking tables.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Main routes

| Route | Purpose |
| --- | --- |
| `/api/auth/register`, `/api/auth/login` | User registration and login |
| `/api/slots` | Read slot availability (requires a bearer token) |
| `/api/slots/[id]/availability` | Query slot availability |
| `/api/bookings/book` | Create a time-window booking |
| `/api/users/profile` | User profile operations |
| `/api/users/rfid` | Associate an RFID tag with a user |
| `/api/rfid/scan` | Resolve an RFID tag and assign a free slot |
| `/api/slots/status` | Update a slot's occupied/available status |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | URL of the Turso/libSQL database |
| `TURSO_AUTH_TOKEN` | Authentication token for Turso |
| `JWT_SECRET` | Secret used to sign session tokens |

## Production checklist

- Replace the weak fallback JWT secret in `src/lib/auth.ts` with a required strong secret.
- Protect device-facing endpoints: the current `/api/rfid/scan` and `/api/slots/status` handlers do not validate a caller's identity in the route itself.
- Add and version the SQL schema/migrations for `users`, `slots`, and `bookings`.
- Keep real user data out of the repository and review `db/custom.db` before distributing the project.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the Next.js app
- `npm run lint` — lint the project

The production start script expects the standalone output and Bun runtime configured by the repository.
