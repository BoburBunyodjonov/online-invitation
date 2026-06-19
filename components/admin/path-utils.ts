/* Tiny immutable get/set helpers for editing nested form state by path. */

export type Path = (string | number)[];

export function getByPath(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string | number, unknown>)[key];
  }, obj);
}

export function setByPath<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const clone = (
    Array.isArray(obj)
      ? [...(obj as unknown[])]
      : { ...(obj as Record<string, unknown>) }
  ) as unknown as Record<string | number, unknown>;
  const child = clone[head] ?? (typeof rest[0] === "number" ? [] : {});
  clone[head] = rest.length ? setByPath(child, rest, value) : value;
  return clone as T;
}
