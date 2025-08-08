using System;

namespace SkillsInternationalSchool.Classes
{
    /// <summary>
    /// Represents a quiz question.
    /// </summary>
    public class Question
    {
        /// <summary>
        /// Gets or sets the question ID.
        /// </summary>
        public int QuestionId { get; set; }

        /// <summary>
        /// Gets or sets the question text.
        /// </summary>
        public string QuestionText { get; set; }

        /// <summary>
        /// Gets or sets option A.
        /// </summary>
        public string OptionA { get; set; }

        /// <summary>
        /// Gets or sets option B.
        /// </summary>
        public string OptionB { get; set; }

        /// <summary>
        /// Gets or sets option C.
        /// </summary>
        public string OptionC { get; set; }

        /// <summary>
        /// Gets or sets option D.
        /// </summary>
        public string OptionD { get; set; }

        /// <summary>
        /// Gets or sets the correct answer (A, B, C, or D).
        /// </summary>
        public char CorrectAnswer { get; set; }

        /// <summary>
        /// Gets or sets the subject.
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Initializes a new instance of the Question class.
        /// </summary>
        public Question()
        {
            QuestionText = string.Empty;
            OptionA = string.Empty;
            OptionB = string.Empty;
            OptionC = string.Empty;
            OptionD = string.Empty;
            Subject = string.Empty;
        }

        /// <summary>
        /// Gets the option text for a given option letter.
        /// </summary>
        /// <param name="option">The option letter (A, B, C, or D).</param>
        /// <returns>The option text.</returns>
        public string GetOptionText(char option)
        {
            return option switch
            {
                'A' => OptionA,
                'B' => OptionB,
                'C' => OptionC,
                'D' => OptionD,
                _ => string.Empty
            };
        }

        /// <summary>
        /// Validates the question data.
        /// </summary>
        /// <returns>True if all required fields are valid, false otherwise.</returns>
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(QuestionText) &&
                   !string.IsNullOrWhiteSpace(OptionA) &&
                   !string.IsNullOrWhiteSpace(OptionB) &&
                   !string.IsNullOrWhiteSpace(OptionC) &&
                   !string.IsNullOrWhiteSpace(OptionD) &&
                   "ABCD".Contains(CorrectAnswer) &&
                   !string.IsNullOrWhiteSpace(Subject);
        }
    }
}