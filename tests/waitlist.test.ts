import assert from "node:assert/strict";
import { handleWaitlistRequest, type WaitlistBindings } from "../functions/api/waitlist";

type StoredSubmission = {
  name: string;
  email: string;
  useCase: string | null;
  source: string;
};

class MockWaitlistDb {
  public readonly rows = new Map<string, StoredSubmission>();

  constructor(private readonly shouldFail = false) {}

  prepare() {
    return {
      bind: (name: string, email: string, useCase: string | null, source: string) => ({
        run: async () => {
          if (this.shouldFail) {
            throw new Error("simulated D1 failure");
          }

          if (this.rows.has(email)) {
            return d1Result(0);
          }

          this.rows.set(email, { name, email, useCase, source });
          return d1Result(1);
        },
      }),
    };
  }
}

const sameOrigin = "https://agentdock.example";

function d1Result(changes: number) {
  return {
    success: true,
    results: [],
    meta: {
      duration: 1,
      size_after: 1,
      rows_read: 0,
      rows_written: changes,
      last_row_id: changes,
      changed_db: changes > 0,
      changes,
    },
  };
}

async function postJson(
  db: MockWaitlistDb,
  body: unknown,
  init?: { contentType?: string; rawBody?: string; origin?: string },
) {
  const request = new Request(`${sameOrigin}/api/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": init?.contentType ?? "application/json",
      Origin: init?.origin ?? sameOrigin,
    },
    body: init?.rawBody ?? JSON.stringify(body),
  });

  return handleWaitlistRequest(request, { WAITLIST_DB: db });
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

const tests: Array<[string, () => Promise<void>]> = [
  [
    "valid submission",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, {
        name: "William",
        email: "william@example.com",
        useCase: "I want multiple coding agents working together.",
        website: "",
      });

      assert.equal(response.status, 201);
      assert.deepEqual(await readJson(response), {
        ok: true,
        alreadyJoined: false,
        message: "You're on the AIgency waitlist.",
      });
      assert.equal(db.rows.size, 1);
    },
  ],
  [
    "missing name",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, { email: "william@example.com", website: "" });

      assert.equal(response.status, 400);
      assert.equal((await readJson(response)).ok, false);
      assert.equal(db.rows.size, 0);
    },
  ],
  [
    "invalid email",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, { name: "William", email: "not-email", website: "" });

      assert.equal(response.status, 400);
      assert.equal((await readJson(response)).error, "Email must be a valid email address.");
      assert.equal(db.rows.size, 0);
    },
  ],
  [
    "email normalisation",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, {
        name: " William ",
        email: " William@Example.COM ",
        website: "",
      });

      assert.equal(response.status, 201);
      assert.equal(db.rows.has("william@example.com"), true);
      assert.equal(db.rows.get("william@example.com")?.name, "William");
    },
  ],
  [
    "optional use case",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, {
        name: "William",
        email: "william@example.com",
        website: "",
      });

      assert.equal(response.status, 201);
      assert.equal(db.rows.get("william@example.com")?.useCase, null);
    },
  ],
  [
    "duplicate email",
    async () => {
      const db = new MockWaitlistDb();
      await postJson(db, { name: "William", email: "william@example.com", website: "" });
      const response = await postJson(db, { name: "William", email: "william@example.com", website: "" });

      assert.equal(response.status, 200);
      assert.deepEqual(await readJson(response), {
        ok: true,
        alreadyJoined: true,
        message: "You're already on the AIgency waitlist.",
      });
      assert.equal(db.rows.size, 1);
    },
  ],
  [
    "honeypot submission",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, {
        name: "William",
        email: "william@example.com",
        website: "https://spam.example",
      });

      assert.equal(response.status, 400);
      assert.equal((await readJson(response)).ok, false);
      assert.equal(db.rows.size, 0);
    },
  ],
  [
    "malformed JSON",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, {}, { rawBody: "{", contentType: "application/json" });

      assert.equal(response.status, 400);
      assert.equal((await readJson(response)).error, "Request body must be valid JSON.");
      assert.equal(db.rows.size, 0);
    },
  ],
  [
    "unsupported content type",
    async () => {
      const db = new MockWaitlistDb();
      const response = await postJson(db, "name=William", {
        rawBody: "name=William",
        contentType: "application/x-www-form-urlencoded",
      });

      assert.equal(response.status, 400);
      assert.equal((await readJson(response)).error, "Content-Type must be application/json.");
      assert.equal(db.rows.size, 0);
    },
  ],
  [
    "D1 failure response",
    async () => {
      const db = new MockWaitlistDb(true);
      const originalConsoleError = console.error;
      console.error = () => undefined;

      let response: Response;
      try {
        response = await postJson(db, {
          name: "William",
          email: "william@example.com",
          website: "",
        });
      } finally {
        console.error = originalConsoleError;
      }

      assert.equal(response.status, 500);
      assert.deepEqual(await readJson(response), {
        ok: false,
        error: "The waitlist could not be updated. Please try again.",
      });
    },
  ],
];

for (const [name, run] of tests) {
  await run();
  console.log(`ok - ${name}`);
}
