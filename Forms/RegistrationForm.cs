using System;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Windows.Forms;
using SkillsInternationalSchool.Classes;
using System.Data;

namespace SkillsInternationalSchool.Forms
{
    /// <summary>
    /// Registration form for student management.
    /// Size: 800x700px as specified in requirements.
    /// </summary>
    public partial class RegistrationForm : Form
    {
        private readonly DatabaseHelper dbHelper;
        private int currentStudentId = -1;

        // UI Controls - GroupBoxes
        private GroupBox groupBoxStudentReg;
        private GroupBox groupBoxBasicDetails;
        private GroupBox groupBoxContactDetails;
        private GroupBox groupBoxParentDetails;

        // UI Controls - Labels
        private Label labelRegNo;
        private Label labelFirstName;
        private Label labelLastName;
        private Label labelDateOfBirth;
        private Label labelGender;
        private Label labelAddress;
        private Label labelEmail;
        private Label labelMobilePhone;
        private Label labelHomePhone;
        private Label labelParentName;
        private Label labelNIC;
        private Label labelContactNo;

        // UI Controls - Input Fields
        private ComboBox comboBoxRegNo;
        private TextBox textBoxFirstName;
        private TextBox textBoxLastName;
        private DateTimePicker dateTimePickerDOB;
        private RadioButton radioButtonMale;
        private RadioButton radioButtonFemale;
        private TextBox textBoxAddress;
        private TextBox textBoxEmail;
        private TextBox textBoxMobilePhone;
        private TextBox textBoxHomePhone;
        private TextBox textBoxParentName;
        private TextBox textBoxNIC;
        private TextBox textBoxContactNo;

        // UI Controls - Buttons
        private Button buttonRegister;
        private Button buttonUpdate;
        private Button buttonClear;
        private Button buttonDelete;

        // UI Controls - Links
        private LinkLabel linkLabelLogout;
        private LinkLabel linkLabelExit;

        /// <summary>
        /// Initializes a new instance of the RegistrationForm class.
        /// </summary>
        public RegistrationForm()
        {
            dbHelper = new DatabaseHelper();
            InitializeComponent();
            SetupFormDesign();
            LoadRegistrationNumbers();
        }

        /// <summary>
        /// Initializes the form components.
        /// </summary>
        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Form properties
            this.Text = "Skills International School - Student Registration";
            this.Size = new Size(800, 700);
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
            // GroupBoxes
            groupBoxStudentReg = new GroupBox();
            groupBoxBasicDetails = new GroupBox();
            groupBoxContactDetails = new GroupBox();
            groupBoxParentDetails = new GroupBox();

            // Labels
            labelRegNo = new Label();
            labelFirstName = new Label();
            labelLastName = new Label();
            labelDateOfBirth = new Label();
            labelGender = new Label();
            labelAddress = new Label();
            labelEmail = new Label();
            labelMobilePhone = new Label();
            labelHomePhone = new Label();
            labelParentName = new Label();
            labelNIC = new Label();
            labelContactNo = new Label();

            // Input Fields
            comboBoxRegNo = new ComboBox();
            textBoxFirstName = new TextBox();
            textBoxLastName = new TextBox();
            dateTimePickerDOB = new DateTimePicker();
            radioButtonMale = new RadioButton();
            radioButtonFemale = new RadioButton();
            textBoxAddress = new TextBox();
            textBoxEmail = new TextBox();
            textBoxMobilePhone = new TextBox();
            textBoxHomePhone = new TextBox();
            textBoxParentName = new TextBox();
            textBoxNIC = new TextBox();
            textBoxContactNo = new TextBox();

            // Buttons
            buttonRegister = new Button();
            buttonUpdate = new Button();
            buttonClear = new Button();
            buttonDelete = new Button();

            // Links
            linkLabelLogout = new LinkLabel();
            linkLabelExit = new LinkLabel();
        }

