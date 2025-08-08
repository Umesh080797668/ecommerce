using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Text;
using System.Windows.Forms;
using SkillsInternationalSchool.Classes;

namespace SkillsInternationalSchool.Forms
{
    /// <summary>
    /// Student Details View form for displaying and managing student information.
    /// Size: 900x600px as specified in requirements.
    /// </summary>
    public partial class StudentDetailsForm : Form
    {
        private readonly DatabaseHelper dbHelper;

        // UI Controls
        private TextBox textBoxSearch;
        private Button buttonSearch;
        private DataGridView dataGridViewStudents;
        private Button buttonRefresh;
        private Button buttonExportCSV;
        private Label labelStatus;
        private Label labelTitle;
        private Button buttonClose;

        /// <summary>
        /// Initializes a new instance of the StudentDetailsForm class.
        /// </summary>
        public StudentDetailsForm()
        {
            dbHelper = new DatabaseHelper();
            InitializeComponent();
            SetupFormDesign();
            LoadAllStudents();
        }

        /// <summary>
        /// Initializes the form components.
        /// </summary>
        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Form properties
            this.Text = "Skills International School - Student Details";
            this.Size = new Size(900, 600);
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
            textBoxSearch = new TextBox();
            buttonSearch = new Button();
            dataGridViewStudents = new DataGridView();
            buttonRefresh = new Button();
            buttonExportCSV = new Button();
            labelStatus = new Label();
            buttonClose = new Button();
        }

        /// <summary>
        /// Sets up the properties for all controls.
        /// </summary>
        private void SetupControlProperties()
        {
            // Title Label
            labelTitle.Text = "Student Details Management";
            labelTitle.Font = new Font("Times New Roman", 18F, FontStyle.Bold);
            labelTitle.ForeColor = Color.FromArgb(46, 134, 171);
            labelTitle.Size = new Size(860, 30);
            labelTitle.Location = new Point(20, 20);
            labelTitle.TextAlign = ContentAlignment.MiddleCenter;

            // Search TextBox
            textBoxSearch.Font = new Font("Times New Roman", 11F);
            textBoxSearch.Size = new Size(250, 25);
            textBoxSearch.Location = new Point(20, 70);
            textBoxSearch.PlaceholderText = "Search by Registration No or Name...";

            // Search Button
            buttonSearch.Text = "Search";
            buttonSearch.Size = new Size(80, 25);
            buttonSearch.Location = new Point(280, 70);
            buttonSearch.Font = new Font("Times New Roman", 10F, FontStyle.Bold);
            buttonSearch.BackColor = Color.FromArgb(46, 134, 171);
            buttonSearch.ForeColor = Color.White;
            buttonSearch.FlatStyle = FlatStyle.Flat;

            // DataGridView for students
            dataGridViewStudents.Size = new Size(860, 400);
            dataGridViewStudents.Location = new Point(20, 110);
            dataGridViewStudents.Font = new Font("Times New Roman", 9F);
            dataGridViewStudents.BackgroundColor = Color.White;
            dataGridViewStudents.BorderStyle = BorderStyle.Fixed3D;
            dataGridViewStudents.AllowUserToAddRows = false;
            dataGridViewStudents.AllowUserToDeleteRows = false;
            dataGridViewStudents.ReadOnly = true;
            dataGridViewStudents.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridViewStudents.MultiSelect = false;
            dataGridViewStudents.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            dataGridViewStudents.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;

            // Refresh Button
            buttonRefresh.Text = "Refresh";
            buttonRefresh.Size = new Size(100, 35);
            buttonRefresh.Location = new Point(500, 530);
            buttonRefresh.Font = new Font("Times New Roman", 10F, FontStyle.Bold);
            buttonRefresh.BackColor = Color.FromArgb(241, 143, 1);
            buttonRefresh.ForeColor = Color.White;
            buttonRefresh.FlatStyle = FlatStyle.Flat;

            // Export CSV Button
            buttonExportCSV.Text = "Export to CSV";
            buttonExportCSV.Size = new Size(120, 35);
            buttonExportCSV.Location = new Point(620, 530);
            buttonExportCSV.Font = new Font("Times New Roman", 10F, FontStyle.Bold);
            buttonExportCSV.BackColor = Color.FromArgb(162, 59, 114);
            buttonExportCSV.ForeColor = Color.White;
            buttonExportCSV.FlatStyle = FlatStyle.Flat;

            // Close Button
            buttonClose.Text = "Close";
            buttonClose.Size = new Size(100, 35);
            buttonClose.Location = new Point(760, 530);
            buttonClose.Font = new Font("Times New Roman", 10F, FontStyle.Bold);
            buttonClose.BackColor = Color.Gray;
            buttonClose.ForeColor = Color.White;
            buttonClose.FlatStyle = FlatStyle.Flat;

            // Status Label
            labelStatus.Text = "Ready";
            labelStatus.Font = new Font("Times New Roman", 10F);
            labelStatus.ForeColor = Color.FromArgb(46, 134, 171);
            labelStatus.Size = new Size(400, 20);
            labelStatus.Location = new Point(20, 540);
        }

