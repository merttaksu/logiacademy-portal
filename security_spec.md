# Security Specification

## 1. Data Invariants
- **Authentication**: All read/write operations (create, update, delete, list, get) must be performed by authenticated users with a verified email.
- **Instructor Authorization**: The user's authenticated email must be the bootstrapped admin (`mertaksu15.MA@gmail.com`) or they must have a valid instructor record matching their UID.
- **Document IDs**: Document IDs must be validated using `isValidId()` to prevent injection and resource exhaustion attacks.
- **Timestamps**: All creation and update timestamps must match the server timestamp (`request.time`).
- **Student Integrity**: Students can be created by any authorized instructor, but the ID must match the format.
- **No Self-Privilege Escalation**: Users cannot self-assign elevated roles or change system-critical configuration without administrator authorization.

## 2. The "Dirty Dozen" Payloads (Exploit Payloads)
Below are 12 malicious payloads/actions that are designed to breach security, and how the rules must reject them with `PERMISSION_DENIED`.

1. **Unauthenticated Read**: Reading the entire student list without being signed in.
2. **Identity Spoofing in Create**: Attempting to create an instructor record with a different UID or email.
3. **Ghost Field Injection**: Creating a student document with an extra unapproved field (`isAdmin: true`).
4. **Invalid Document ID Poisoning**: Creating a course module with a 2KB garbage document ID to cause a resource/wallet drain.
5. **Client-Controlled Timestamp**: Trying to write a custom, client-generated `createdAt` timestamp (e.g. 5 years ago) instead of `request.time`.
6. **State Shortcutting in Attendance**: Updating an attendance record to an unapproved status (e.g. `"absent-excused"` instead of `"present"`, `"absent"`, `"late"`).
7. **Unauthorized Admin Access**: Non-instructor attempting to modify global portal settings.
8. **Negative Student Count**: Setting a scheduled class to have a negative number of students (e.g. `-15`).
9. **Tampering with Immutable Course ID**: Attempting to change a course's `id` during an update.
10. **Resource Over-sizing**: Submitting an enormous string (1MB) as the title of a recent topic.
11. **Spoofed Email Domain**: Signing in with an unverified email address to gain access.
12. **Foreign Data Update**: An unassigned instructor trying to delete another instructor's assigned school record.

## 3. The Test Runner Spec (`firestore.rules.test.ts`)
The test suite ensures all these vectors return `PERMISSION_DENIED` and that only valid operations succeed.
