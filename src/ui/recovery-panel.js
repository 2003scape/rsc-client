const selectedRecoverQuestions = [];
selectedRecoverQuestions.length = 5;
selectedRecoverQuestions.fill(null);

module.exports = {
    selectedRecoverQuestions,
    selectedRecoverIDs: new Int32Array([0, 1, 2, 3, 4]),
    controlRecoverNewQuestions: new Int32Array(5),
    controlRecoverNewAnswers: new Int32Array(5),
    controlRecoverNewQuestionButtons: new Int32Array(5),
    controlRecoverCustomQuestionButtons: new Int32Array(5),
    controlRecoverCreateButton: 0
};
