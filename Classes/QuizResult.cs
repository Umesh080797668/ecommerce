using System;

namespace SkillsInternationalSchool.Classes
{
    /// <summary>
    /// Represents a quiz result.
    /// </summary>
    public class QuizResult
    {
        /// <summary>
        /// Gets or sets the result ID.
        /// </summary>
        public int ResultId { get; set; }

        /// <summary>
        /// Gets or sets the student registration number.
        /// </summary>
        public int StudentRegNo { get; set; }

        /// <summary>
        /// Gets or sets the quiz score.
        /// </summary>
        public int Score { get; set; }

        /// <summary>
        /// Gets or sets the total number of questions.
        /// </summary>
        public int TotalQuestions { get; set; }

        /// <summary>
        /// Gets or sets the time taken to complete the quiz (in seconds).
        /// </summary>
        public int TimeTaken { get; set; }

        /// <summary>
        /// Gets or sets the quiz date and time.
        /// </summary>
        public DateTime QuizDate { get; set; }

        /// <summary>
        /// Gets the percentage score.
        /// </summary>
        public double Percentage => TotalQuestions > 0 ? (double)Score / TotalQuestions * 100 : 0;

        /// <summary>
        /// Gets the grade based on the percentage.
        /// </summary>
        public string Grade
        {
            get
            {
                var percentage = Percentage;
                return percentage switch
                {
                    >= 90 => "A+",
                    >= 80 => "A",
                    >= 70 => "B+",
                    >= 60 => "B",
                    >= 50 => "C+",
                    >= 40 => "C",
                    >= 30 => "D",
                    _ => "F"
                };
            }
        }

        /// <summary>
        /// Gets the formatted time taken as a string.
        /// </summary>
        public string FormattedTimeTaken
        {
            get
            {
                var minutes = TimeTaken / 60;
                var seconds = TimeTaken % 60;
                return $"{minutes:D2}:{seconds:D2}";
            }
        }

        /// <summary>
        /// Initializes a new instance of the QuizResult class.
        /// </summary>
        public QuizResult()
        {
            QuizDate = DateTime.Now;
        }

        /// <summary>
        /// Validates the quiz result data.
        /// </summary>
        /// <returns>True if all required fields are valid, false otherwise.</returns>
        public bool IsValid()
        {
            return StudentRegNo > 0 &&
                   Score >= 0 &&
                   TotalQuestions > 0 &&
                   Score <= TotalQuestions &&
                   TimeTaken >= 0;
        }
    }
}