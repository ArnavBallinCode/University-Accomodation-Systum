export type Primitive = string | number | boolean | null;
export type DataRow = Record<string, Primitive>;

export type FieldType = "text" | "email" | "number" | "date" | "textarea" | "select" | "boolean";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  nullable?: boolean;
  options?: SelectOption[];
}

export interface EntityDefinition {
  key: string;
  label: string;
  endpoint: string;
  idKey: string;
  autoId?: boolean;
  description: string;
  accent: string;
  fields: FieldDefinition[];
}

export interface ReportParameter {
  key: string;
  label: string;
  in: "path" | "query";
  type: "text" | "number" | "date";
  required?: boolean;
  placeholder?: string;
}

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  method: "GET";
  accent: string;
  parameters?: ReportParameter[];
}
