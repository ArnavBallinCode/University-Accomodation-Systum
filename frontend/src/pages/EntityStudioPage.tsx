import { motion } from "framer-motion";
import { LoaderCircle, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useToast } from "../components/ToastProvider";
import { ENTITIES } from "../config/entities";
import { apiDelete, apiGet, apiPost, apiPut } from "../lib/api";
import { titleCase } from "../lib/utils";
import { useAuth } from "../providers/AuthProvider";
import type { DataRow, EntityDefinition, FieldDefinition } from "../types";

type FormValue = string | boolean;
type FormState = Record<string, FormValue>;

function buildInitialForm(entity: EntityDefinition): FormState {
  return Object.fromEntries(
    entity.fields.map((field) => [field.key, field.type === "boolean" ? false : ""])
  ) as FormState;
}

function toInputValue(field: FieldDefinition, value: unknown): FormValue {
  if (field.type === "boolean") {
    return Boolean(value);
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (field.type === "date" && typeof value === "string") {
    return value.slice(0, 10);
  }

  return String(value);
}

function toPayloadValue(field: FieldDefinition, value: FormValue): unknown {
  if (field.type === "boolean") {
    return Boolean(value);
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "";
  }

  if (field.type === "number") {
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : parsed;
  }

  return trimmed;
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

export function EntityStudioPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [entityKey, setEntityKey] = useState<string>(() => {
    const param = searchParams.get("entity");
    return ENTITIES.some((e) => e.key === param) ? (param as string) : ENTITIES[0].key;
  });
  useEffect(() => {
    const param = searchParams.get("entity");
    const nextKey = ENTITIES.some((e) => e.key === param)
      ? (param as string)
      : ENTITIES[0].key;
    setEntityKey((prev) => (prev === nextKey ? prev : nextKey));
  }, [searchParams]);
  const [records, setRecords] = useState<DataRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataRow | null>(null);
  const [form, setForm] = useState<FormState>(() => buildInitialForm(ENTITIES[0]));
  const { pushToast } = useToast();
  const { canWrite, canDelete, user } = useAuth();

  const activeEntity = useMemo(
    () => ENTITIES.find((entry) => entry.key === entityKey) ?? ENTITIES[0],
    [entityKey]
  );

  const columns = useMemo(() => {
    const ordered = [activeEntity.idKey, ...activeEntity.fields.map((field) => field.key)];
    const extras = new Set<string>();

    records.forEach((record) => {
      Object.keys(record).forEach((key) => {
        if (!ordered.includes(key)) {
          extras.add(key);
        }
      });
    });

    return [...ordered, ...Array.from(extras)];
  }, [activeEntity, records]);

  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return records;
    }

    return records.filter((record) =>
      Object.values(record).some((value) => formatCellValue(value).toLowerCase().includes(needle))
    );
  }, [query, records]);

  const fetchRecords = async (entity: EntityDefinition): Promise<void> => {
    setLoading(true);
    try {
      const rows = await apiGet<DataRow[]>(entity.endpoint);
      setRecords(rows);
    } catch {
      pushToast({
        tone: "error",
        title: "Data load failed",
        description: `Could not load records for ${entity.label}.`
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(buildInitialForm(activeEntity));
    setEditingRecord(null);
    setQuery("");
    void fetchRecords(activeEntity);
  }, [activeEntity]);

  const handleInputChange = (field: FieldDefinition, value: FormValue): void => {
    setForm((current) => ({ ...current, [field.key]: value }));
  };

  const resetForm = (): void => {
    setEditingRecord(null);
    setForm(buildInitialForm(activeEntity));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canWrite) {
      pushToast({
        tone: "error",
        title: "Read-only role",
        description: "Viewer accounts cannot create or update records."
      });
      return;
    }

    const payload: Record<string, unknown> = {};

    for (const field of activeEntity.fields) {
      const value = form[field.key];
      if (field.required && field.type !== "boolean") {
        if (typeof value === "string" && value.trim().length === 0) {
          pushToast({
            tone: "error",
            title: "Required field missing",
            description: `${field.label} is required.`
          });
          return;
        }
      }

      payload[field.key] = toPayloadValue(field, value);
    }

    setSaving(true);
    try {
      if (editingRecord) {
        const recordId = editingRecord[activeEntity.idKey];
        await apiPut(`${activeEntity.endpoint}/${encodeURIComponent(String(recordId))}`, payload);
        pushToast({
          tone: "success",
          title: "Record updated",
          description: `${activeEntity.label} record updated successfully.`
        });
      } else {
        await apiPost(activeEntity.endpoint, payload);
        pushToast({
          tone: "success",
          title: "Record created",
          description: `New ${activeEntity.label.toLowerCase()} record created.`
        });
      }

      resetForm();
      await fetchRecords(activeEntity);
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unexpected API failure."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record: DataRow): void => {
    if (!canWrite) {
      pushToast({
        tone: "error",
        title: "Read-only role",
        description: "Viewer accounts cannot edit records."
      });
      return;
    }

    const nextForm = buildInitialForm(activeEntity);

    activeEntity.fields.forEach((field) => {
      nextForm[field.key] = toInputValue(field, record[field.key]);
    });

    setEditingRecord(record);
    setForm(nextForm);
  };

  const handleDelete = async (record: DataRow): Promise<void> => {
    if (!canDelete) {
      pushToast({
        tone: "error",
        title: "Permission denied",
        description: "Only admin accounts can delete records."
      });
      return;
    }

    const recordId = record[activeEntity.idKey];
    if (!window.confirm(`Delete ${activeEntity.label} record ${String(recordId)}?`)) {
      return;
    }

    try {
      await apiDelete(`${activeEntity.endpoint}/${encodeURIComponent(String(recordId))}`);
      pushToast({
        tone: "success",
        title: "Record deleted",
        description: `${activeEntity.label} record ${String(recordId)} was removed.`
      });
      await fetchRecords(activeEntity);
    } catch (error) {
      pushToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unexpected API failure."
      });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Form Panel (compact, full-width on top) ── */}
      <section className="glass-panel p-5 md:p-6">
        {/* Header row: title + module selector + refresh */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-orange-600">Entity Forge</p>
              <h2 className="font-heading text-xl font-black text-slate-900 md:text-2xl">Dynamic CRUD cockpit</h2>
            </div>

            <select
              value={entityKey}
              onChange={(event) => setEntityKey(event.target.value)}
              className="rounded-2xl border border-white/80 bg-white/80 px-3 py-2 text-sm font-bold text-slate-800 outline-none ring-orange-300 transition focus:ring"
            >
              {ENTITIES.map((entity) => (
                <option key={entity.key} value={entity.key}>
                  {entity.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-2xl border border-white/80 bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-600 sm:inline-block">
              {user?.role ?? "viewer"} | {canWrite ? "Write" : "Read-only"}
              {canDelete ? " | Delete" : ""}
            </span>
            <button
              type="button"
              onClick={() => {
                void fetchRecords(activeEntity);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-900"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-600">{activeEntity.description}</p>

        {/* Fields grid — responsive columns */}
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {activeEntity.fields.map((field) => {
            const value = form[field.key];
            const disabled = !canWrite || (Boolean(editingRecord) && field.key === activeEntity.idKey);

            return (
              <label key={field.key} className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  {field.label}
                  {field.required ? " *" : ""}
                </span>

                {field.type === "textarea" ? (
                  <textarea
                    value={typeof value === "string" ? value : ""}
                    disabled={disabled}
                    onChange={(event) => handleInputChange(field, event.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none ring-orange-300 transition focus:ring"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={typeof value === "string" ? value : ""}
                    disabled={disabled}
                    onChange={(event) => handleInputChange(field, event.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none ring-orange-300 transition focus:ring"
                  >
                    <option value="">Select...</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <div className="flex items-center justify-between rounded-xl border border-white/80 bg-white/80 px-3 py-2">
                    <span className="text-sm text-slate-700">{Boolean(value) ? "True" : "False"}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      disabled={disabled}
                      onChange={(event) => handleInputChange(field, event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={typeof value === "string" ? value : ""}
                    disabled={disabled}
                    onChange={(event) => handleInputChange(field, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none ring-orange-300 transition focus:ring"
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving || !canWrite}
            onClick={() => {
              void handleSubmit();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-heading text-xs font-black uppercase tracking-[0.15em] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingRecord ? "Save changes" : "Create record"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-slate-300 bg-white/75 px-4 py-2 font-heading text-xs font-black uppercase tracking-[0.14em] text-slate-700"
          >
            Reset form
          </button>
        </div>
      </section>


      <section className="glass-panel p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Data stream</p>
            <h3 className="font-heading text-2xl font-black text-slate-900">{activeEntity.label} records</h3>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter records..."
            className="w-full rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm text-slate-800 outline-none ring-cyan-300 transition focus:ring md:w-64"
          />
        </div>

        <div className="table-shell overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-white/70">
                {columns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-3 py-2 font-heading text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {titleCase(column)}
                  </th>
                ))}
                <th className="px-3 py-2 font-heading text-xs font-black uppercase tracking-[0.14em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-sm text-slate-500">
                    Fetching records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-sm text-slate-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, rowIndex) => (
                  <motion.tr
                    key={`${String(record[activeEntity.idKey])}-${rowIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className="border-b border-white/60"
                  >
                    {columns.map((column) => (
                      <td key={`${String(record[activeEntity.idKey])}-${column}`} className="px-3 py-2 align-top">
                        {formatCellValue(record[column])}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={!canWrite}
                          onClick={() => handleEdit(record)}
                          className="inline-flex items-center gap-1 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-900 disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={!canDelete}
                          onClick={() => {
                            void handleDelete(record);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-rose-900 disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
