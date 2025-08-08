using System;
using System.Drawing;
using System.Windows.Forms;

namespace SkillsInternationalSchool.Forms
{
    /// <summary>
    /// About/Help form for the Skills International School Quiz System.
    /// Size: 600x500px as specified in requirements.
    /// </summary>
    public partial class AboutForm : Form
    {
        // UI Controls
        private PictureBox pictureBoxLogo;
        private Label labelTitle;
        private Label labelSchoolInfo;
        private GroupBox groupBoxProjectDetails;
        private Label labelProjectInfo;
        private GroupBox groupBoxUsageInstructions;
        private RichTextBox richTextBoxInstructions;
        private Button buttonClose;
        private Panel panelHeader;

        /// <summary>
        /// Initializes a new instance of the AboutForm class.
        /// </summary>
        public AboutForm()
        {
            InitializeComponent();
            SetupFormDesign();
            LoadContent();
        }

        /// <summary>
        /// Initializes the form components.
        /// </summary>
        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Form properties
            this.Text = "About - Skills International School";
            this.Size = new Size(600, 500);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
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
            panelHeader = new Panel();
            pictureBoxLogo = new PictureBox();
            labelTitle = new Label();
            labelSchoolInfo = new Label();
            groupBoxProjectDetails = new GroupBox();
            labelProjectInfo = new Label();
            groupBoxUsageInstructions = new GroupBox();
            richTextBoxInstructions = new RichTextBox();
            buttonClose = new Button();
        }

        /// <summary>
        /// Sets up the properties for all controls.
        /// </summary>
        private void SetupControlProperties()
        {
            // Header Panel
            panelHeader.Size = new Size(580, 120);
            panelHeader.Location = new Point(10, 10);
            panelHeader.BackColor = Color.FromArgb(46, 134, 171);
            panelHeader.BorderStyle = BorderStyle.FixedSingle;

            // School Logo
            pictureBoxLogo.Size = new Size(80, 60);
            pictureBoxLogo.Location = new Point(20, 30);
            pictureBoxLogo.BackColor = Color.White;
            pictureBoxLogo.BorderStyle = BorderStyle.FixedSingle;
            // You can add an actual logo image here: pictureBoxLogo.Image = Image.FromFile("Resources/logo.png");

            // Title Label
            labelTitle.Text = "Skills International School";
            labelTitle.Font = new Font("Times New Roman", 20F, FontStyle.Bold);
            labelTitle.ForeColor = Color.White;
            labelTitle.Size = new Size(450, 35);
            labelTitle.Location = new Point(120, 20);
            labelTitle.TextAlign = ContentAlignment.MiddleLeft;

            // School Info Label
            labelSchoolInfo.Text = "Comprehensive Quiz System - Educational Excellence";
            labelSchoolInfo.Font = new Font("Times New Roman", 12F, FontStyle.Italic);
            labelSchoolInfo.ForeColor = Color.White;
            labelSchoolInfo.Size = new Size(450, 25);
            labelSchoolInfo.Location = new Point(120, 55);
            labelSchoolInfo.TextAlign = ContentAlignment.MiddleLeft;

            // Project Details GroupBox
            groupBoxProjectDetails.Text = "Project Details";
            groupBoxProjectDetails.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxProjectDetails.ForeColor = Color.FromArgb(46, 134, 171);
            groupBoxProjectDetails.Size = new Size(580, 120);
            groupBoxProjectDetails.Location = new Point(10, 140);

            // Project Info Label
            labelProjectInfo.Font = new Font("Times New Roman", 11F);
            labelProjectInfo.ForeColor = Color.Black;
            labelProjectInfo.Size = new Size(560, 90);
            labelProjectInfo.Location = new Point(10, 25);
            labelProjectInfo.TextAlign = ContentAlignment.TopLeft;

            // Usage Instructions GroupBox
            groupBoxUsageInstructions.Text = "Usage Instructions";
            groupBoxUsageInstructions.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxUsageInstructions.ForeColor = Color.FromArgb(46, 134, 171);
            groupBoxUsageInstructions.Size = new Size(580, 180);
            groupBoxUsageInstructions.Location = new Point(10, 270);

            // Instructions RichTextBox
            richTextBoxInstructions.Font = new Font("Times New Roman", 10F);
            richTextBoxInstructions.Size = new Size(560, 150);
            richTextBoxInstructions.Location = new Point(10, 25);
            richTextBoxInstructions.ReadOnly = true;
            richTextBoxInstructions.BackColor = Color.White;
            richTextBoxInstructions.BorderStyle = BorderStyle.FixedSingle;

            // Close Button
            buttonClose.Text = "Close";
            buttonClose.Size = new Size(100, 35);
            buttonClose.Location = new Point(490, 460);
            buttonClose.Font = new Font("Times New Roman", 11F, FontStyle.Bold);
            buttonClose.BackColor = Color.FromArgb(162, 59, 114);
            buttonClose.ForeColor = Color.White;
            buttonClose.FlatStyle = FlatStyle.Flat;
            buttonClose.DialogResult = DialogResult.OK;
        }

