export interface TableSchema {
  tableName: string;
  description: string;
  primaryKey: string;
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
  relationships?: string[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  description?: string;
}

export interface ForeignKeyInfo {
  column: string;
  references: string;
  description: string;
}

export const VISIT_TABLES_SCHEMA: Record<string, TableSchema> = {
  patients: {
    tableName: 'patients',
    description: 'Patient master table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'phone', type: 'VARCHAR', nullable: true, description: 'Phone number' },
      { name: 'mr_number', type: 'VARCHAR', nullable: true, description: 'Medical record number' },
      { name: 'address', type: 'VARCHAR(400)', nullable: true, description: 'Patient address' },
      { name: 'gender', type: 'INTEGER', nullable: true, description: 'Gender (0/1)' },
      { name: 'patient_type', type: 'VARCHAR', nullable: true, description: 'Type of patient' },
      { name: 'medical_history', type: 'TEXT', nullable: true, description: 'Medical history' },
      { name: 'insurance_name', type: 'VARCHAR', nullable: true, description: 'Insurance name' },
      { name: 'insurance_id', type: 'VARCHAR', nullable: true, description: 'Insurance ID' },
      { name: 'is_active', type: 'BOOLEAN', nullable: true, description: 'Active status' },
      { name: 'card_no', type: 'VARCHAR', nullable: true, description: 'Card number' },
      { name: 'dob', type: 'VARCHAR', nullable: true, description: 'Date of birth' },
      { name: 'nationality', type: 'VARCHAR', nullable: true, description: 'Nationality' },
      { name: 'national_id', type: 'VARCHAR', nullable: true, description: 'National ID' },
      { name: 'blood_group', type: 'VARCHAR', nullable: true, description: 'Blood group' },
      { name: 'city', type: 'VARCHAR', nullable: true, description: 'City' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
      { name: 'user_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
    ],
    foreignKeys: [
      { column: 'user_id', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
  },
  patient_visits: {
    tableName: 'patient_visits',
    description: 'Patient visit table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'doctor_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to doctors.uuid' },
      { name: 'type', type: 'VARCHAR', nullable: true, description: 'Visit type' },
      { name: 'status', type: 'VARCHAR', nullable: true, description: 'Visit status' },
      { name: 'mr_number', type: 'VARCHAR', nullable: true, description: 'Medical record number for visit' },
      { name: 'date_time', type: 'VARCHAR', nullable: true, description: 'Visit date and time' },
      { name: 'note', type: 'TEXT', nullable: true, description: 'Visit notes' },
      { name: 'consultation_department', type: 'VARCHAR', nullable: true, description: 'Consultation department' },
      { name: 'consultation_doctor', type: 'VARCHAR', nullable: true, description: 'Consultation doctor' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patient master' },
      { column: 'doctor_id', references: 'doctors.uuid', description: 'Links to doctors' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: ['patient_id → patients.uuid'],
  },
  visit_examinations: {
    tableName: 'visit_examinations',
    description: 'Examination table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to patients.uuid' },
      { name: 'patient_visit_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to patient_visits.uuid (one per visit)' },
      { name: 'confidential_statement', type: 'TEXT', nullable: true, description: 'Confidential statement' },
      { name: 'present_complaints', type: 'TEXT', nullable: true, description: 'Present complaints' },
      { name: 'chief_complaint', type: 'JSONB', nullable: true, description: 'Chief complaint (JSON array)' },
      { name: 'significant_signs', type: 'TEXT', nullable: true, description: 'Significant signs' },
      { name: 'review_of_systems', type: 'JSONB', nullable: true, description: 'Review of systems (JSON array)' },
      { name: 'clinical_examination', type: 'JSONB', nullable: true, description: 'Clinical examination (JSON array)' },
      { name: 'examination_notes', type: 'TEXT', nullable: true, description: 'Examination notes' },
      { name: 'progress_notes', type: 'TEXT', nullable: true, description: 'Progress notes' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patient_visit_id', references: 'patient_visits.uuid', description: 'Links to visit' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patient_visit_id → patient_visits.uuid',
    ],
  },
  visit_diagnoses: {
    tableName: 'visit_diagnoses',
    description: 'Diagnosis table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'patient_visit_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patient_visits.uuid' },
      { name: 'provisional_diagnosis', type: 'JSONB', nullable: true, description: 'Provisional diagnosis (JSON array)' },
      { name: 'final_diagnosis', type: 'JSONB', nullable: true, description: 'Final diagnosis (JSON array)' },
      { name: 'management_plan', type: 'VARCHAR', nullable: true, description: 'Management plan' },
      { name: 'medications', type: 'JSONB', nullable: true, description: 'Medications (JSON array)' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patient_visit_id', references: 'patient_visits.uuid', description: 'Links to visit' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patient_visit_id → patient_visits.uuid',
    ],
  },
  visit_invest_treatments: {
    tableName: 'visit_invest_treatments',
    description: 'Investigation/Treatment table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'patient_visit_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patient_visits.uuid' },
      { name: 'package', type: 'JSONB', nullable: true, description: 'Package (JSON array)' },
      { name: 'laboratory', type: 'JSONB', nullable: true, description: 'Laboratory investigations (JSON array)' },
      { name: 'investigations', type: 'VARCHAR', nullable: true, description: 'Investigations text' },
      { name: 'x_ray', type: 'VARCHAR', nullable: true, description: 'X-Ray details' },
      { name: 'ecg', type: 'VARCHAR', nullable: true, description: 'ECG details' },
      { name: 'referral_investigations', type: 'JSONB', nullable: true, description: 'Referral investigations (JSON array)' },
      { name: 'procedure_treatments', type: 'JSONB', nullable: true, description: 'Procedure treatments (JSON array)' },
      { name: 'procedure_from_billing', type: 'VARCHAR', nullable: true, description: 'Procedure from billing' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patient_visit_id', references: 'patient_visits.uuid', description: 'Links to visit' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patient_visit_id → patient_visits.uuid',
    ],
  },
  visit_management_plans: {
    tableName: 'visit_management_plans',
    description: 'Management plan table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'patient_visit_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patient_visits.uuid' },
      { name: 'package', type: 'JSONB', nullable: true, description: 'Package (JSON array)' },
      { name: 'laboratory', type: 'JSONB', nullable: true, description: 'Laboratory (JSON array)' },
      { name: 'investigations', type: 'VARCHAR', nullable: true, description: 'Investigations' },
      { name: 'x_ray', type: 'VARCHAR', nullable: true, description: 'X-Ray' },
      { name: 'ecg', type: 'VARCHAR', nullable: true, description: 'ECG' },
      { name: 'medications', type: 'JSONB', nullable: true, description: 'Medications (JSON array)' },
      { name: 'management_plan', type: 'VARCHAR', nullable: true, description: 'Management plan text' },
      { name: 'advice', type: 'VARCHAR', nullable: true, description: 'Advice' },
      { name: 'procedure_treatments', type: 'JSONB', nullable: true, description: 'Procedure treatments (JSON array)' },
      { name: 'procedure_notes', type: 'VARCHAR', nullable: true, description: 'Procedure notes' },
      { name: 'others', type: 'VARCHAR', nullable: true, description: 'Other notes' },
      { name: 'follow_up_plan', type: 'JSONB', nullable: true, description: 'Follow-up plan (JSON array)' },
      { name: 'progress_notes', type: 'VARCHAR', nullable: true, description: 'Progress notes' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patient_visit_id', references: 'patient_visits.uuid', description: 'Links to visit' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patient_visit_id → patient_visits.uuid',
    ],
  },
  visit_followups: {
    tableName: 'visit_followups',
    description: 'Follow-up table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'patient_visit_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patient_visits.uuid' },
      { name: 'treatment_plan', type: 'TEXT', nullable: true, description: 'Treatment plan' },
      { name: 'follow_up_plan', type: 'JSONB', nullable: true, description: 'Follow-up plan (JSON array)' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patient_visit_id', references: 'patient_visits.uuid', description: 'Links to visit' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patient_visit_id → patient_visits.uuid',
    ],
  },
  nurse_sheets: {
    tableName: 'nurse_sheets',
    description: 'Nurse sheet table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to patients.uuid' },
      { name: 'patientvisit_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to patient_visits.uuid (note: different column name - no underscore)' },
      { name: 'doctor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to doctors.uuid' },
      { name: 'nurse_notes', type: 'TEXT', nullable: true, description: 'Nurse notes' },
      { name: 'vital', type: 'JSONB', nullable: true, description: 'Vital signs (JSON object)' },
      { name: 'pain', type: 'JSONB', nullable: true, description: 'Pain assessment (JSON object)' },
      { name: 'allergy', type: 'JSONB', nullable: true, description: 'Allergy information (JSON object)' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'patientvisit_id', references: 'patient_visits.uuid', description: 'Links to visit (note: column name is patientvisit_id, not patient_visit_id)' },
      { column: 'doctor_id', references: 'doctors.uuid', description: 'Links to doctors' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
      'patientvisit_id → patient_visits.uuid (note: no underscore)',
    ],
  },
  patient_histories: {
    tableName: 'patient_histories',
    description: 'Patient history table',
    primaryKey: 'uuid',
    columns: [
      { name: 'uuid', type: 'VARCHAR(255)', nullable: false, description: 'Primary key, unique identifier' },
      { name: 'id', type: 'INTEGER', nullable: false, description: 'Auto-increment ID' },
      { name: 'patient_id', type: 'VARCHAR(255)', nullable: false, description: 'Foreign key to patients.uuid' },
      { name: 'sensitive_allergy', type: 'JSONB', nullable: true, description: 'Sensitive allergy (JSON object)' },
      { name: 'past_medical_history', type: 'TEXT', nullable: true, description: 'Past medical history' },
      { name: 'past_surgical_history', type: 'TEXT', nullable: true, description: 'Past surgical history' },
      { name: 'family_history', type: 'JSONB', nullable: true, description: 'Family history (JSON object)' },
      { name: 'social_history', type: 'JSONB', nullable: true, description: 'Social history (JSON object)' },
      { name: 'present_pregnancy_history', type: 'JSONB', nullable: true, description: 'Present pregnancy history (JSON object)' },
      { name: 'medication_history', type: 'JSONB', nullable: true, description: 'Medication history (JSON object)' },
      { name: 'medical_alert', type: 'VARCHAR', nullable: true, description: 'Medical alert' },
      { name: 'clinic_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to clinics.uuid' },
      { name: 'vendor_id', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors.uuid' },
      { name: 'created_by', type: 'VARCHAR(255)', nullable: true, description: 'Foreign key to vendors_users.uuid' },
      { name: 'updated_by', type: 'VARCHAR(255)', nullable: true, description: 'Updated by user UUID' },
      { name: 'deleted_by', type: 'VARCHAR(255)', nullable: true, description: 'Deleted by user UUID' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, description: 'Update timestamp' },
      { name: 'deleted_at', type: 'TIMESTAMP', nullable: true, description: 'Soft delete timestamp' },
    ],
    foreignKeys: [
      { column: 'patient_id', references: 'patients.uuid', description: 'Links to patients' },
      { column: 'clinic_id', references: 'clinics.uuid', description: 'Links to clinics' },
      { column: 'vendor_id', references: 'vendors.uuid', description: 'Links to vendors' },
      { column: 'created_by', references: 'vendors_users.uuid', description: 'Links to vendors_users' },
    ],
    relationships: [
      'patient_id → patients.uuid',
    ],
  },
};

export function getTableSchema(tableName: string): TableSchema | undefined {
  return VISIT_TABLES_SCHEMA[tableName];
}

export function getAllTableNames(): string[] {
  return Object.keys(VISIT_TABLES_SCHEMA);
}

export function getTableColumns(tableName: string): string[] {
  const schema = getTableSchema(tableName);
  return schema ? schema.columns.map(col => col.name) : [];
}

export function getSchemaSummary(): string {
  const tables = Object.values(VISIT_TABLES_SCHEMA);
  return tables.map(table => {
    const columns = table.columns.map(col => col.name).join(', ');
    const relationships = table.relationships ? `\nRelationships: ${table.relationships.join(', ')}` : '';
    return `${table.tableName}: ${columns}${relationships}`;
  }).join('\n\n');
}

export function getFormattedSchemaForTool(): string {
  const tables = Object.values(VISIT_TABLES_SCHEMA);
  return tables.map(table => {
    const mainColumns = table.columns
      .filter(col => !['id', 'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by', 'deleted_by', 'clinic_id', 'vendor_id', 'user_id'].includes(col.name))
      .map(col => col.name)
      .join(', ');
    const relationships = table.relationships ? ` Relationships: ${table.relationships.join(', ')}` : '';
    return `${table.tableName} (${table.description}): ${mainColumns}${relationships}`;
  }).join('\n');
}

