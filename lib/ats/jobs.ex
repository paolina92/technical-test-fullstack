defmodule Ats.Jobs do
  @moduledoc """
  The Jobs context.
  """

  import Ecto.Query, warn: false
  alias Ats.Repo

  alias Ats.Jobs.Job
  alias Ats.Professions.Profession

  @contract_types %{
    FULL_TIME: "Full-Time",
    PART_TIME: "Part-Time",
    TEMPORARY: "Temporary",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship"
  }

  @doc """
  Returns a job contract type.

  ## Examples

      iex> contract_type(%Job{contract_type: "FULL_TIME"})
      "Full-Time"

  """
  @spec contract_type(%Job{}) :: binary() | nil
  def contract_type(job) do
    @contract_types[job.contract_type]
  end

  @doc """
  Returns a job profession name.

  ## Examples

      iex> profession_name(%Job{profession: %Profession{name: "Software Engineer"}})
      "Software Engineer"
  """
  @spec profession_name(%Job{}) :: binary()
  def profession_name(%Job{profession: %Profession{name: profession_name}}) do
    profession_name
  end

  def profession_name(_job), do: ""

  @contract_type_values [:FULL_TIME, :PART_TIME, :TEMPORARY, :FREELANCE, :INTERNSHIP, :APPRENTICESHIP, :VIE]
  @work_mode_values [:onsite, :remote, :hybrid]

  @doc """
  Returns the list of jobs, optionally filtered.

  Accepted filter keys (all optional, all combinable as AND):
  - `"q"` — case-insensitive substring search on `title` OR `description`
  - `"location"` — case-insensitive match on `office`
  - `"contract_type"` — exact match (FULL_TIME, PART_TIME, ...)
  - `"work_mode"` — exact match (onsite, remote, hybrid)

  Invalid enum values for `contract_type` / `work_mode` are silently ignored
  (filter not applied) so a malformed query still returns results rather
  than 4xx — keeps the public API forgiving.

  ## Examples

      iex> list_jobs()
      [%Job{}, ...]

      iex> list_jobs(%{"q" => "react", "work_mode" => "remote"})
      [%Job{}, ...]
  """
  @spec list_jobs(map()) :: [%Job{}]
  def list_jobs(filters \\ %{}) do
    Job
    |> apply_filters(filters)
    |> Repo.all()
    |> Repo.preload(:profession)
  end

  defp apply_filters(query, filters) when is_map(filters) do
    Enum.reduce(filters, query, &apply_filter/2)
  end

  defp apply_filter({"q", q}, query) when is_binary(q) and q != "" do
    pattern = "%" <> escape_like(q) <> "%"
    from(j in query, where: ilike(j.title, ^pattern) or ilike(j.description, ^pattern))
  end

  defp apply_filter({"location", location}, query) when is_binary(location) and location != "" do
    from(j in query, where: ilike(j.office, ^location))
  end

  defp apply_filter({"contract_type", value}, query) when is_binary(value) do
    case enum_value(value, @contract_type_values) do
      nil -> query
      atom -> from(j in query, where: j.contract_type == ^atom)
    end
  end

  defp apply_filter({"work_mode", value}, query) when is_binary(value) do
    case enum_value(value, @work_mode_values) do
      nil -> query
      atom -> from(j in query, where: j.work_mode == ^atom)
    end
  end

  defp apply_filter(_, query), do: query

  # Avoid `String.to_atom/1` (memory leak risk on user-controlled input)
  defp enum_value(value, allowed) do
    Enum.find(allowed, fn atom -> Atom.to_string(atom) == value end)
  end

  # Escape % and _ so user input can't act as wildcards
  defp escape_like(string) do
    string
    |> String.replace("\\", "\\\\")
    |> String.replace("%", "\\%")
    |> String.replace("_", "\\_")
  end

  @doc """
  Gets a single job.

  Raises `Ecto.NoResultsError` if the Job does not exist.

  ## Examples

      iex> get_job!(123)
      %Job{}

      iex> get_job!(456)
      ** (Ecto.NoResultsError)

  """
  @spec get_job!(integer() | binary()) :: %Job{}
  def get_job!(id), do: Repo.get!(Job, id) |> Repo.preload(applicants: [:candidate])

  @doc """
  Creates a job.

  ## Examples

      iex> create_job(%{field: value})
      {:ok, %Job{}}

      iex> create_job(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_job(map()) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def create_job(attrs \\ %{}) do
    %Job{}
    |> Job.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a job.

  ## Examples

      iex> update_job(job, %{field: new_value})
      {:ok, %Job{}}

      iex> update_job(job, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_job(%Job{}, map()) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def update_job(%Job{} = job, attrs) do
    job
    |> Job.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a job.

  ## Examples

      iex> delete_job(job)
      {:ok, %Job{}}

      iex> delete_job(job)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_job(%Job{}) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def delete_job(%Job{} = job) do
    Repo.delete(job)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking job changes.

  ## Examples

      iex> change_job(job)
      %Ecto.Changeset{data: %Job{}}

  """
  @spec change_job(%Job{}, map()) :: Ecto.Changeset.t()
  def change_job(%Job{} = job, attrs \\ %{}) do
    Job.changeset(job, attrs)
  end
end