        /// <summary>
        /// Adds controls to the form.
        /// </summary>
        private void AddControlsToForm()
        {
            this.Controls.Add(labelTitle);
            this.Controls.Add(textBoxSearch);
            this.Controls.Add(buttonSearch);
            this.Controls.Add(dataGridViewStudents);
            this.Controls.Add(buttonRefresh);
            this.Controls.Add(buttonExportCSV);
            this.Controls.Add(labelStatus);
            this.Controls.Add(buttonClose);
        }

        /// <summary>
        /// Sets up event handlers for controls.
        /// </summary>
        private void SetupEventHandlers()
        {
            buttonSearch.Click += ButtonSearch_Click;
            buttonRefresh.Click += ButtonRefresh_Click;
            buttonExportCSV.Click += ButtonExportCSV_Click;
            buttonClose.Click += ButtonClose_Click;
            
            textBoxSearch.KeyDown += TextBoxSearch_KeyDown;
            dataGridViewStudents.SelectionChanged += DataGridViewStudents_SelectionChanged;
        }

        /// <summary>
        /// Sets up additional form design elements.
        /// </summary>
        private void SetupFormDesign()
        {
            this.KeyPreview = true;
        }

        /// <summary>
        /// Loads all students from the database.
        /// </summary>
        private void LoadAllStudents()
        {
            try
            {
                string query = @"SELECT regNo as 'Registration No', 
                                firstName as 'First Name', 
                                lastName as 'Last Name', 
                                CONVERT(varchar, dateOfBirth, 103) as 'Date of Birth',
                                gender as 'Gender',
                                address as 'Address',
                                email as 'Email',
                                mobilePhone as 'Mobile Phone',
                                homePhone as 'Home Phone',
                                parentName as 'Parent Name',
                                nic as 'NIC',
                                contactNo as 'Contact No',
                                CONVERT(varchar, registrationDate, 103) as 'Registration Date'
                                FROM Registration 
                                ORDER BY regNo";

                var dataTable = dbHelper.ExecuteQuery(query);
                dataGridViewStudents.DataSource = dataTable;

                // Update status
                UpdateStatusLabel(dataTable.Rows.Count);

                // Format columns
                FormatDataGridView();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading student data: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                labelStatus.Text = "Error loading data";
            }
        }

        /// <summary>
        /// Handles the Search button click event.
        /// </summary>
        private void ButtonSearch_Click(object sender, EventArgs e)
        {
            PerformSearch();
        }

        /// <summary>
        /// Handles the Refresh button click event.
        /// </summary>
        private void ButtonRefresh_Click(object sender, EventArgs e)
        {
            textBoxSearch.Clear();
            LoadAllStudents();
            labelStatus.Text = "Data refreshed";
        }

