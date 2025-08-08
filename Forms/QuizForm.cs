using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using SkillsInternationalSchool.Classes;

namespace SkillsInternationalSchool.Forms
{
    /// <summary>
    /// Quiz form for the Skills International School Quiz System.
    /// Size: 800x600px as specified in requirements.
    /// </summary>
    public partial class QuizForm : Form
    {
        private readonly DatabaseHelper dbHelper;
        private readonly List<Question> questions;
        private readonly Dictionary<int, char> userAnswers;
        private readonly Timer quizTimer;
        private int currentQuestionIndex;
        private int timeRemaining; // in seconds
        private int score;

        // UI Controls
        private Label labelTitle;
        private Label labelQuestion;
        private RadioButton radioButtonA;
        private RadioButton radioButtonB;
        private RadioButton radioButtonC;
        private RadioButton radioButtonD;
        private Button buttonPrevious;
        private Button buttonNext;
        private Button buttonSubmit;
        private Label labelScore;
        private Label labelTimer;
        private ProgressBar progressBarQuiz;
        private Panel panelAnswers;

        /// <summary>
        /// Initializes a new instance of the QuizForm class.
        /// </summary>
        public QuizForm()
        {
            dbHelper = new DatabaseHelper();
            questions = new List<Question>();
            userAnswers = new Dictionary<int, char>();
            quizTimer = new Timer();
            currentQuestionIndex = 0;
            timeRemaining = 600; // 10 minutes
            score = 0;

            InitializeComponent();
            SetupFormDesign();
            LoadQuestions();
            StartQuiz();
        }

        /// <summary>
        /// Initializes the form components.
        /// </summary>
        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Form properties
            this.Text = "Skills International School - Quiz System";
            this.Size = new Size(800, 600);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(245, 245, 245);

            // Create controls
            CreateControls();
            SetupControlProperties();
            AddControlsToForm();
            SetupEventHandlers();

            this.ResumeLayout(false);
        }

        /// <summary>
        /// Creates all the required controls.
        /// </summary>
        private void CreateControls()
        {
            labelTitle = new Label();
            labelQuestion = new Label();
            radioButtonA = new RadioButton();
            radioButtonB = new RadioButton();
            radioButtonC = new RadioButton();
            radioButtonD = new RadioButton();
            buttonPrevious = new Button();
            buttonNext = new Button();
            buttonSubmit = new Button();
            labelScore = new Label();
            labelTimer = new Label();
            progressBarQuiz = new ProgressBar();
            panelAnswers = new Panel();
        }