        /// <summary>
        /// Sets up the properties for all controls.
        /// </summary>
        private void SetupControlProperties()
        {
            // GroupBox - Student Registration
            groupBoxStudentReg.Text = "Student Registration";
            groupBoxStudentReg.Size = new Size(750, 80);
            groupBoxStudentReg.Location = new Point(25, 20);
            groupBoxStudentReg.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxStudentReg.ForeColor = Color.FromArgb(46, 134, 171);

            // GroupBox - Basic Details
            groupBoxBasicDetails.Text = "Basic Details";
            groupBoxBasicDetails.Size = new Size(750, 200);
            groupBoxBasicDetails.Location = new Point(25, 110);
            groupBoxBasicDetails.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxBasicDetails.ForeColor = Color.FromArgb(46, 134, 171);

            // GroupBox - Contact Details
            groupBoxContactDetails.Text = "Contact Details";
            groupBoxContactDetails.Size = new Size(750, 150);
            groupBoxContactDetails.Location = new Point(25, 320);
            groupBoxContactDetails.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxContactDetails.ForeColor = Color.FromArgb(46, 134, 171);

            // GroupBox - Parent Details
            groupBoxParentDetails.Text = "Parent Details";
            groupBoxParentDetails.Size = new Size(750, 120);
            groupBoxParentDetails.Location = new Point(25, 480);
            groupBoxParentDetails.Font = new Font("Times New Roman", 12F, FontStyle.Bold);
            groupBoxParentDetails.ForeColor = Color.FromArgb(46, 134, 171);

            SetupLabelsAndInputs();
            SetupButtonsAndLinks();
        }

