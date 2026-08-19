import { SKILL_DICTIONARY } from "../data/skills";
import { normalizeText } from "./textNormalizer";

/**
 * Returns the display labels of every skill from the dictionary that
 * appears in the given text. Matching is whole-word/phrase based on
 * normalized text, so "js" won't match inside "jsonify", for example.
 */
export function extractSkills(text: string): string[] {
  const normalized = ` ${normalizeText(text)} `;
  const found: string[] = [];

  for (const skill of SKILL_DICTIONARY) {
    const isPresent = skill.aliases.some((alias) => {
      const normalizedAlias = ` ${normalizeText(alias)} `;
      return normalized.includes(normalizedAlias);
    });
    if (isPresent) {
      found.push(skill.label);
    }
  }

  return found;
}
