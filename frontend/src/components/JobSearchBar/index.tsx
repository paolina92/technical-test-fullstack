import { Button } from "welcome-ui/Button";
import { Field } from "welcome-ui/Field";
import { InputText } from "welcome-ui/InputText";
import { Select } from "welcome-ui/Select";

import {
  ContractTypeSchema,
  WorkModeSchema,
  type JobFilters,
} from "../../schemas/job";

// Convert the Zod enum values into the { label, value } shape the welcome-ui Select expects. e.g. "FULL_TIME" -> { value: "FULL_TIME", label: "full time" }.
const CONTRACT_OPTIONS = ContractTypeSchema.options.map((value) => ({
  value,
  label: value.replace("_", " ").toLowerCase(),
}));

const WORK_MODE_OPTIONS = WorkModeSchema.options.map((value) => ({
  value,
  label: value,
}));

export type JobSearchBarProps = {
  filters: JobFilters;
  qInput: string;
  onQChange: (value: string) => void;
  setFilter: (key: keyof JobFilters, value: string | undefined) => void;
  clear: () => void;
};

export const JobSearchBar = ({
  filters,
  qInput,
  onQChange,
  setFilter,
  clear,
}: JobSearchBarProps) => {
  // True if at least one filter is set — used to disable the "Clear all" button when there is nothing to clear.
  const hasAnyFilter =
    !!qInput ||
    !!filters.location ||
    !!filters.contract_type ||
    !!filters.work_mode;

  return (
    <div className="flex flex-col lg:flex-row gap-md mb-lg lg:items-end">
      <Field className="flex-1 lg:flex-[2]" label="Search">
        <InputText
          type="search"
          placeholder="Search by title or description"
          value={qInput}
          onChange={(e) => onQChange(e.target.value)}
        />
      </Field>
      <Field className="flex-1" label="Location">
        <InputText
          placeholder="e.g. Paris"
          value={filters.location ?? ""}
          onChange={(e) => setFilter("location", e.target.value)}
        />
      </Field>
      <Field className="flex-1" label="Contract type">
        <Select
          options={CONTRACT_OPTIONS}
          value={filters.contract_type ?? ""}
          isClearable
          onChange={(value) =>
            setFilter("contract_type", (value as string) || undefined)
          }
        />
      </Field>
      <Field className="flex-1" label="Work mode">
        <Select
          options={WORK_MODE_OPTIONS}
          value={filters.work_mode ?? ""}
          isClearable
          onChange={(value) =>
            setFilter("work_mode", (value as string) || undefined)
          }
        />
      </Field>
      <Button
        variant="tertiary"
        onClick={clear}
        disabled={!hasAnyFilter}
      >
        Clear all
      </Button>
    </div>
  );
};
