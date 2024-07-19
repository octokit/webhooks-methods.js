export function toNormalizedJsonString(payload: object) {
  // GitHub sends its JSON with no indentation and no line breaks at the end
  const payloadString = JSON.stringify(payload);
  return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
    return s.substr(0, 3) + s.substr(3).toUpperCase();
  });
}
