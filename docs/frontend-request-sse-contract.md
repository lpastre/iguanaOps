# Proposed frontend request and SSE contract

This is a proposed frontend integration contract for the personal request dashboard. It is not backend-confirmed and must not be treated as production API documentation until the backend owner agrees.

## Request list

- `GET /api/requests`
- Requires an authenticated same-origin session.
- Response: `PersonalRequest[]`
- Fields:
  - `id`: stable request identifier
  - `title`: display title
  - `status`: `pending`, `running`, `completed`, `failed`, or `cancelled`
  - `progress`: integer percentage from 0 through 100
  - `updatedAt`: ISO-8601 timestamp

The frontend SHALL return only requests owned by the authenticated user. Ownership filtering is the backend's responsibility.

## Live updates

- `GET /api/requests/events`
- Same-origin credentialed SSE connection.
- Event body: JSON matching `RequestProgressEvent`
- Fields:
  - `requestId`: identifier of the matching request
  - `status`: the same status values used by the request list
  - `progress`: integer percentage from 0 through 100
  - `updatedAt`: ISO-8601 timestamp

The frontend must not place bearer tokens or secrets in the event URL. A disconnect must preserve the most recently loaded request data and expose stale/live-unavailable state.

## Pending backend decisions

- Confirm whether `/api/requests` and `/api/requests/events` are the deployed paths.
- Confirm bearer/cookie authentication behavior for same-origin requests and SSE.
- Confirm completion and terminal-error event semantics.
- Confirm pagination and ownership/error response shapes.