        /// <summary>
        /// Sets up labels and input controls.
        /// </summary>
        private void SetupLabelsAndInputs()
        {
            var labelFont = new Font("Times New Roman", 12F);
            var inputFont = new Font("Times New Roman", 10F);

            // Registration Number
            labelRegNo.Text = "Registration No";
            labelRegNo.Font = labelFont;
            labelRegNo.Size = new Size(120, 20);
            labelRegNo.Location = new Point(30, 35);

            comboBoxRegNo.Font = inputFont;
            comboBoxRegNo.Size = new Size(150, 25);
            comboBoxRegNo.Location = new Point(160, 33);
            comboBoxRegNo.DropDownStyle = ComboBoxStyle.DropDownList;

            // First Name
            labelFirstName.Text = "First Name";
            labelFirstName.Font = labelFont;
            labelFirstName.Size = new Size(100, 20);
            labelFirstName.Location = new Point(30, 40);

            textBoxFirstName.Font = inputFont;
            textBoxFirstName.Size = new Size(150, 25);
            textBoxFirstName.Location = new Point(160, 38);

            // Last Name
            labelLastName.Text = "Last Name";
            labelLastName.Font = labelFont;
            labelLastName.Size = new Size(100, 20);
            labelLastName.Location = new Point(400, 40);

            textBoxLastName.Font = inputFont;
            textBoxLastName.Size = new Size(150, 25);
            textBoxLastName.Location = new Point(530, 38);

            // Date of Birth
            labelDateOfBirth.Text = "Date of Birth";
            labelDateOfBirth.Font = labelFont;
            labelDateOfBirth.Size = new Size(100, 20);
            labelDateOfBirth.Location = new Point(30, 80);

            dateTimePickerDOB.Font = inputFont;
            dateTimePickerDOB.Size = new Size(150, 25);
            dateTimePickerDOB.Location = new Point(160, 78);
            dateTimePickerDOB.Format = DateTimePickerFormat.Short;

            // Gender
            labelGender.Text = "Gender";
            labelGender.Font = labelFont;
            labelGender.Size = new Size(100, 20);
            labelGender.Location = new Point(400, 80);

            radioButtonMale.Text = "Male";
            radioButtonMale.Font = inputFont;
            radioButtonMale.Size = new Size(60, 20);
            radioButtonMale.Location = new Point(530, 80);
            radioButtonMale.Checked = true;

            radioButtonFemale.Text = "Female";
            radioButtonFemale.Font = inputFont;
            radioButtonFemale.Size = new Size(70, 20);
            radioButtonFemale.Location = new Point(600, 80);

            // Address
            labelAddress.Text = "Address";
            labelAddress.Font = labelFont;
            labelAddress.Size = new Size(100, 20);
            labelAddress.Location = new Point(30, 120);

            textBoxAddress.Font = inputFont;
            textBoxAddress.Size = new Size(500, 50);
            textBoxAddress.Location = new Point(160, 118);
            textBoxAddress.Multiline = true;
            textBoxAddress.ScrollBars = ScrollBars.Vertical;

            // Email
            labelEmail.Text = "Email";
            labelEmail.Font = labelFont;
            labelEmail.Size = new Size(100, 20);
            labelEmail.Location = new Point(30, 40);

            textBoxEmail.Font = inputFont;
            textBoxEmail.Size = new Size(200, 25);
            textBoxEmail.Location = new Point(160, 38);

            // Mobile Phone
            labelMobilePhone.Text = "Mobile Phone";
            labelMobilePhone.Font = labelFont;
            labelMobilePhone.Size = new Size(120, 20);
            labelMobilePhone.Location = new Point(400, 40);

            textBoxMobilePhone.Font = inputFont;
            textBoxMobilePhone.Size = new Size(150, 25);
            textBoxMobilePhone.Location = new Point(530, 38);

            // Home Phone
            labelHomePhone.Text = "Home Phone";
            labelHomePhone.Font = labelFont;
            labelHomePhone.Size = new Size(120, 20);
            labelHomePhone.Location = new Point(30, 80);

            textBoxHomePhone.Font = inputFont;
            textBoxHomePhone.Size = new Size(150, 25);
            textBoxHomePhone.Location = new Point(160, 78);

            // Parent Name
            labelParentName.Text = "Parent Name";
            labelParentName.Font = labelFont;
            labelParentName.Size = new Size(120, 20);
            labelParentName.Location = new Point(30, 40);

            textBoxParentName.Font = inputFont;
            textBoxParentName.Size = new Size(200, 25);
            textBoxParentName.Location = new Point(160, 38);

            // NIC
            labelNIC.Text = "NIC";
            labelNIC.Font = labelFont;
            labelNIC.Size = new Size(100, 20);
            labelNIC.Location = new Point(400, 40);

            textBoxNIC.Font = inputFont;
            textBoxNIC.Size = new Size(150, 25);
            textBoxNIC.Location = new Point(530, 38);

            // Contact No
            labelContactNo.Text = "Contact No";
            labelContactNo.Font = labelFont;
            labelContactNo.Size = new Size(120, 20);
            labelContactNo.Location = new Point(30, 80);

            textBoxContactNo.Font = inputFont;
            textBoxContactNo.Size = new Size(150, 25);
            textBoxContactNo.Location = new Point(160, 78);
        }