        /// <summary>
        /// Adds controls to the form and containers.
        /// </summary>
        private void AddControlsToForm()
        {
            // Add controls to header panel
            panelHeader.Controls.Add(pictureBoxLogo);
            panelHeader.Controls.Add(labelTitle);
            panelHeader.Controls.Add(labelSchoolInfo);

            // Add controls to project details group box
            groupBoxProjectDetails.Controls.Add(labelProjectInfo);

            // Add controls to usage instructions group box
            groupBoxUsageInstructions.Controls.Add(richTextBoxInstructions);

            // Add all to form
            this.Controls.Add(panelHeader);
            this.Controls.Add(groupBoxProjectDetails);
            this.Controls.Add(groupBoxUsageInstructions);
            this.Controls.Add(buttonClose);
        }

        /// <summary>
        /// Sets up event handlers for controls.
        /// </summary>
        private void SetupEventHandlers()
        {
            buttonClose.Click += ButtonClose_Click;
            this.KeyDown += AboutForm_KeyDown;
        }

        /// <summary>
        /// Sets up additional form design elements.
        /// </summary>
        private void SetupFormDesign()
        {
            this.KeyPreview = true;
        }

        /// <summary>
        /// Loads content into the form controls.
        /// </summary>
        private void LoadContent()
        {
            // Project Details
            labelProjectInfo.Text = 
                "System Name: Skills International School Quiz System\n" +
                "Version: 1.0.0\n" +
                "Platform: Windows Forms (.NET 6.0)\n" +
                "Database: Microsoft SQL Server\n" +
                "Development Framework: C# Windows Forms Application\n" +
                "Purpose: Comprehensive student management and quiz system";

            // Usage Instructions
            richTextBoxInstructions.Text = GetUsageInstructions();

            // Format the instructions text
            FormatInstructionsText();
        }

        /// <summary>
        /// Gets the usage instructions text.
        /// </summary>
        private string GetUsageInstructions()
        {
            return "SYSTEM USAGE GUIDE\n\n" +
                   "1. LOGIN SYSTEM\n" +
                   "   • Use 'Admin' / 'Skills@123' to access the system\n" +
                   "   • Alternative login: 'teacher' / 'teacher123'\n" +
                   "   • Click 'Clear' to reset login fields\n" +
                   "   • Click 'Exit' to close the application\n\n" +
                   
                   "2. STUDENT REGISTRATION\n" +
                   "   • Fill in all required student details\n" +
                   "   • Use 'Register' to add new students\n" +
                   "   • Select registration number to view/edit existing students\n" +
                   "   • Use 'Update' to modify student information\n" +
                   "   • Use 'Delete' to remove student records\n" +
                   "   • Click 'Clear' to reset all fields\n\n" +
                   
                   "3. QUIZ SYSTEM\n" +
                   "   • Quiz contains 10 randomly selected questions\n" +
                   "   • Time limit: 10 minutes\n" +
                   "   • Use 'Previous' and 'Next' to navigate questions\n" +
                   "   • Select your answer using radio buttons\n" +
                   "   • Click 'Submit' to finish the quiz\n" +
                   "   • Results are automatically saved to database\n\n" +
                   
                   "4. STUDENT DETAILS VIEW\n" +
                   "   • View all registered students in a table format\n" +
                   "   • Search by registration number or student name\n" +
                   "   • Use 'Refresh' to reload all data\n" +
                   "   • Export student data to CSV format\n\n" +
                   
                   "5. NAVIGATION\n" +
                   "   • Use 'Logout' to return to login screen\n" +
                   "   • Use 'Exit' to close the application\n" +
                   "   • Press F1 for help (this window)\n" +
                   "   • Press Escape to close dialogs\n\n" +
                   
                   "6. DATABASE REQUIREMENTS\n" +
                   "   • SQL Server with 'Student' database\n" +
                   "   • Run DatabaseSetup.sql to initialize tables\n" +
                   "   • Ensure proper connection string configuration\n\n" +
                   
                   "For technical support or questions, contact the system administrator.";
        }

