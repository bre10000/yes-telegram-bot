const LocalSession = require('telegraf-session-local')

module.exports = { 
    localSession : new LocalSession({
        // Database name/path, where sessions will be located (default: 'sessions.json')
        database: 'yes_db.json',
        // Name of session property object in Telegraf Context (default: 'session')
        property: 'session',
        // Type of lowdb storage (default: 'storageFileSync')
        storage: LocalSession.storageFileAsync,
        // Format of storage/database (default: JSON.stringify / JSON.parse)
        format: {
          serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
          deserialize: (str) => JSON.parse(str),
        },
        // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Telegraf Context
        state: { users: [], employees: [], employers: [], jobs: [], adminReplies: [], feedbacks: [], 
                 categories: ['Accounting, Finance, Business', 'Creative Arts & Design', 'Engineering & Manufacturing', 'Healthcare & Pharamcuticals', 'Hospitality & Events Management', 'Information Technology', 'Sales, Marketing & PR', 'Property & Construction', 'Human Resources & Adminstration', 'Transport & Logistics'],
                 customMessages: [
                  {
                    apply_confirm_question: 'Do you want to apply for ',
                    apply_successful: '*You have successfully applied to - *',
                    apply_fail: '*You are not qualified for this job *',
                    new_applicant: '*New Applicant*',
                    no_applicant_cv: 'Applicant has not uploaded CV',
                  
                    welcome_message_user: 'Welcome to the Yes.et job bot! \nRight Fit. Right Now. \n Are you an Employer or a Job Seeker?',
                    feedback: 'YES, we want to do even better! Let us know what would rock your bot ;) \n Bot Powered by YES',
                    feedback_negative: 'YES, we want to do even better! Let us know what would rock your bot ;) \n Bot Powered by YES',
                  
                    employee_edit: 'Profile Edit\nPlease Enter your First and Last name',
                    employee_cancel: 'Operation Canceled',
                    employee_applied_jobs: 'Applied Jobs',
                    employee_no_applied_jobs: 'You havent applied for any jobs.',
                  
                    employee_new_greeting: 'Hello ',
                    employee_new: 'Please Enter your First and Last name',
                    employee_phone: 'Enter your phone number',
                    employee_email: 'Enter your email address',
                    employee_upload_cv: 'Upload your CV as a file',
                    employee_registration_successfull: 'Upload Successful \n Thank you for Registering!',
                  
                    job_is_closed: 'This job is closed',
                    no_previous_page: 'No previous page',
                    no_next_page: 'No next page',
                    job_details: 'Job Details',
                    invalid_email: 'Your email address isn\'t valid. \nPlease try again',
                    invalid_phone: 'Your phone number isn\'t valid. \nPlease try again',
                  
                    employer_new: 'What is your Personal or Organization’s name?',
                    employer_email: 'Please enter your email address',
                    employer_contact_info: 'How would you like to be contacted \n (Choose email or phone)',
                    employer_phone: 'Please enter your phone number',
                    new_job_title: 'What is the Title of your job?',
                    job_description: 'Enter Job Description',
                    pre_screening_question: 'Enter your pre-screening question. \n your question should have a yes or no answer',
                    pre_screening_question_added: 'Pre-Screening question added successfully',
                    job_successfully_added: 'Job Successfully Added!\n Your job will be reviewed and posted, Thank you. \nChoose a method to be contacted by applicants, telegram is the default',
                    job_successfully_edited: 'Job Successfully Edited!\n Your job will be reviewed and posted as soon as possible. Thank you.',
                  
                    edit_job_title: 'Job Edit\nPlease Enter Job Title',
                    employer_successfull_registration: '*Thank you for Registering!*',
                    
                  
                    applicants: 'Applicants',
                    no_applicants: 'No Applicants for this Job :(',
                    employer_profile_edit: 'Profile Edit\nPlease Enter your Organization\'s name',
                    employer_cancel: 'Operation Canceled',
                    job_is_posted: 'Congrats! your job has been posted.',
                    job_rejected: 'Unfortunately your job  could not be posted.',
                  
                    job_is_posted: 'This job is posted. Applicants - ',
                    job_is_being_reviewed: 'This job is being reviewed',
                    no_pending_jobs: 'No pending job postings :( \n It\s really easy though. Let\'s get started :)',
                    no_active_jobs: 'No active job postings :( \n It\s really easy though. Let\'s get started :)',
                    no_closed_jobs: 'No closed job postings :(',
                  
                    new_user: 'Welcome new user! use /start to register.',
                    unknown_command: 'Command unrecognized! Please select options from the Menu',
                    file_error: 'File could not be saved',
                    
                    pending_jobs: '*Pending Jobs*',
                    active_jobs: '*Active Jobs*',
                    closed_jobs: '*Closed Jobs*',

                    user_logged_out: '*Bye! Hope I could Help a bit. See ya!*'
                  }
                 ]}
      })
};