        /// <summary>
        /// Sets up buttons and link labels.
        /// </summary>
        private void SetupButtonsAndLinks()
        {
            var buttonFont = new Font("Times New Roman", 10F, FontStyle.Bold);

            // Register Button
            buttonRegister.Text = "Register";
            buttonRegister.Size = new Size(100, 35);
            buttonRegister.Location = new Point(100, 620);
            buttonRegister.Font = buttonFont;
            buttonRegister.BackColor = Color.FromArgb(46, 134, 171);
            buttonRegister.ForeColor = Color.White;
            buttonRegister.FlatStyle = FlatStyle.Flat;

            // Update Button
            buttonUpdate.Text = "Update";
            buttonUpdate.Size = new Size(100, 35);
            buttonUpdate.Location = new Point(220, 620);
            buttonUpdate.Font = buttonFont;
            buttonUpdate.BackColor = Color.FromArgb(241, 143, 1);
            buttonUpdate.ForeColor = Color.White;
            buttonUpdate.FlatStyle = FlatStyle.Flat;

            // Clear Button
            buttonClear.Text = "Clear";
            buttonClear.Size = new Size(100, 35);
            buttonClear.Location = new Point(340, 620);
            buttonClear.Font = buttonFont;
            buttonClear.BackColor = Color.FromArgb(162, 59, 114);
            buttonClear.ForeColor = Color.White;
            buttonClear.FlatStyle = FlatStyle.Flat;

            // Delete Button
            buttonDelete.Text = "Delete";
            buttonDelete.Size = new Size(100, 35);
            buttonDelete.Location = new Point(460, 620);
            buttonDelete.Font = buttonFont;
            buttonDelete.BackColor = Color.Red;
            buttonDelete.ForeColor = Color.White;
            buttonDelete.FlatStyle = FlatStyle.Flat;

            // Logout Link
            linkLabelLogout.Text = "Logout";
            linkLabelLogout.Size = new Size(60, 20);
            linkLabelLogout.Location = new Point(600, 630);
            linkLabelLogout.Font = new Font("Times New Roman", 11F);
            linkLabelLogout.LinkColor = Color.FromArgb(46, 134, 171);

            // Exit Link
            linkLabelExit.Text = "Exit";
            linkLabelExit.Size = new Size(40, 20);
            linkLabelExit.Location = new Point(680, 630);
            linkLabelExit.Font = new Font("Times New Roman", 11F);
            linkLabelExit.LinkColor = Color.FromArgb(162, 59, 114);
        }

        /// <summary>
        /// Adds controls to the form and group boxes.
        /// </summary>
        private void AddControlsToForm()
        {
            // Add to Student Registration GroupBox
            groupBoxStudentReg.Controls.Add(labelRegNo);
            groupBoxStudentReg.Controls.Add(comboBoxRegNo);

            // Add to Basic Details GroupBox
            groupBoxBasicDetails.Controls.Add(labelFirstName);
            groupBoxBasicDetails.Controls.Add(textBoxFirstName);
            groupBoxBasicDetails.Controls.Add(labelLastName);
            groupBoxBasicDetails.Controls.Add(textBoxLastName);
            groupBoxBasicDetails.Controls.Add(labelDateOfBirth);
            groupBoxBasicDetails.Controls.Add(dateTimePickerDOB);
            groupBoxBasicDetails.Controls.Add(labelGender);
            groupBoxBasicDetails.Controls.Add(radioButtonMale);
            groupBoxBasicDetails.Controls.Add(radioButtonFemale);
            groupBoxBasicDetails.Controls.Add(labelAddress);
            groupBoxBasicDetails.Controls.Add(textBoxAddress);

            // Add to Contact Details GroupBox
            groupBoxContactDetails.Controls.Add(labelEmail);
            groupBoxContactDetails.Controls.Add(textBoxEmail);
            groupBoxContactDetails.Controls.Add(labelMobilePhone);
            groupBoxContactDetails.Controls.Add(textBoxMobilePhone);
            groupBoxContactDetails.Controls.Add(labelHomePhone);
            groupBoxContactDetails.Controls.Add(textBoxHomePhone);

            // Add to Parent Details GroupBox
            groupBoxParentDetails.Controls.Add(labelParentName);
            groupBoxParentDetails.Controls.Add(textBoxParentName);
            groupBoxParentDetails.Controls.Add(labelNIC);
            groupBoxParentDetails.Controls.Add(textBoxNIC);
            groupBoxParentDetails.Controls.Add(labelContactNo);
            groupBoxParentDetails.Controls.Add(textBoxContactNo);

            // Add all to form
            this.Controls.Add(groupBoxStudentReg);
            this.Controls.Add(groupBoxBasicDetails);
            this.Controls.Add(groupBoxContactDetails);
            this.Controls.Add(groupBoxParentDetails);
            this.Controls.Add(buttonRegister);
            this.Controls.Add(buttonUpdate);
            this.Controls.Add(buttonClear);
            this.Controls.Add(buttonDelete);
            this.Controls.Add(linkLabelLogout);
            this.Controls.Add(linkLabelExit);
        }

