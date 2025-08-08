using System;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Windows.Forms;
using SkillsInternationalSchool.Classes;

namespace SkillsInternationalSchool.Forms
{
    /// <summary>
    /// Login form for the Skills International School Quiz System.
    /// Size: 400x300px as specified in requirements.
    /// </summary>
    public partial class LoginForm : Form
    {
        private readonly DatabaseHelper dbHelper;

        // UI Controls
        private PictureBox pictureBoxLogo;
        private GroupBox groupBoxLogin;
        private Label labelTitle;
        private Label labelUsername;
        private Label labelPassword;
        private TextBox textBoxUsername;
        private TextBox textBoxPassword;
        private Button buttonClear;
        private Button buttonLogin;
        private Button buttonExit;

        /// <summary>
        /// Initializes a new instance of the LoginForm class.
        /// </summary>
        public LoginForm()
        {
            dbHelper = new DatabaseHelper();
            InitializeComponent();
            SetupFormDesign();
        }

        /// <summary>
        /// Initializes the form components.
        /// </summary>
        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Form properties
            this.Text = "Skills International School - Login";
            this.Size = new Size(400, 300);
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
            pictureBoxLogo = new PictureBox();
            groupBoxLogin = new GroupBox();
            labelTitle = new Label();
            labelUsername = new Label();
            labelPassword = new Label();
            textBoxUsername = new TextBox();
            textBoxPassword = new TextBox();
            buttonClear = new Button();
            buttonLogin = new Button();
            buttonExit = new Button();
        }

        /// <summary>
        /// Sets up the properties for all controls.
        /// </summary>
        private void SetupControlProperties()
        {
            // PictureBox Logo - Top center, 100x80px
            pictureBoxLogo.Size = new Size(100, 80);
            pictureBoxLogo.Location = new Point(150, 20);
            pictureBoxLogo.BackColor = Color.FromArgb(46, 134, 171);
            pictureBoxLogo.BorderStyle = BorderStyle.FixedSingle;
            // You can add an actual logo image here: pictureBoxLogo.Image = Image.FromFile("Resources/logo.png");

            // GroupBox Login - Center, 300x180px
            groupBoxLogin.Text = "Login";
            groupBoxLogin.Size = new Size(300, 180);
            groupBoxLogin.Location = new Point(50, 110);
            groupBoxLogin.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxLogin.ForeColor = Color.FromArgb(46, 134, 171);

            // Title Label
            labelTitle.Text = "Skills International";
            labelTitle.Font = new Font("Times New Roman", 16F, FontStyle.Bold);
            labelTitle.ForeColor = Color.FromArgb(162, 59, 114);
            labelTitle.Size = new Size(200, 25);
            labelTitle.Location = new Point(20, 25);
            labelTitle.TextAlign = ContentAlignment.MiddleCenter;

            // Username Label
            labelUsername.Text = "Username";
            labelUsername.Font = new Font("Times New Roman", 12F);
            labelUsername.Size = new Size(80, 20);
            labelUsername.Location = new Point(20, 65);

            // Password Label
            labelPassword.Text = "Password";
            labelPassword.Font = new Font("Times New Roman", 12F);
            labelPassword.Size = new Size(80, 20);
            labelPassword.Location = new Point(20, 95);

            // Username TextBox
            textBoxUsername.Font = new Font("Times New Roman", 10F);
            textBoxUsername.Size = new Size(150, 20);
            textBoxUsername.Location = new Point(110, 65);

            // Password TextBox - PasswordChar = '*'
            textBoxPassword.Font = new Font("Times New Roman", 10F);
            textBoxPassword.Size = new Size(150, 20);
            textBoxPassword.Location = new Point(110, 95);
            textBoxPassword.PasswordChar = '*';

            // Clear Button - 80x30px
            buttonClear.Text = "Clear";
            buttonClear.Size = new Size(80, 30);
            buttonClear.Location = new Point(20, 130);
            buttonClear.Font = new Font("Times New Roman", 10F);
            buttonClear.BackColor = Color.FromArgb(241, 143, 1);
            buttonClear.ForeColor = Color.White;
            buttonClear.FlatStyle = FlatStyle.Flat;

            // Login Button - 80x30px
            buttonLogin.Text = "Login";
            buttonLogin.Size = new Size(80, 30);
            buttonLogin.Location = new Point(110, 130);
            buttonLogin.Font = new Font("Times New Roman", 10F);
            buttonLogin.BackColor = Color.FromArgb(46, 134, 171);
            buttonLogin.ForeColor = Color.White;
            buttonLogin.FlatStyle = FlatStyle.Flat;

            // Exit Button - 80x30px
            buttonExit.Text = "Exit";
            buttonExit.Size = new Size(80, 30);
            buttonExit.Location = new Point(200, 130);
            buttonExit.Font = new Font("Times New Roman", 10F);
            buttonExit.BackColor = Color.FromArgb(162, 59, 114);
            buttonExit.ForeColor = Color.White;
            buttonExit.FlatStyle = FlatStyle.Flat;
        }