        /// <summary>
        /// Sets up the properties for all controls.
        /// </summary>
        private void SetupControlProperties()
        {
            // Title Label - 24pt, bold, centered
            labelTitle.Text = "Quiz System";
            labelTitle.Font = new Font("Times New Roman", 24F, FontStyle.Bold);
            labelTitle.ForeColor = Color.FromArgb(46, 134, 171);
            labelTitle.Size = new Size(800, 40);
            labelTitle.Location = new Point(0, 20);
            labelTitle.TextAlign = ContentAlignment.MiddleCenter;

            // Timer Label - top left, 12pt
            labelTimer.Text = "Time Remaining: 10:00";
            labelTimer.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            labelTimer.ForeColor = Color.FromArgb(162, 59, 114);
            labelTimer.Size = new Size(200, 20);
            labelTimer.Location = new Point(20, 80);

            // Score Label - top right, 12pt
            labelScore.Text = "Score: 0/0";
            labelScore.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            labelScore.ForeColor = Color.FromArgb(46, 134, 171);
            labelScore.Size = new Size(150, 20);
            labelScore.Location = new Point(630, 80);
            labelScore.TextAlign = ContentAlignment.TopRight;

            // Progress Bar
            progressBarQuiz.Size = new Size(760, 20);
            progressBarQuiz.Location = new Point(20, 110);
            progressBarQuiz.Style = ProgressBarStyle.Continuous;

            // Question Label - 14pt, centered
            labelQuestion.Text = "Loading questions...";
            labelQuestion.Font = new Font("Times New Roman", 14F, FontStyle.Bold);
            labelQuestion.ForeColor = Color.FromArgb(46, 134, 171);
            labelQuestion.Size = new Size(760, 80);
            labelQuestion.Location = new Point(20, 150);
            labelQuestion.TextAlign = ContentAlignment.MiddleCenter;

            // Panel for answer radio buttons
            panelAnswers.Size = new Size(760, 200);
            panelAnswers.Location = new Point(20, 240);
            panelAnswers.BackColor = Color.White;
            panelAnswers.BorderStyle = BorderStyle.FixedSingle;

            // Radio Buttons - 12pt, vertical, 30px spacing
            var answerFont = new Font("Times New Roman", 12F);
            var answerForeColor = Color.Black;

            radioButtonA.Text = "A) Option A";
            radioButtonA.Font = answerFont;
            radioButtonA.ForeColor = answerForeColor;
            radioButtonA.Size = new Size(700, 30);
            radioButtonA.Location = new Point(20, 20);
            radioButtonA.AutoSize = false;

            radioButtonB.Text = "B) Option B";
            radioButtonB.Font = answerFont;
            radioButtonB.ForeColor = answerForeColor;
            radioButtonB.Size = new Size(700, 30);
            radioButtonB.Location = new Point(20, 60);
            radioButtonB.AutoSize = false;

            radioButtonC.Text = "C) Option C";
            radioButtonC.Font = answerFont;
            radioButtonC.ForeColor = answerForeColor;
            radioButtonC.Size = new Size(700, 30);
            radioButtonC.Location = new Point(20, 100);
            radioButtonC.AutoSize = false;

            radioButtonD.Text = "D) Option D";
            radioButtonD.Font = answerFont;
            radioButtonD.ForeColor = answerForeColor;
            radioButtonD.Size = new Size(700, 30);
            radioButtonD.Location = new Point(20, 140);
            radioButtonD.AutoSize = false;

            // Navigation Buttons - 100x35px
            var buttonFont = new Font("Times New Roman", 11F, FontStyle.Bold);

            buttonPrevious.Text = "Previous";
            buttonPrevious.Size = new Size(100, 35);
            buttonPrevious.Location = new Point(200, 480);
            buttonPrevious.Font = buttonFont;
            buttonPrevious.BackColor = Color.FromArgb(162, 59, 114);
            buttonPrevious.ForeColor = Color.White;
            buttonPrevious.FlatStyle = FlatStyle.Flat;
            buttonPrevious.Enabled = false;

            buttonNext.Text = "Next";
            buttonNext.Size = new Size(100, 35);
            buttonNext.Location = new Point(350, 480);
            buttonNext.Font = buttonFont;
            buttonNext.BackColor = Color.FromArgb(46, 134, 171);
            buttonNext.ForeColor = Color.White;
            buttonNext.FlatStyle = FlatStyle.Flat;

            buttonSubmit.Text = "Submit";
            buttonSubmit.Size = new Size(100, 35);
            buttonSubmit.Location = new Point(500, 480);
            buttonSubmit.Font = buttonFont;
            buttonSubmit.BackColor = Color.FromArgb(241, 143, 1);
            buttonSubmit.ForeColor = Color.White;
            buttonSubmit.FlatStyle = FlatStyle.Flat;
        }

        /// <summary>
        /// Adds controls to the form and panels.
        /// </summary>
        private void AddControlsToForm()
        {
            // Add radio buttons to panel
            panelAnswers.Controls.Add(radioButtonA);
            panelAnswers.Controls.Add(radioButtonB);
            panelAnswers.Controls.Add(radioButtonC);
            panelAnswers.Controls.Add(radioButtonD);

            // Add all controls to form
            this.Controls.Add(labelTitle);
            this.Controls.Add(labelTimer);
            this.Controls.Add(labelScore);
            this.Controls.Add(progressBarQuiz);
            this.Controls.Add(labelQuestion);
            this.Controls.Add(panelAnswers);
            this.Controls.Add(buttonPrevious);
            this.Controls.Add(buttonNext);
            this.Controls.Add(buttonSubmit);
        }