        /// <summary>
        /// Sets up event handlers for controls.
        /// </summary>
        private void SetupEventHandlers()
        {
            comboBoxRegNo.SelectedIndexChanged += ComboBoxRegNo_SelectedIndexChanged;
            buttonRegister.Click += ButtonRegister_Click;
            buttonUpdate.Click += ButtonUpdate_Click;
            buttonClear.Click += ButtonClear_Click;
            buttonDelete.Click += ButtonDelete_Click;
            linkLabelLogout.LinkClicked += LinkLabelLogout_LinkClicked;
            linkLabelExit.LinkClicked += LinkLabelExit_LinkClicked;
        }

        /// <summary>
        /// Sets up additional form design elements.
        /// </summary>
        private void SetupFormDesign()
        {
            this.KeyPreview = true;
        }

        /// <summary>
        /// Loads registration numbers into the combo box.
        /// </summary>
        private void LoadRegistrationNumbers()
        {
            try
            {
                comboBoxRegNo.Items.Clear();
                comboBoxRegNo.Items.Add("Select Registration Number");

                string query = "SELECT regNo, firstName, lastName FROM Registration ORDER BY regNo";
                var dataTable = dbHelper.ExecuteQuery(query);

                foreach (DataRow row in dataTable.Rows)
                {
                    comboBoxRegNo.Items.Add($"{row["regNo"]} - {row["firstName"]} {row["lastName"]}");
                }

                comboBoxRegNo.SelectedIndex = 0;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading registration numbers: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Handles registration number selection change.
        /// </summary>
        private void ComboBoxRegNo_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboBoxRegNo.SelectedIndex > 0)
            {
                string selectedText = comboBoxRegNo.SelectedItem.ToString();
                string[] parts = selectedText.Split(' ');
                if (int.TryParse(parts[0], out int regNo))
                {
                    LoadStudentData(regNo);
                }
            }
            else
            {
                ClearFields();
            }
        }

