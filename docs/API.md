# API contract

## `GET /api/jobs`

Public endpoint. Returns the list of jobs, optionally filtered by query parameters.

### Query parameters

All optional. All combinable (AND).

| Param | Type | Behaviour |
|---|---|---|
| `q` | string | Case-insensitive substring (`ILIKE %q%`) on `title` OR `description` |
| `location` | string | Case-insensitive match on `office` |
| `contract_type` | enum | Exact match. Allowed: `FULL_TIME`, `PART_TIME`, `TEMPORARY`, `FREELANCE`, `INTERNSHIP`, `APPRENTICESHIP`, `VIE` |
| `work_mode` | enum | Exact match. Allowed: `onsite`, `remote`, `hybrid` |

Invalid enum values are silently ignored (no error, just no filter applied) so a malformed query still returns a 200 with results rather than 4xx — keeps the public API forgiving.

### Response

`200 OK` always (empty array if no match).

```json
{
  "data": [
    {
      "id": 1,
      "title": "Dev Backend",
      "description": "...",
      "contract_type": "FULL_TIME",
      "office": "Paris",
      "status": "published",
      "work_mode": "onsite",
      "profession_id": 1,
      "inserted_at": "2026-05-10T13:28:45",
      "updated_at": "2026-05-10T13:28:45"
    }
  ]
}
```

### Examples

```
GET /api/jobs
GET /api/jobs?q=react
GET /api/jobs?location=Paris&work_mode=remote
GET /api/jobs?q=senior&contract_type=FULL_TIME&work_mode=hybrid&location=Nantes
```

### Notes

- Currently returns jobs of all statuses (including `draft`) to all callers, mirroring the pre-existing `list_jobs/0` behaviour. With more time, drafts would be filtered out for unauthenticated callers.
- No pagination yet — the dataset is small.
