import { motion } from "framer-motion";
import { Play, Radar } from "lucide-react";
import { useMemo, useState } from "react";

import { useToast } from "../components/ToastProvider";
import { REPORTS } from "../config/reports";
import { apiGet } from "../lib/api";
import { titleCase } from "../lib/utils";
import type { DataRow, ReportDefinition } from "../types";

type ParamState = Record<string, Record<string, string>>;

function normalizeRows(payload: unknown): DataRow[] {
  if (Array.isArray(payload)) {
    return payload as DataRow[];
  }

  if (payload && typeof payload === "object") {
    return [payload as DataRow];
  }

  return [];
}

function buildEndpoint(report: ReportDefinition, params: Record<string, string>): string | null {
  let endpoint = report.endpoint;
  const search = new URLSearchParams();

  for (const parameter of report.parameters ?? []) {
    const value = (params[parameter.key] ?? "").trim();

    if (parameter.required && !value) {
      return null;
    }

    if (!value) {
      continue;
    }

    if (parameter.in === "path") {
      endpoint = endpoint.replace(`:${parameter.key}`, encodeURIComponent(value));
    } else {
      search.set(parameter.key, value);
    }
  }

  if (endpoint.includes(":")) {
    return null;
  }

  const query = search.toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

export function ReportsPage(): JSX.Element {
  const [paramState, setParamState] = useState<ParamState>({});
  const [activeReportId, setActiveReportId] = useState<string>(REPORTS[0].id);
  const [rows, setRows] = useState<DataRow[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);
  const { pushToast } = useToast();

  const activeReport = useMemo(
    () => REPORTS.find((report) => report.id === activeReportId) ?? REPORTS[0],
    [activeReportId]
  );

  const columns = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((row) => Object.keys(row).forEach((key) => set.add(key)));
    return Array.from(set);
  }, [rows]);

  const handleParamChange = (reportId: string, key: string, value: string): void => {
    setParamState((current) => ({
      ...current,
      [reportId]: {
        ...(current[reportId] ?? {}),
        [key]: value
      }
    }));
  };

  const runReport = async (report: ReportDefinition): Promise<void> => {
    const params = paramState[report.id] ?? {};
    const endpoint = buildEndpoint(report, params);
    if (!endpoint) {
      pushToast({
        tone: "error",
        title: "Missing report parameters",
        description: "Please complete all required report inputs."
      });
      return;
    }

    setRunningId(report.id);
    try {
      const payload = await apiGet<unknown>(endpoint);
      setRows(normalizeRows(payload));
      setActiveReportId(report.id);
      pushToast({
        tone: "success",
        title: `Report ${report.id.toUpperCase()} complete`,
        description: `${report.title} ran successfully.`
      });
    } catch (error) {
      pushToast({
        tone: "error",
        title: `Report ${report.id.toUpperCase()} failed`,
        description: error instanceof Error ? error.message : "Unexpected API failure."
      });
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="grid gap-6 pb-8 xl:grid-cols-[1fr_1.35fr]">
      <section className="glass-panel p-5 md:p-6">
        <div className="mb-5">
          <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Report Reactor</p>
          <h2 className="font-heading text-2xl font-black text-slate-900">Assignment reports (a-n)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Trigger any required report endpoint with on-card parameter controls and instant table rendering.
          </p>
        </div>

        <div className="space-y-3">
          {REPORTS.map((report, index) => {
            const params = paramState[report.id] ?? {};
            const isActive = report.id === activeReport.id;

            return (
              <motion.article
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl border border-white/80 bg-white/75 p-4"
              >
                <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${report.accent}`} />
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-xs font-black uppercase tracking-[0.16em] text-slate-500">({report.id}) {report.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{report.description}</p>
                  </div>
                  {isActive && (
                    <span className="rounded-full border border-cyan-300 bg-cyan-100 px-2 py-1 text-xs font-bold uppercase tracking-[0.1em] text-cyan-700">
                      Active
                    </span>
                  )}
                </div>

                {(report.parameters ?? []).length > 0 && (
                  <div className="mb-3 grid gap-2 md:grid-cols-2">
                    {report.parameters?.map((parameter) => (
                      <label key={`${report.id}-${parameter.key}`} className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          {parameter.label}
                          {parameter.required ? " *" : ""}
                        </span>
                        <input
                          type={parameter.type}
                          value={params[parameter.key] ?? ""}
                          onChange={(event) => handleParamChange(report.id, parameter.key, event.target.value)}
                          placeholder={parameter.placeholder}
                          className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-300 transition focus:ring"
                        />
                      </label>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    void runReport(report);
                  }}
                  disabled={runningId === report.id}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-heading text-xs font-black uppercase tracking-[0.14em] text-white shadow-glow disabled:opacity-60"
                >
                  <Play className="h-4 w-4" />
                  {runningId === report.id ? "Running..." : "Run report"}
                </button>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="glass-panel p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-orange-600">Result Surface</p>
            <h3 className="font-heading text-2xl font-black text-slate-900">{activeReport.title}</h3>
          </div>
          <div className="rounded-full border border-orange-300 bg-orange-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-700">
            <span className="inline-flex items-center gap-2">
              <Radar className="h-4 w-4" />
              {rows.length} rows
            </span>
          </div>
        </div>

        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-white/70">
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2 font-heading text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {titleCase(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(columns.length, 1)} className="px-3 py-8 text-center text-slate-500">
                    Run a report to view results here.
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr key={`${rowIndex}-${activeReport.id}`} className="border-b border-white/60">
                    {columns.map((column) => (
                      <td key={`${rowIndex}-${column}`} className="px-3 py-2 align-top">
                        {row[column] === null || row[column] === undefined || row[column] === ""
                          ? "-"
                          : String(row[column])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
