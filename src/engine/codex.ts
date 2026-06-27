/**
 * Converts a regular string into an array of numbers representing ASCII codes.
 */
export function stringToAscii(payload: string): number[] {
  return payload.split('').map((char) => char.charCodeAt(0));
}

/**
 * Converts an array of ASCII codes into a string in a target base.
 * Useful for displaying the transmission format on different planets.
 */
export function asciiToBaseString(asciiArray: number[], targetBase: number): string[] {
  return asciiArray.map((code) => code.toString(targetBase));
}

/**
 * Full pipeline conversion for visualization:
 * "H" -> 72 (ASCII) -> "102" (Base 7)
 */
export function convertPayloadToCodex(payload: string, codex: number): { char: string; ascii: number; converted: string }[] {
  return payload.split('').map((char) => {
    const ascii = char.charCodeAt(0);
    return {
      char,
      ascii,
      converted: ascii.toString(codex),
    };
  });
}
