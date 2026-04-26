type QuizAnswerInput = { questionId: string; answer: string };
type QuizQuestionInput = {
  id: string;
  correctAnswer: string;
  points: number;
};

export const quizzesService = {
  evaluateAttempt(
    questions: QuizQuestionInput[],
    answers: QuizAnswerInput[],
    passingScore: number,
  ) {
    const answerMap = new Map<string, string>(
      answers.map((item) => [String(item.questionId), String(item.answer)]),
    );

    let totalPoints = 0;
    let earnedPoints = 0;
    const questionAnswers = questions.map((question) => {
      totalPoints += question.points;
      const answer = answerMap.get(question.id) ?? "";
      const isCorrect = answer === question.correctAnswer;
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
      isPassed: score >= passingScore,
      totalPoints,
      questionAnswers,
    };
  },
};
