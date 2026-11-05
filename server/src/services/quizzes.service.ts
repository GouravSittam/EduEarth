type QuizAnswerInput = { questionId: string; answer: string };
type QuizQuestionInput = {
  id: string;
  correctAnswer: string;
  points: number;
};

/** Compare answers leniently: case, surrounding and repeated whitespace don't matter. */
export const normalizeAnswer = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

/** Keep only well-formed `{ questionId, answer }` entries from untrusted input. */
export const sanitizeAnswers = (input: unknown): QuizAnswerInput[] => {
  if (!Array.isArray(input)) return [];

  return input.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { questionId, answer } = item as Record<string, unknown>;
    if (typeof questionId !== "string" || answer === undefined || answer === null) {
      return [];
    }
    return [{ questionId, answer: String(answer).slice(0, 1000) }];
  });
};

export const quizzesService = {
  evaluateAttempt(
    questions: QuizQuestionInput[],
    answers: QuizAnswerInput[],
    passingScore: number,
  ) {
    const answerMap = new Map<string, string>(
      answers.map((item) => [item.questionId, item.answer]),
    );

    let totalPoints = 0;
    let earnedPoints = 0;
    const questionAnswers = questions.map((question) => {
      totalPoints += question.points;
      const answer = answerMap.get(question.id) ?? "";
      const isCorrect =
        answer.length > 0 &&
        normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);
      if (isCorrect) {
        earnedPoints += question.points;
      }
      return {
        questionId: question.id,
        answer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      };
    });

    const score =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return {
      score,
      isPassed: totalPoints > 0 && score >= passingScore,
      totalPoints,
      questionAnswers,
    };
  },
};
