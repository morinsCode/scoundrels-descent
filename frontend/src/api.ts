export interface DbStatus {
  status: string;
  now: string;
}

export async function fetchDbStatus(): Promise<DbStatus> {
  const response = await fetch("/api/db-test");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json();
}
