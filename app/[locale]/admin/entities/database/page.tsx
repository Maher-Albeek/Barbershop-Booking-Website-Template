import { notFound } from "next/navigation";
import { AdminShell, SectionTitle, inputStyle, sectionStyle, surfaceCardStyle } from "../../_components";
import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type AdminDatabasePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ table?: string | string[] }>;
};

type TableNameRow = {
  tableName: string;
};

type DatabaseNameRow = {
  databaseName: string | null;
};

type TableCountRow = {
  totalRows: bigint | number;
};

const TABLE_PREVIEW_LIMIT = 50;

function isSafeTableName(value: string) {
  return /^[A-Za-z0-9_]+$/.test(value);
}

function serializeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export default async function AdminDatabasePage({ params, searchParams }: AdminDatabasePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const [databaseInfo] = await prisma.$queryRaw<DatabaseNameRow[]>`
    SELECT DATABASE() AS databaseName
  `;
  const databaseName = databaseInfo?.databaseName ?? "unknown";

  const tables = await prisma.$queryRaw<TableNameRow[]>`
    SELECT TABLE_NAME AS tableName
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
    ORDER BY TABLE_NAME
  `;

  const allTableNames = tables
    .map((table) => table.tableName)
    .filter(isSafeTableName);

  const rawSelectedTable = resolvedSearchParams.table;
  const selectedTableValue = Array.isArray(rawSelectedTable) ? rawSelectedTable[0] : rawSelectedTable;
  const selectedTable = selectedTableValue && allTableNames.includes(selectedTableValue)
    ? selectedTableValue
    : undefined;

  const tableNamesToDisplay = selectedTable ? [selectedTable] : [];

  const tableData = await Promise.all(
    tableNamesToDisplay
      .map(async (tableName) => {
        const countRows = await prisma.$queryRawUnsafe<TableCountRow[]>(
          `SELECT COUNT(*) AS totalRows FROM \`${tableName}\``
        );
        const previewRows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
          `SELECT * FROM \`${tableName}\` LIMIT ${TABLE_PREVIEW_LIMIT}`
        );

        const totalRowsRaw = countRows[0]?.totalRows ?? 0;
        const totalRows =
          typeof totalRowsRaw === "bigint" ? Number(totalRowsRaw) : Number(totalRowsRaw || 0);

        const columns = Array.from(
          new Set(previewRows.flatMap((row) => Object.keys(row)))
        );

        return {
          tableName,
          totalRows,
          columns,
          previewRows
        };
      })
  );

  return (
    <AdminShell locale={locale}>
      <section style={sectionStyle}>
        <SectionTitle story="ADMIN-018" title="Database manage" />
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          Active database: <strong>{databaseName}</strong>. Displaying all tables from this database.
          Each table shows total rows and a preview of up to {TABLE_PREVIEW_LIMIT} records.
        </p>
        <form method="GET" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="table" style={{ color: "var(--muted)", fontWeight: 600 }}>
            Select table
          </label>
          <select id="table" name="table" defaultValue={selectedTable ?? ""} style={{ ...inputStyle, maxWidth: 360 }}>
            <option value="">Select a table</option>
            {allTableNames.map((tableName) => (
              <option key={tableName} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
          <button type="submit" style={{ ...inputStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}>
            Display
          </button>
        </form>
      </section>

      <section style={{ ...sectionStyle, gap: 16 }}>
        {tableData.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {selectedTable
              ? `No rows found in selected table ${selectedTable}.`
              : `No table selected. Choose one table from the dropdown in database ${databaseName}.`}
          </p>
        ) : (
          tableData.map((table) => (
            <article key={table.tableName} style={{ ...surfaceCardStyle, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong style={{ fontSize: 18 }}>{table.tableName}</strong>
                <span style={{ color: "var(--muted)" }}>Rows: {table.totalRows}</span>
              </div>

              {table.previewRows.length === 0 ? (
                <p style={{ margin: 0, color: "var(--muted)" }}>This table has no rows.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                        {table.columns.map((column) => (
                          <th
                            key={column}
                            style={{
                              padding: "10px 8px",
                              borderBottom: "1px solid var(--border)",
                              fontSize: 12,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase"
                            }}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.previewRows.map((row, rowIndex) => (
                        <tr key={`${table.tableName}-${rowIndex}`} style={{ borderTop: "1px solid var(--border)" }}>
                          {table.columns.map((column) => (
                            <td
                              key={`${table.tableName}-${rowIndex}-${column}`}
                              style={{
                                padding: "10px 8px",
                                verticalAlign: "top",
                                fontSize: 13,
                                lineHeight: 1.45,
                                maxWidth: 320,
                                wordBreak: "break-word"
                              }}
                            >
                              {serializeValue(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </AdminShell>
  );
}