        /// <summary>
        /// Adds controls to the form and group box.
        /// </summary>
        private void AddControlsToForm()
        {
            // Add controls to GroupBox
            groupBoxLogin.Controls.Add(labelTitle);
            groupBoxLogin.Controls.Add(labelUsername);
            groupBoxLogin.Controls.Add(labelPassword);
            groupBoxLogin.Controls.Add(textBoxUsername);
            groupBoxLogin.Controls.Add(textBoxPassword);
            groupBoxLogin.Controls.Add(buttonClear);
            groupBoxLogin.Controls.Add(buttonLogin);
            groupBoxLogin.Controls.Add(buttonExit);

            // Add controls to Form
            this.Controls.Add(pictureBoxLogo);
            this.Controls.Add(groupBoxLogin);
        }

        /// <summary>
        /// Sets up event handlers for controls.
        /// </summary>
        private void SetupEventHandlers()
        {
            buttonLogin.Click += ButtonLogin_Click;
            buttonClear.Click += ButtonClear_Click;
            buttonExit.Click += ButtonExit_Click;
            
            // Allow Enter key to login
            this.KeyPreview = true;
            this.KeyDown += LoginForm_KeyDown;
            textBoxPassword.KeyDown += TextBoxPassword_KeyDown;
        }

        /// <summary>
        /// Sets up additional form design elements.
        /// </summary>
        private void SetupFormDesign()
        {
            // Set form icon if available
            try
            {
                // this.Icon = new Icon("Resources/icons/school.ico");
            }
            catch
            {
                // Icon not found, continue without it
            }
        }

        /// <summary>
        /// Handles the Login button click event.
        /// </summary>
        private void ButtonLogin_Click(object sender, EventArgs e)
        {
            PerformLogin();
        }

        /// <summary>
        /// Handles the Clear button click event.
        /// </summary>
        private void ButtonClear_Click(object sender, EventArgs e)
        {
            ClearFields();
        }

        /// <summary>
        /// Handles the Exit button click event.
        /// </summary>
        private void ButtonExit_Click(object sender, EventArgs e)
        {
            ConfirmExit();
        }

        /// <summary>
        /// Handles key down events for the form.
        /// </summary>
        private void LoginForm_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                PerformLogin();
            }
            else if (e.KeyCode == Keys.Escape)
            {
                ConfirmExit();
            }
        }

        /// <summary>
        /// Handles key down events for the password textbox.
        /// </summary>
        private void TextBoxPassword_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                PerformLogin();
            }
        }

        /// <summary>
        /// Performs the login validation and authentication.
        /// </summary>
        private void PerformLogin()
        {
            string username = textBoxUsername.Text.Trim();
            string password = textBoxPassword.Text;

            // Validate input
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                MessageBox.Show("Please enter both username and password.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                // Check credentials against database
                if (ValidateCredentials(username, password))
                {
                    MessageBox.Show($"Welcome, {username}!", "Login Successful", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);

                    // Hide login form and show registration form
                    this.Hide();
                    var registrationForm = new RegistrationForm();
                    registrationForm.ShowDialog();
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Invalid username or password. Please try again.", "Login Failed", 
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                    ClearFields();
                    textBoxUsername.Focus();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred during login: {ex.Message}", "Database Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Validates user credentials against the database.
        /// </summary>
        /// <param name="username">The username to validate.</param>
        /// <param name="password">The password to validate.</param>
        /// <returns>True if credentials are valid, false otherwise.</returns>
        private bool ValidateCredentials(string username, string password)
        {
            string query = "SELECT COUNT(*) FROM Logins WHERE username = @username AND password = @password AND isActive = 1";
            
            SqlParameter[] parameters = {
                new SqlParameter("@username", username),
                new SqlParameter("@password", password)
            };

            var result = dbHelper.ExecuteScalar(query, parameters);
            return Convert.ToInt32(result) > 0;
        }

        /// <summary>
        /// Clears all input fields.
        /// </summary>
        private void ClearFields()
        {
            textBoxUsername.Clear();
            textBoxPassword.Clear();
            textBoxUsername.Focus();
        }

        /// <summary>
        /// Shows exit confirmation dialog.
        /// </summary>
        private void ConfirmExit()
        {
            DialogResult result = MessageBox.Show("Are you sure you want to exit?", "Confirm Exit", 
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            
            if (result == DialogResult.Yes)
            {
                Application.Exit();
            }
        }

        /// <summary>
        /// Handles form closing event.
        /// </summary>
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true;
                ConfirmExit();
            }
            else
            {
                base.OnFormClosing(e);
            }
        }
    }
}