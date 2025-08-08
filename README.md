# Skills International School - Quiz System

## Overview

A comprehensive C# Windows Forms application for Skills International School featuring student registration, quiz management, and administrative functions.

## System Requirements

- **Operating System**: Windows 10/11 or Windows Server 2019/2022
- **Framework**: .NET 6.0 or higher
- **Database**: Microsoft SQL Server (2016 or later) or SQL Server Express
- **IDE**: Visual Studio 2022 (recommended) or Visual Studio Code with C# extension

## Project Structure

```
├── Forms/
│   ├── LoginForm.cs              # Main login interface (400x300px)
│   ├── RegistrationForm.cs       # Student registration (800x700px)
│   ├── QuizForm.cs               # Quiz system (800x600px)
│   ├── StudentDetailsForm.cs     # Student management (900x600px)
│   └── AboutForm.cs              # Help/About dialog (600x500px)
├── Classes/
│   ├── DatabaseHelper.cs         # Database operations
│   ├── Student.cs                # Student model
│   ├── Question.cs               # Quiz question model
│   └── QuizResult.cs             # Quiz result model
├── Resources/
│   └── icons/                    # Application icons and images
├── SQL/
│   └── DatabaseSetup.sql         # Database initialization script
├── Program.cs                    # Application entry point
├── SkillsInternationalSchool.csproj
└── SkillsInternationalSchool.sln
```

## Database Setup

1. **Install SQL Server** (Express edition is sufficient)
2. **Create Database**: Run the SQL script to set up the database and tables
   ```bash
   sqlcmd -S .\SQLEXPRESS -i "SQL/DatabaseSetup.sql"
   ```
3. **Verify Connection**: Update connection string in `DatabaseHelper.cs` if needed:
   ```csharp
   connectionString = "Server=.;Database=Student;Integrated Security=true;";
   ```

## Build Instructions

### Using Visual Studio
1. Open `SkillsInternationalSchool.sln`
2. Restore NuGet packages (Build → Restore NuGet Packages)
3. Build solution (Build → Build Solution or Ctrl+Shift+B)
4. Run the application (Debug → Start or F5)

### Using Command Line
```bash
# Navigate to project directory
cd /path/to/SkillsInternationalSchool

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

## Features

### 1. Login System
- **Default Credentials**: 
  - Admin: `Admin` / `Skills@123`
  - Teacher: `teacher` / `teacher123`
- **Form Size**: 400x300 pixels
- **Security**: Database-authenticated login
- **Functions**: Clear fields, Exit confirmation

### 2. Student Registration
- **Form Size**: 800x700 pixels
- **Database Integration**: SQL Server with Registration table
- **Fields**: Complete student information (13 labels, 9 textboxes)
- **Functions**: Register, Update, Clear, Delete
- **Navigation**: Logout, Exit links

### 3. Quiz System
- **Form Size**: 800x600 pixels
- **Features**: 
  - 10 randomized questions from database
  - 10-minute countdown timer
  - Real-time scoring
  - Progress tracking
  - Result storage
- **Navigation**: Previous, Next, Submit buttons

### 4. Student Details View
- **Form Size**: 900x600 pixels
- **Functions**:
  - Search by Registration No or Name
  - Export to CSV format
  - Refresh data
  - Status display with record count
- **UI**: DataGridView with formatted columns

### 5. About/Help System
- **Form Size**: 600x500 pixels
- **Content**:
  - School information
  - Project details
  - Usage instructions
  - System information

## Database Schema

### Tables
- **Registration**: Student information storage
- **Logins**: User authentication
- **Questions**: Quiz question bank
- **QuizResults**: Quiz scores and history

### Sample Data
- Pre-loaded with sample questions across multiple subjects
- Default login credentials
- Sample student records for testing

## Color Scheme
- **Primary**: #2E86AB (Blue)
- **Secondary**: #A23B72 (Purple) 
- **Accent**: #F18F01 (Orange)
- **Background**: #F5F5F5 (Light Gray)

## Font Standards
- **Headers**: Times New Roman, 16pt, Bold
- **Labels**: Times New Roman, 12pt
- **Text**: Times New Roman, 10pt

## Usage Instructions

1. **Start Application**: Run the executable or press F5 in Visual Studio
2. **Login**: Use provided credentials to access the system
3. **Register Students**: Add new student information through registration form
4. **Take Quiz**: Access quiz system with timer and scoring
5. **View Details**: Browse and search student records
6. **Export Data**: Generate CSV reports of student information

## Error Handling

- Comprehensive try-catch blocks for database operations
- Input validation on all forms
- User-friendly error messages
- Connection testing and recovery

## Security Features

- Parameterized SQL queries (SQL injection prevention)
- Input sanitization
- Session management
- User role validation

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify SQL Server is running
   - Check connection string in DatabaseHelper.cs
   - Ensure database exists and tables are created

2. **Build Errors**
   - Restore NuGet packages
   - Check .NET version compatibility
   - Verify all references are resolved

3. **Quiz Not Loading**
   - Check if Questions table has data
   - Verify database connection
   - Run DatabaseSetup.sql to populate sample questions

4. **Forms Not Displaying Correctly**
   - Check screen resolution settings
   - Verify Windows Forms runtime is installed
   - Update display scaling if necessary

## Development Notes

- **Architecture**: Windows Forms with SQL Server backend
- **Data Access**: ADO.NET with Microsoft.Data.SqlClient
- **UI Framework**: Windows Forms with custom styling
- **Testing**: Manual testing recommended on Windows environment

## License

This project is developed for educational purposes for Skills International School.

## Support

For technical support or questions:
- Check the About/Help form (F1 key)
- Review usage instructions
- Contact system administrator

---

**Note**: This application is designed specifically for Windows environments and requires appropriate Windows Forms runtime support.