        /// <summary>
        /// Loads student data for the selected registration number.
        /// </summary>
        private void LoadStudentData(int regNo)
        {
            try
            {
                string query = "SELECT * FROM Registration WHERE regNo = @regNo";
                SqlParameter[] parameters = { new SqlParameter("@regNo", regNo) };
                var dataTable = dbHelper.ExecuteQuery(query, parameters);

                if (dataTable.Rows.Count > 0)
                {
                    var row = dataTable.Rows[0];
                    currentStudentId = regNo;

                    textBoxFirstName.Text = row["firstName"].ToString();
                    textBoxLastName.Text = row["lastName"].ToString();
                    dateTimePickerDOB.Value = Convert.ToDateTime(row["dateOfBirth"]);
                    
                    string gender = row["gender"].ToString();
                    radioButtonMale.Checked = gender.Equals("Male", StringComparison.OrdinalIgnoreCase);
                    radioButtonFemale.Checked = gender.Equals("Female", StringComparison.OrdinalIgnoreCase);

                    textBoxAddress.Text = row["address"].ToString();
                    textBoxEmail.Text = row["email"].ToString();
                    textBoxMobilePhone.Text = row["mobilePhone"].ToString();
                    textBoxHomePhone.Text = row["homePhone"].ToString();
                    textBoxParentName.Text = row["parentName"].ToString();
                    textBoxNIC.Text = row["nic"].ToString();
                    textBoxContactNo.Text = row["contactNo"].ToString();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading student data: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Handles the Register button click event.
        /// </summary>
        private void ButtonRegister_Click(object sender, EventArgs e)
        {
            RegisterStudent();
        }

        /// <summary>
        /// Handles the Update button click event.
        /// </summary>
        private void ButtonUpdate_Click(object sender, EventArgs e)
        {
            UpdateStudent();
        }

        /// <summary>
        /// Handles the Clear button click event.
        /// </summary>
        private void ButtonClear_Click(object sender, EventArgs e)
        {
            ClearFields();
        }

        /// <summary>
        /// Handles the Delete button click event.
        /// </summary>
        private void ButtonDelete_Click(object sender, EventArgs e)
        {
            DeleteStudent();
        }

        /// <summary>
        /// Handles the Logout link click event.
        /// </summary>
        private void LinkLabelLogout_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            DialogResult result = MessageBox.Show("Are you sure you want to logout?", "Confirm Logout",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                this.Hide();
                var loginForm = new LoginForm();
                loginForm.ShowDialog();
                this.Close();
            }
        }

        /// <summary>
        /// Handles the Exit link click event.
        /// </summary>
        private void LinkLabelExit_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            DialogResult result = MessageBox.Show("Are you sure you want to exit?", "Confirm Exit",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                Application.Exit();
            }
        }

        /// <summary>
        /// Registers a new student.
        /// </summary>
        private void RegisterStudent()
        {
            if (!ValidateInput())
                return;

            try
            {
                var student = CreateStudentFromForm();

                string query = @"INSERT INTO Registration (firstName, lastName, dateOfBirth, gender, address, 
                                email, mobilePhone, homePhone, parentName, nic, contactNo) 
                                VALUES (@firstName, @lastName, @dateOfBirth, @gender, @address, 
                                @email, @mobilePhone, @homePhone, @parentName, @nic, @contactNo)";

                SqlParameter[] parameters = CreateParametersFromStudent(student);
                
                int result = dbHelper.ExecuteNonQuery(query, parameters);

                if (result > 0)
                {
                    MessageBox.Show("Student registered successfully!", "Success", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    ClearFields();
                    LoadRegistrationNumbers();
                    
                    // Ask if user wants to take quiz
                    DialogResult quizResult = MessageBox.Show("Would you like to take a quiz?", "Take Quiz",
                        MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                    
                    if (quizResult == DialogResult.Yes)
                    {
                        ShowQuizForm();
                    }
                }
                else
                {
                    MessageBox.Show("Failed to register student.", "Error", 
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error registering student: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Updates an existing student.
        /// </summary>
        private void UpdateStudent()
        {
            if (currentStudentId == -1)
            {
                MessageBox.Show("Please select a student to update.", "No Selection", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (!ValidateInput())
                return;

            try
            {
                var student = CreateStudentFromForm();
                student.RegNo = currentStudentId;

                string query = @"UPDATE Registration SET firstName = @firstName, lastName = @lastName, 
                                dateOfBirth = @dateOfBirth, gender = @gender, address = @address, 
                                email = @email, mobilePhone = @mobilePhone, homePhone = @homePhone, 
                                parentName = @parentName, nic = @nic, contactNo = @contactNo 
                                WHERE regNo = @regNo";

                var parameters = CreateParametersFromStudent(student);
                Array.Resize(ref parameters, parameters.Length + 1);
                parameters[parameters.Length - 1] = new SqlParameter("@regNo", student.RegNo);

                int result = dbHelper.ExecuteNonQuery(query, parameters);

                if (result > 0)
                {
                    MessageBox.Show("Student updated successfully!", "Success", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    LoadRegistrationNumbers();
                }
                else
                {
                    MessageBox.Show("Failed to update student.", "Error", 
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error updating student: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Deletes the selected student.
        /// </summary>
        private void DeleteStudent()
        {
            if (currentStudentId == -1)
            {
                MessageBox.Show("Please select a student to delete.", "No Selection", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult result = MessageBox.Show("Are you sure you want to delete this student?", "Confirm Delete",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                try
                {
                    string query = "DELETE FROM Registration WHERE regNo = @regNo";
                    SqlParameter[] parameters = { new SqlParameter("@regNo", currentStudentId) };

                    int deleteResult = dbHelper.ExecuteNonQuery(query, parameters);

                    if (deleteResult > 0)
                    {
                        MessageBox.Show("Student deleted successfully!", "Success", 
                            MessageBoxButtons.OK, MessageBoxIcon.Information);
                        ClearFields();
                        LoadRegistrationNumbers();
                    }
                    else
                    {
                        MessageBox.Show("Failed to delete student.", "Error", 
                            MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error deleting student: {ex.Message}", "Database Error",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        /// <summary>
        /// Creates a Student object from the form data.
        /// </summary>
        private Student CreateStudentFromForm()
        {
            return new Student
            {
                FirstName = textBoxFirstName.Text.Trim(),
                LastName = textBoxLastName.Text.Trim(),
                DateOfBirth = dateTimePickerDOB.Value,
                Gender = radioButtonMale.Checked ? "Male" : "Female",
                Address = textBoxAddress.Text.Trim(),
                Email = textBoxEmail.Text.Trim(),
                MobilePhone = long.Parse(textBoxMobilePhone.Text),
                HomePhone = string.IsNullOrEmpty(textBoxHomePhone.Text) ? 0 : long.Parse(textBoxHomePhone.Text),
                ParentName = textBoxParentName.Text.Trim(),
                NIC = textBoxNIC.Text.Trim(),
                ContactNo = long.Parse(textBoxContactNo.Text)
            };
        }

        /// <summary>
        /// Creates SQL parameters from a Student object.
        /// </summary>
        private SqlParameter[] CreateParametersFromStudent(Student student)
        {
            return new[]
            {
                new SqlParameter("@firstName", student.FirstName),
                new SqlParameter("@lastName", student.LastName),
                new SqlParameter("@dateOfBirth", student.DateOfBirth),
                new SqlParameter("@gender", student.Gender),
                new SqlParameter("@address", student.Address),
                new SqlParameter("@email", student.Email),
                new SqlParameter("@mobilePhone", student.MobilePhone),
                new SqlParameter("@homePhone", student.HomePhone),
                new SqlParameter("@parentName", student.ParentName),
                new SqlParameter("@nic", student.NIC),
                new SqlParameter("@contactNo", student.ContactNo)
            };
        }

        /// <summary>
        /// Validates the input fields.
        /// </summary>
        private bool ValidateInput()
        {
            // Check required fields
            if (string.IsNullOrWhiteSpace(textBoxFirstName.Text))
            {
                MessageBox.Show("First Name is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxFirstName.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxLastName.Text))
            {
                MessageBox.Show("Last Name is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxLastName.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxAddress.Text))
            {
                MessageBox.Show("Address is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxAddress.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxEmail.Text))
            {
                MessageBox.Show("Email is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxEmail.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxMobilePhone.Text) || !long.TryParse(textBoxMobilePhone.Text, out _))
            {
                MessageBox.Show("Valid Mobile Phone is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxMobilePhone.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxParentName.Text))
            {
                MessageBox.Show("Parent Name is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxParentName.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxNIC.Text))
            {
                MessageBox.Show("NIC is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxNIC.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(textBoxContactNo.Text) || !long.TryParse(textBoxContactNo.Text, out _))
            {
                MessageBox.Show("Valid Contact Number is required.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxContactNo.Focus();
                return false;
            }

            // Validate email format
            if (!IsValidEmail(textBoxEmail.Text))
            {
                MessageBox.Show("Please enter a valid email address.", "Validation Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                textBoxEmail.Focus();
                return false;
            }

            return true;
        }

        /// <summary>
        /// Validates email format.
        /// </summary>
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Clears all input fields.
        /// </summary>
        private void ClearFields()
        {
            currentStudentId = -1;
            comboBoxRegNo.SelectedIndex = 0;
            textBoxFirstName.Clear();
            textBoxLastName.Clear();
            dateTimePickerDOB.Value = DateTime.Today.AddYears(-16);
            radioButtonMale.Checked = true;
            textBoxAddress.Clear();
            textBoxEmail.Clear();
            textBoxMobilePhone.Clear();
            textBoxHomePhone.Clear();
            textBoxParentName.Clear();
            textBoxNIC.Clear();
            textBoxContactNo.Clear();
            textBoxFirstName.Focus();
        }

        /// <summary>
        /// Shows the Quiz form.
        /// </summary>
        private void ShowQuizForm()
        {
            var quizForm = new QuizForm();
            quizForm.ShowDialog();
        }
    }
}