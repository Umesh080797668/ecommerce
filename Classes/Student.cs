using System;

namespace SkillsInternationalSchool.Classes
{
    /// <summary>
    /// Represents a student in the system.
    /// </summary>
    public class Student
    {
        /// <summary>
        /// Gets or sets the registration number.
        /// </summary>
        public int RegNo { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the date of birth.
        /// </summary>
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// Gets or sets the gender.
        /// </summary>
        public string Gender { get; set; }

        /// <summary>
        /// Gets or sets the address.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Gets or sets the email address.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the mobile phone number.
        /// </summary>
        public long MobilePhone { get; set; }

        /// <summary>
        /// Gets or sets the home phone number.
        /// </summary>
        public long HomePhone { get; set; }

        /// <summary>
        /// Gets or sets the parent's name.
        /// </summary>
        public string ParentName { get; set; }

        /// <summary>
        /// Gets or sets the National Identity Card number.
        /// </summary>
        public string NIC { get; set; }

        /// <summary>
        /// Gets or sets the contact number.
        /// </summary>
        public long ContactNo { get; set; }

        /// <summary>
        /// Gets the full name of the student.
        /// </summary>
        public string FullName => $"{FirstName} {LastName}";

        /// <summary>
        /// Initializes a new instance of the Student class.
        /// </summary>
        public Student()
        {
            FirstName = string.Empty;
            LastName = string.Empty;
            Gender = string.Empty;
            Address = string.Empty;
            Email = string.Empty;
            ParentName = string.Empty;
            NIC = string.Empty;
        }

        /// <summary>
        /// Validates the student data.
        /// </summary>
        /// <returns>True if all required fields are valid, false otherwise.</returns>
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(FirstName) &&
                   !string.IsNullOrWhiteSpace(LastName) &&
                   !string.IsNullOrWhiteSpace(Gender) &&
                   !string.IsNullOrWhiteSpace(Address) &&
                   !string.IsNullOrWhiteSpace(Email) &&
                   MobilePhone > 0 &&
                   !string.IsNullOrWhiteSpace(ParentName) &&
                   !string.IsNullOrWhiteSpace(NIC);
        }
    }
}