# Skills International School - Form Designs Documentation

## Form Layout Specifications

### 1. LoginForm.cs (400x300px)

```
┌─────────────────────────────────────────┐
│               Login Form                │
│                                         │
│          [School Logo 100x80]          │
│                                         │
│    ┌─── Login ─────────────────────┐    │
│    │  Skills International        │    │
│    │                               │    │
│    │  Username: [______________]   │    │
│    │  Password: [______________]   │    │
│    │                               │    │
│    │  [Clear] [Login] [Exit]       │    │
│    │   80x30   80x30   80x30       │    │
│    └───────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- PictureBox (School Logo): 100x80px, top center
- GroupBox "Login": 300x180px, center positioned
- Username/Password TextBoxes with validation
- Password field uses PasswordChar = '*'
- Three buttons: Clear, Login, Exit (80x30px each)
- Database authentication with Admin/Skills@123

### 2. RegistrationForm.cs (800x700px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Student Registration                               │
│                                                                             │
│  ┌─── Student Registration ─────────────────────────────────────────────┐  │
│  │  Registration No: [Dropdown ▼]                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─── Basic Details ─────────────────────────────────────────────────────┐  │
│  │  First Name: [____________]    Last Name: [____________]              │  │
│  │  Date of Birth: [Date Picker]  Gender: ○ Male ○ Female               │  │
│  │  Address: [________________________________]                         │  │
│  │           [________________________________]                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─── Contact Details ──────────────────────────────────────────────────┐  │
│  │  Email: [___________________]    Mobile Phone: [____________]         │  │
│  │  Home Phone: [____________]                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─── Parent Details ───────────────────────────────────────────────────┐  │
│  │  Parent Name: [_______________]    NIC: [____________]                │  │
│  │  Contact No: [____________]                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│    [Register] [Update] [Clear] [Delete]               [Logout] [Exit]      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- 4 GroupBoxes with organized sections
- 13 Labels and 9 TextBoxes (Address as multiline)
- ComboBox for Registration No selection
- DateTimePicker for Date of Birth
- Radio Buttons for Gender selection
- CRUD operations (Create, Read, Update, Delete)
- LinkLabels for navigation

### 3. QuizForm.cs (800x600px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Quiz System                                     │
│                                                                             │
│  Time: 09:45        [Progress Bar ████████░░]        Score: 5/10           │
│                                                                             │
│                                                                             │
│                        Question 3: What is...?                             │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │  ○ A) Option A text here                                            │  │
│    │                                                                     │  │
│    │  ○ B) Option B text here                                            │  │
│    │                                                                     │  │
│    │  ● C) Option C text here (selected)                                 │  │
│    │                                                                     │  │
│    │  ○ D) Option D text here                                            │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                                                             │
│                 [Previous]    [Next]    [Submit]                           │
│                  100x35      100x35     100x35                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Title Label: 24pt, bold, centered
- Timer Label: 10-minute countdown, top left
- Score Label: Real-time scoring, top right
- Progress Bar: Shows question progression
- Question Label: 14pt, centered display
- 4 Radio Buttons: 12pt, vertical layout, 30px spacing
- Navigation Buttons: Previous, Next, Submit (100x35px)
- Auto-submit when time expires

### 4. StudentDetailsForm.cs (900x600px)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                        Student Details Management                                 │
│                                                                                   │
│  Search: [________________________] [Search]                                     │
│                                                                                   │
│  ┌─── Student Records ─────────────────────────────────────────────────────────┐  │
│  │ Reg│First    │Last     │DOB      │Gender│Email           │Mobile    │...    │  │
│  │ No │Name     │Name     │         │      │                │Phone     │       │  │
│  ├────┼─────────┼─────────┼─────────┼──────┼────────────────┼──────────┼───────┤  │
│  │001 │John     │Doe      │15/03/05 │Male  │john@email.com  │1234567890│...    │  │
│  │002 │Jane     │Smith    │22/07/04 │Female│jane@email.com  │9876543210│...    │  │
│  │003 │Mike     │Johnson  │08/11/05 │Male  │mike@email.com  │1111111111│...    │  │
│  │... │...      │...      │...      │...   │...             │...       │...    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│  Status: Total records: 25                    [Refresh] [Export CSV] [Close]     │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Search TextBox with Search Button
- DataGridView with formatted columns and alternating row colors
- Real-time search by Registration No or Name
- Export to CSV functionality
- Status Label showing record count
- Refresh and Close buttons

### 5. AboutForm.cs (600x500px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │  [Logo]  Skills International School                               │ │
│ │          Comprehensive Quiz System - Educational Excellence         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─── Project Details ─────────────────────────────────────────────────┐ │
│ │  System Name: Skills International School Quiz System              │ │
│ │  Version: 1.0.0                                                    │ │
│ │  Platform: Windows Forms (.NET 6.0)                               │ │
│ │  Database: Microsoft SQL Server                                    │ │
│ │  Purpose: Comprehensive student management and quiz system         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─── Usage Instructions ──────────────────────────────────────────────┐ │
│ │  SYSTEM USAGE GUIDE                                                │ │
│ │                                                                    │ │
│ │  1. LOGIN SYSTEM                                                   │ │
│ │     • Use 'Admin' / 'Skills@123' to access the system             │ │
│ │     • Click 'Clear' to reset login fields                         │ │
│ │                                                                    │ │
│ │  2. STUDENT REGISTRATION                                           │ │
│ │     • Fill in all required student details                        │ │
│ │     • Use 'Register' to add new students                          │ │
│ │     • Select registration number to view/edit existing students   │ │
│ │                                                                    │ │
│ │  3. QUIZ SYSTEM                                                    │ │
│ │     • Quiz contains 10 randomly selected questions                │ │
│ │     • Time limit: 10 minutes                                      │ │
│ │     • Use 'Previous' and 'Next' to navigate questions             │ │
│ │     ... (more instructions)                                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                                                        [Close]          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Header Panel with school branding
- Project Details section with system information
- Rich text instructions with formatted sections
- Comprehensive usage guide
- Close button and keyboard shortcuts

## Color Scheme

- **Primary Blue**: #2E86AB (46, 134, 171) - Headers, primary buttons
- **Secondary Purple**: #A23B72 (162, 59, 114) - Accent elements, secondary buttons  
- **Accent Orange**: #F18F01 (241, 143, 1) - Warning buttons, highlights
- **Background Gray**: #F5F5F5 (245, 245, 245) - Form backgrounds

## Typography

- **Headers**: Times New Roman, 16pt, Bold
- **Labels**: Times New Roman, 12pt, Regular
- **Input Text**: Times New Roman, 10pt, Regular
- **Buttons**: Times New Roman, 10-11pt, Bold

## Navigation Flow

```
Login Form
    ↓ (Successful Login)
Registration Form ←→ Quiz Form ←→ Student Details Form ←→ About Form
    ↓ (Logout)        ↓ (Direct)      ↓ (Menu)           ↓ (Help)
Login Form      Registration Form  Registration Form   Any Form
```

All forms include proper error handling, input validation, and database integration as specified in the requirements.