        /// <summary>
        /// Handles the Export CSV button click event.
        /// </summary>
        private void ButtonExportCSV_Click(object sender, EventArgs e)
        {
            ExportToCSV();
        }

        /// <summary>
        /// Handles the Close button click event.
        /// </summary>
        private void ButtonClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        /// <summary>
        /// Handles key down events for the search textbox.
        /// </summary>
        private void TextBoxSearch_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                PerformSearch();
            }
        }

        /// <summary>
        /// Handles DataGridView selection changes.
        /// </summary>
        private void DataGridViewStudents_SelectionChanged(object sender, EventArgs e)
        {
            if (dataGridViewStudents.SelectedRows.Count > 0)
            {
                var selectedRow = dataGridViewStudents.SelectedRows[0];
                string regNo = selectedRow.Cells["Registration No"].Value?.ToString() ?? "";
                string name = $"{selectedRow.Cells["First Name"].Value} {selectedRow.Cells["Last Name"].Value}";
                labelStatus.Text = $"Selected: {regNo} - {name}";
            }
        }

        /// <summary>
        /// Performs search based on the input criteria.
        /// </summary>
        private void PerformSearch()
        {
            string searchTerm = textBoxSearch.Text.Trim();

            if (string.IsNullOrEmpty(searchTerm))
            {
                LoadAllStudents();
                return;
            }

            try
            {
                string query = @"SELECT regNo as 'Registration No', 
                                firstName as 'First Name', 
                                lastName as 'Last Name', 
                                CONVERT(varchar, dateOfBirth, 103) as 'Date of Birth',
                                gender as 'Gender',
                                address as 'Address',
                                email as 'Email',
                                mobilePhone as 'Mobile Phone',
                                homePhone as 'Home Phone',
                                parentName as 'Parent Name',
                                nic as 'NIC',
                                contactNo as 'Contact No',
                                CONVERT(varchar, registrationDate, 103) as 'Registration Date'
                                FROM Registration 
                                WHERE CAST(regNo AS varchar) LIKE @searchTerm
                                OR firstName LIKE @searchTerm
                                OR lastName LIKE @searchTerm
                                OR CONCAT(firstName, ' ', lastName) LIKE @searchTerm
                                ORDER BY regNo";

                SqlParameter[] parameters = {
                    new SqlParameter("@searchTerm", $"%{searchTerm}%")
                };

                var dataTable = dbHelper.ExecuteQuery(query, parameters);
                dataGridViewStudents.DataSource = dataTable;

                // Update status
                UpdateStatusLabel(dataTable.Rows.Count, $"Search results for '{searchTerm}'");

                // Format columns
                FormatDataGridView();

                if (dataTable.Rows.Count == 0)
                {
                    MessageBox.Show($"No students found matching '{searchTerm}'.", "Search Results",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error performing search: {ex.Message}", "Database Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Exports the current data to a CSV file.
        /// </summary>
        private void ExportToCSV()
        {
            if (dataGridViewStudents.Rows.Count == 0)
            {
                MessageBox.Show("No data to export.", "Export Error",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            SaveFileDialog saveFileDialog = new SaveFileDialog
            {
                Filter = "CSV files (*.csv)|*.csv",
                FileName = $"StudentDetails_{DateTime.Now:yyyyMMdd_HHmmss}.csv",
                Title = "Export Student Details"
            };

            if (saveFileDialog.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    ExportDataGridViewToCSV(dataGridViewStudents, saveFileDialog.FileName);
                    MessageBox.Show($"Data exported successfully to:\n{saveFileDialog.FileName}", 
                        "Export Successful", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    
                    labelStatus.Text = $"Exported {dataGridViewStudents.Rows.Count} records to CSV";
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error exporting data: {ex.Message}", "Export Error",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        /// <summary>
        /// Exports DataGridView data to CSV file.
        /// </summary>
        private void ExportDataGridViewToCSV(DataGridView dataGridView, string fileName)
        {
            using (var streamWriter = new StreamWriter(fileName, false, Encoding.UTF8))
            {
                // Write headers
                var headers = new string[dataGridView.Columns.Count];
                for (int i = 0; i < dataGridView.Columns.Count; i++)
                {
                    headers[i] = $"\"{dataGridView.Columns[i].HeaderText}\"";
                }
                streamWriter.WriteLine(string.Join(",", headers));

                // Write data rows
                foreach (DataGridViewRow row in dataGridView.Rows)
                {
                    if (!row.IsNewRow)
                    {
                        var cells = new string[dataGridView.Columns.Count];
                        for (int i = 0; i < dataGridView.Columns.Count; i++)
                        {
                            string cellValue = row.Cells[i].Value?.ToString() ?? "";
                            // Escape quotes and wrap in quotes if contains comma or quote
                            cellValue = cellValue.Replace("\"", "\"\"");
                            if (cellValue.Contains(",") || cellValue.Contains("\"") || cellValue.Contains("\n"))
                            {
                                cellValue = $"\"{cellValue}\"";
                            }
                            cells[i] = cellValue;
                        }
                        streamWriter.WriteLine(string.Join(",", cells));
                    }
                }
            }
        }

        /// <summary>
        /// Formats the DataGridView columns.
        /// </summary>
        private void FormatDataGridView()
        {
            if (dataGridViewStudents.Columns.Count == 0) return;

            // Set column widths and alignment
            foreach (DataGridViewColumn column in dataGridViewStudents.Columns)
            {
                switch (column.HeaderText)
                {
                    case "Registration No":
                        column.Width = 80;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                    case "First Name":
                    case "Last Name":
                        column.Width = 100;
                        break;
                    case "Date of Birth":
                        column.Width = 90;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                    case "Gender":
                        column.Width = 70;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                    case "Address":
                        column.Width = 200;
                        break;
                    case "Email":
                        column.Width = 150;
                        break;
                    case "Mobile Phone":
                    case "Home Phone":
                    case "Contact No":
                        column.Width = 100;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                    case "Parent Name":
                        column.Width = 120;
                        break;
                    case "NIC":
                        column.Width = 100;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                    case "Registration Date":
                        column.Width = 90;
                        column.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                        break;
                }

                // Set header style
                column.HeaderCell.Style.BackColor = Color.FromArgb(46, 134, 171);
                column.HeaderCell.Style.ForeColor = Color.White;
                column.HeaderCell.Style.Font = new Font("Times New Roman", 9F, FontStyle.Bold);
                column.HeaderCell.Style.Alignment = DataGridViewContentAlignment.MiddleCenter;
            }

            // Set alternating row colors
            dataGridViewStudents.AlternatingRowsDefaultCellStyle.BackColor = Color.FromArgb(248, 248, 248);
            dataGridViewStudents.RowsDefaultCellStyle.BackColor = Color.White;
            dataGridViewStudents.RowsDefaultCellStyle.SelectionBackColor = Color.FromArgb(173, 216, 230);
            dataGridViewStudents.RowsDefaultCellStyle.SelectionForeColor = Color.Black;
        }

        /// <summary>
        /// Updates the status label with record count information.
        /// </summary>
        private void UpdateStatusLabel(int recordCount, string additionalInfo = "")
        {
            string statusText = $"Total records: {recordCount}";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                statusText = $"{additionalInfo} - {statusText}";
            }
            labelStatus.Text = statusText;
        }

        /// <summary>
        /// Shows the Quiz form.
        /// </summary>
        public void ShowQuizForm()
        {
            var quizForm = new QuizForm();
            quizForm.ShowDialog();
        }

        /// <summary>
        /// Shows the About form.
        /// </summary>
        public void ShowAboutForm()
        {
            var aboutForm = new AboutForm();
            aboutForm.ShowDialog();
        }
    }
}