import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ledgerUrl = new URL(
  "../../ai-memories/materials/2026-07-26-material-ledger.csv",
  import.meta.url,
);

const expectedColumns = [
  "id",
  "source_path",
  "proposed_public_title",
  "type",
  "language",
  "related_product_or_industry",
  "content_status",
  "publication_status",
  "replacement_need",
  "quality_flag",
  "notes",
];

const contentStatuses = new Set([
  "example-placeholder",
  "mixed",
  "pending-replacement",
  "verified-content",
]);

const publicationStatuses = new Set([
  "approved",
  "not-applicable",
  "not-approved",
  "review-required",
  "unavailable",
]);

function parseCsv(csv) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if (character === "\n" && !quoted) {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  assert.equal(quoted, false, "ledger contains an unterminated quoted field");
  if (field || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

test("material ledger satisfies its tracking contract", async () => {
  const rows = parseCsv(await readFile(ledgerUrl, "utf8"));
  const [headers, ...entries] = rows;

  assert.deepEqual(headers, expectedColumns);
  assert.ok(entries.length > 0, "ledger must contain at least one material entry");

  const ids = new Set();
  for (const [index, entry] of entries.entries()) {
    const rowNumber = index + 2;
    assert.equal(entry.length, expectedColumns.length, `invalid column count on row ${rowNumber}`);

    const record = Object.fromEntries(headers.map((header, column) => [header, entry[column]]));
    for (const column of expectedColumns) {
      assert.ok(record[column].trim(), `${column} is empty on row ${rowNumber}`);
    }

    assert.ok(!ids.has(record.id), `duplicate id ${record.id}`);
    ids.add(record.id);
    assert.ok(contentStatuses.has(record.content_status), `invalid content status on row ${rowNumber}`);
    assert.ok(
      publicationStatuses.has(record.publication_status),
      `invalid publication status on row ${rowNumber}`,
    );
    assert.ok(!record.source_path.startsWith("/"), `absolute source path on row ${rowNumber}`);
    assert.ok(!record.source_path.includes("\\"), `non-portable source path on row ${rowNumber}`);
  }
});

test("material ledger represents the complete local archive inventory", async () => {
  const rows = parseCsv(await readFile(ledgerUrl, "utf8"));
  const [headers, ...entries] = rows;
  const records = entries.map((entry) =>
    Object.fromEntries(headers.map((header, column) => [header, entry[column]])),
  );
  const archiveFiles = records.filter((record) => record.source_path.startsWith("全资料/案例/"));
  const archive = records.find((record) => record.id === "archive-full-materials");
  const archivePaths = new Set(archiveFiles.map((record) => record.source_path));
  const archiveHashes = new Set(
    archiveFiles.map((record) => record.notes.match(/SHA-256 ([a-f0-9]{64})$/)?.[1]),
  );

  assert.equal(archiveFiles.length, 35, "all 35 extracted archive files must be represented");
  assert.equal(archivePaths.size, 35, "archive source paths must be unique");
  assert.ok(!archiveHashes.has(undefined), "each archive file must record its SHA-256");
  assert.equal(archiveHashes.size, 35, "archive SHA-256 values must be unique");
  assert.ok(archive, "archive metadata record must exist");
  assert.notEqual(archive.publication_status, "unavailable", "local archive is no longer unavailable");
  assert.match(archive.notes, /35 extracted files matched the archive listing/);
});
