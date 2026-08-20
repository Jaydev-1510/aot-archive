export function getEntityRoute(type: string, id: string): string {
  switch (type) {
    case "person":
      return `/people/${id}`;
    case "titan":
      return `/titans/${id}`;
    case "event":
      return `/events/${id}`;
    case "location":
      return `/locations/${id}`;
    case "faction":
      return `/factions/${id}`;
    case "family":
      return `/families/${id}`;
    case "object":
      return `/objects/${id}`;
    case "ability":
      return `/abilities/${id}`;
    default:
      return `/${type}s/${id}`;
  }
}