        /// <summary>
        /// Sets up event handlers for controls.
        /// </summary>
        private void SetupEventHandlers()
        {
            buttonPrevious.Click += ButtonPrevious_Click;
            buttonNext.Click += ButtonNext_Click;
            buttonSubmit.Click += ButtonSubmit_Click;

            radioButtonA.CheckedChanged += RadioButton_CheckedChanged;
            radioButtonB.CheckedChanged += RadioButton_CheckedChanged;
            radioButtonC.CheckedChanged += RadioButton_CheckedChanged;
            radioButtonD.CheckedChanged += RadioButton_CheckedChanged;

            // Timer setup
            quizTimer.Interval = 1000; // 1 second
            quizTimer.Tick += QuizTimer_Tick;

            this.FormClosing += QuizForm_FormClosing;
        }

        /// <summary>
        /// Sets up additional form design elements.
        /// </summary>
        private void SetupFormDesign()
        {
            this.KeyPreview = true;
        }

        /// <summary>
        /// Loads questions from the database.
        /// </summary>
        private void LoadQuestions()
        {
            try
            {
                string query = @"SELECT TOP 10 questionId, questionText, optionA, optionB, optionC, optionD, 
                                correctAnswer, subject FROM Questions WHERE isActive = 1 ORDER BY NEWID()";
                
                var dataTable = dbHelper.ExecuteQuery(query);

                questions.Clear();
                foreach (DataRow row in dataTable.Rows)
                {
                    var question = new Question
                    {
                        QuestionId = Convert.ToInt32(row["questionId"]),
                        QuestionText = row["questionText"].ToString(),
                        OptionA = row["optionA"].ToString(),
                        OptionB = row["optionB"].ToString(),
                        OptionC = row["optionC"].ToString(),
                        OptionD = row["optionD"].ToString(),
                        CorrectAnswer = Convert.ToChar(row["correctAnswer"]),
                        Subject = row["subject"].ToString()
                    };
                    questions.Add(question);
                }

                if (questions.Count == 0)
                {
                    MessageBox.Show("No questions available in the database.", "No Questions",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    this.Close();
                    return;
                }

                // Set up progress bar
                progressBarQuiz.Maximum = questions.Count;
                progressBarQuiz.Value = 1;

                DisplayCurrentQuestion();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading questions: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.Close();
            }
        }

        /// <summary>
        /// Starts the quiz timer and initializes the quiz.
        /// </summary>
        private void StartQuiz()
        {
            quizTimer.Start();
            UpdateTimerDisplay();
            UpdateScoreDisplay();
        }

        /// <summary>
        /// Displays the current question.
        /// </summary>
        private void DisplayCurrentQuestion()
        {
            if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.Count)
            {
                var question = questions[currentQuestionIndex];

                labelQuestion.Text = $"Question {currentQuestionIndex + 1}: {question.QuestionText}";
                radioButtonA.Text = $"A) {question.OptionA}";
                radioButtonB.Text = $"B) {question.OptionB}";
                radioButtonC.Text = $"C) {question.OptionC}";
                radioButtonD.Text = $"D) {question.OptionD}";

                // Clear previous selection
                radioButtonA.Checked = false;
                radioButtonB.Checked = false;
                radioButtonC.Checked = false;
                radioButtonD.Checked = false;

                // Restore user's previous answer if exists
                if (userAnswers.ContainsKey(currentQuestionIndex))
                {
                    char answer = userAnswers[currentQuestionIndex];
                    switch (answer)
                    {
                        case 'A': radioButtonA.Checked = true; break;
                        case 'B': radioButtonB.Checked = true; break;
                        case 'C': radioButtonC.Checked = true; break;
                        case 'D': radioButtonD.Checked = true; break;
                    }
                }

                // Update button states
                buttonPrevious.Enabled = currentQuestionIndex > 0;
                buttonNext.Enabled = currentQuestionIndex < questions.Count - 1;

                // Update progress
                progressBarQuiz.Value = currentQuestionIndex + 1;
            }
        }