        /// <summary>
        /// Formats the instructions text with colors and styles.
        /// </summary>
        private void FormatInstructionsText()
        {
            // Set default font and color
            richTextBoxInstructions.SelectAll();
            richTextBoxInstructions.SelectionFont = new Font("Times New Roman", 10F);
            richTextBoxInstructions.SelectionColor = Color.Black;
            richTextBoxInstructions.DeselectAll();

            // Format section headers
            FormatTextSection("SYSTEM USAGE GUIDE", FontStyle.Bold, Color.FromArgb(46, 134, 171), 12F);
            FormatTextSection("1. LOGIN SYSTEM", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);
            FormatTextSection("2. STUDENT REGISTRATION", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);
            FormatTextSection("3. QUIZ SYSTEM", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);
            FormatTextSection("4. STUDENT DETAILS VIEW", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);
            FormatTextSection("5. NAVIGATION", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);
            FormatTextSection("6. DATABASE REQUIREMENTS", FontStyle.Bold, Color.FromArgb(162, 59, 114), 11F);

            // Reset selection
            richTextBoxInstructions.SelectionStart = 0;
            richTextBoxInstructions.SelectionLength = 0;
        }

        /// <summary>
        /// Formats a specific text section with given style.
        /// </summary>
        private void FormatTextSection(string text, FontStyle style, Color color, float fontSize)
        {
            int index = richTextBoxInstructions.Text.IndexOf(text);
            if (index >= 0)
            {
                richTextBoxInstructions.SelectionStart = index;
                richTextBoxInstructions.SelectionLength = text.Length;
                richTextBoxInstructions.SelectionFont = new Font("Times New Roman", fontSize, style);
                richTextBoxInstructions.SelectionColor = color;
            }
        }

        /// <summary>
        /// Handles the Close button click event.
        /// </summary>
        private void ButtonClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        /// <summary>
        /// Handles key down events for the form.
        /// </summary>
        private void AboutForm_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape || e.KeyCode == Keys.Enter)
            {
                this.Close();
            }
        }

        /// <summary>
        /// Shows system information dialog.
        /// </summary>
        public static void ShowSystemInfo()
        {
            string systemInfo = 
                "Skills International School Quiz System\n\n" +
                $"Version: 1.0.0\n" +
                $"Build Date: {DateTime.Now:yyyy-MM-dd}\n" +
                $"Framework: .NET 6.0\n" +
                $"Platform: Windows Forms\n" +
                $"Database: SQL Server\n\n" +
                "Developed for educational purposes.\n" +
                "All rights reserved.";

            MessageBox.Show(systemInfo, "System Information", 
                MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        /// <summary>
        /// Shows keyboard shortcuts dialog.
        /// </summary>
        public static void ShowKeyboardShortcuts()
        {
            string shortcuts = 
                "KEYBOARD SHORTCUTS\n\n" +
                "General:\n" +
                "F1 - Show Help/About\n" +
                "Ctrl+Q - Quick Quiz\n" +
                "Ctrl+R - Refresh Data\n" +
                "Ctrl+E - Export Data\n" +
                "Escape - Close Dialog/Exit\n\n" +
                "Login Form:\n" +
                "Enter - Login\n" +
                "Ctrl+C - Clear Fields\n\n" +
                "Registration Form:\n" +
                "Ctrl+S - Save/Register\n" +
                "Ctrl+U - Update\n" +
                "Ctrl+D - Delete\n" +
                "Ctrl+L - Clear Fields\n\n" +
                "Quiz Form:\n" +
                "Left Arrow - Previous Question\n" +
                "Right Arrow - Next Question\n" +
                "Ctrl+Enter - Submit Quiz\n\n" +
                "Student Details:\n" +
                "Ctrl+F - Focus Search\n" +
                "F5 - Refresh Data\n" +
                "Ctrl+E - Export to CSV";

            MessageBox.Show(shortcuts, "Keyboard Shortcuts", 
                MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }
}