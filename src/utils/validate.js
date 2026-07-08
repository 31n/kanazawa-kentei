/**
 * Expected schema — array of:
 * {
 *   id?: string,
 *   question: string,
 *   choices: [string, string, string, string],
 *   answer: 0 | 1 | 2 | 3,
 *   category?: string,
 *   explanation?: string
 * }
 */
export function validateQuizData(data) {
  const errors = [];

  if (!Array.isArray(data)) {
    return { valid: false, errors: ['ファイル全体が配列（[...]）である必要があります。'] };
  }

  if (data.length === 0) {
    return { valid: false, errors: ['問題が1件もありません。'] };
  }

  data.forEach((item, i) => {
    const pos = `${i + 1}問目`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${pos}: オブジェクトではありません。`);
      return;
    }
    if (typeof item.question !== 'string' || !item.question.trim()) {
      errors.push(`${pos}: question（問題文）が文字列で入力されていません。`);
    }
    if (!Array.isArray(item.choices) || item.choices.length !== 4) {
      errors.push(`${pos}: choices（選択肢）は4件の配列である必要があります。`);
    } else if (item.choices.some((c) => typeof c !== 'string' || !c.trim())) {
      errors.push(`${pos}: choicesの中に空、または文字列でない項目があります。`);
    }
    if (
      typeof item.answer !== 'number' ||
      !Number.isInteger(item.answer) ||
      item.answer < 0 ||
      item.answer > 3
    ) {
      errors.push(`${pos}: answer（正解）は0〜3の整数である必要があります。`);
    }
  });

  return { valid: errors.length === 0, errors: errors.slice(0, 8) };
}