        /// <summary>
        /// Handles the Previous button click event.
        /// </summary>
        private void ButtonPrevious_Click(object sender, EventArgs e)
        {
            SaveCurrentAnswer();
            if (currentQuestionIndex > 0)
            {
                currentQuestionIndex--;
                DisplayCurrentQuestion();
            }
        }

        /// <summary>
        /// Handles the Next button click event.
        /// </summary>
        private void ButtonNext_Click(object sender, EventArgs e)
        {
            SaveCurrentAnswer();
            if (currentQuestionIndex < questions.Count - 1)
            {
                currentQuestionIndex++;
                DisplayCurrentQuestion();
            }
        }

        /// <summary>
        /// Handles the Submit button click event.
        /// </summary>
        private void ButtonSubmit_Click(object sender, EventArgs e)
        {
            SaveCurrentAnswer();
            SubmitQuiz();
        }

        /// <summary>
        /// Handles radio button selection changes.
        /// </summary>
        private void RadioButton_CheckedChanged(object sender, EventArgs e)
        {
            if (sender is RadioButton radioButton && radioButton.Checked)
            {
                SaveCurrentAnswer();
                UpdateScoreDisplay();
            }
        }

        /// <summary>
        /// Handles the quiz timer tick event.
        /// </summary>
        private void QuizTimer_Tick(object sender, EventArgs e)
        {
            timeRemaining--;
            UpdateTimerDisplay();

            if (timeRemaining <= 0)
            {
                quizTimer.Stop();
                MessageBox.Show("Time's up! The quiz will be submitted automatically.", "Time Up",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                SubmitQuiz();
            }
        }

        /// <summary>
        /// Handles form closing event.
        /// </summary>
        private void QuizForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason == CloseReason.UserClosing)
            {
                DialogResult result = MessageBox.Show("Are you sure you want to exit the quiz? Your progress will be lost.", 
                    "Confirm Exit", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                
                if (result == DialogResult.No)
                {
                    e.Cancel = true;
                    return;
                }
            }
            
            quizTimer.Stop();
        }

        /// <summary>
        /// Saves the current answer selection.
        /// </summary>
        private void SaveCurrentAnswer()
        {
            if (radioButtonA.Checked)
                userAnswers[currentQuestionIndex] = 'A';
            else if (radioButtonB.Checked)
                userAnswers[currentQuestionIndex] = 'B';
            else if (radioButtonC.Checked)
                userAnswers[currentQuestionIndex] = 'C';
            else if (radioButtonD.Checked)
                userAnswers[currentQuestionIndex] = 'D';
            else if (userAnswers.ContainsKey(currentQuestionIndex))
                userAnswers.Remove(currentQuestionIndex);
        }

        /// <summary>
        /// Updates the timer display.
        /// </summary>
        private void UpdateTimerDisplay()
        {
            int minutes = timeRemaining / 60;
            int seconds = timeRemaining % 60;
            labelTimer.Text = $"Time Remaining: {minutes:D2}:{seconds:D2}";

            // Change color based on remaining time
            if (timeRemaining <= 60)
                labelTimer.ForeColor = Color.Red;
            else if (timeRemaining <= 300)
                labelTimer.ForeColor = Color.Orange;
            else
                labelTimer.ForeColor = Color.FromArgb(162, 59, 114);
        }

        /// <summary>
        /// Updates the score display.
        /// </summary>
        private void UpdateScoreDisplay()
        {
            int currentScore = CalculateCurrentScore();
            labelScore.Text = $"Score: {currentScore}/{questions.Count}";
        }

