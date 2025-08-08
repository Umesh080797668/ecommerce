using System;
using System.Windows.Forms;
using SkillsInternationalSchool.Forms;

namespace SkillsInternationalSchool
{
    /// <summary>
    /// The main entry point for the Skills International School Quiz System application.
    /// </summary>
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // Enable visual styles and set high DPI support
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.SetHighDpiMode(HighDpiMode.SystemAware);

            try
            {
                // Start the application with the Login form
                Application.Run(new LoginForm());
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An unexpected error occurred: {ex.Message}", 
                    "Application Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}