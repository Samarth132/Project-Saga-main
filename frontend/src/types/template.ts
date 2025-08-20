export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date';
  defaultValue?: string;
}

export interface Template {
  _id: string;
  name: string;
  fields: TemplateField[];
  projectId: string;
}

export type NewTemplate = Omit<Template, '_id' | 'projectId'>;
export type UpdateTemplate = Partial<NewTemplate>;