        /// <summary>
        /// Calculates the current score based on answered questions.
        /// </summary>
        private int CalculateCurrentScore()
        {
            int score = 0;
            foreach (var answer in userAnswers)
            {
                if (answer.Key < questions.Count)
                {
                    var question = questions[answer.Key];
                    if (question.CorrectAnswer == answer.Value)
                    {
                        score++;
                    }
                }
            }
            return score;
        }

        /// <summary>
        /// Submits the quiz and calculates final results.
        /// </summary>
        private void SubmitQuiz()
        {
            quizTimer.Stop();

            // Calculate final score
            score = CalculateCurrentScore();
            int timeTaken = 600 - timeRemaining; // Original time minus remaining time

            // Show results
            ShowQuizResults(score, questions.Count, timeTaken);

            // Save results to database
            SaveQuizResults(score, questions.Count, timeTaken);

            this.Close();
        }

        /// <summary>
        /// Shows the quiz results to the user.
        /// </summary>
        private void ShowQuizResults(int score, int totalQuestions, int timeTaken)
        {
            double percentage = (double)score / totalQuestions * 100;
            string grade = GetGrade(percentage);
            
            int minutes = timeTaken / 60;
            int seconds = timeTaken % 60;
            string timeText = $"{minutes:D2}:{seconds:D2}";

            string message = $"Quiz Completed!\n\n" +
                           $"Score: {score}/{totalQuestions}\n" +
                           $"Percentage: {percentage:F1}%\n" +
                           $"Grade: {grade}\n" +
                           $"Time Taken: {timeText}\n\n" +
                           $"Thank you for taking the quiz!";

            MessageBox.Show(message, "Quiz Results", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        /// <summary>
        /// Gets the grade based on percentage.
        /// </summary>
        private string GetGrade(double percentage)
        {
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

        /// <summary>
        /// Saves the quiz results to the database.
        /// </summary>
        private void SaveQuizResults(int score, int totalQuestions, int timeTaken)
        {
            try
            {
                // For now, we'll use studentRegNo = 1 as default
                // In a real application, this would be passed from the registration form
                int studentRegNo = 1;

                // Check if student exists, if not, create a default one
                string checkQuery = "SELECT COUNT(*) FROM Registration WHERE regNo = @regNo";
                var checkParams = new[] { new SqlParameter("@regNo", studentRegNo) };
                var exists = Convert.ToInt32(dbHelper.ExecuteScalar(checkQuery, checkParams));

                if (exists == 0)
                {
                    // Create default student for testing
                    string insertStudent = @"SET IDENTITY_INSERT Registration ON;
                                           INSERT INTO Registration (regNo, firstName, lastName, dateOfBirth, gender, address, 
                                           email, mobilePhone, homePhone, parentName, nic, contactNo) 
                                           VALUES (1, 'Test', 'Student', '2005-01-01', 'Male', 'Test Address', 
                                           'test@email.com', 1234567890, 1234567890, 'Test Parent', 'TEST123456V', 1234567890);
                                           SET IDENTITY_INSERT Registration OFF;";
                    dbHelper.ExecuteNonQuery(insertStudent);
                }

                string query = @"INSERT INTO QuizResults (studentRegNo, score, totalQuestions, timeTaken, quizDate) 
                                VALUES (@studentRegNo, @score, @totalQuestions, @timeTaken, @quizDate)";

                SqlParameter[] parameters = {
                    new SqlParameter("@studentRegNo", studentRegNo),
                    new SqlParameter("@score", score),
                    new SqlParameter("@totalQuestions", totalQuestions),
                    new SqlParameter("@timeTaken", timeTaken),
                    new SqlParameter("@quizDate", DateTime.Now)
                };

                dbHelper.ExecuteNonQuery(query, parameters);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error saving quiz results: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}