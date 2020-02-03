module.exports = {
    welcome: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Job Seeker', callback_data: 'job_seeker' }],
                [{ text: 'Employer', callback_data: 'employer' }]
            ],
        })
    },
    edit_employee_profile: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Browse Jobs', url: 'https://t.me/metestmechannel' }],
                [{ text: 'Edit Profile', callback_data: 'edit_emp_profile' }],
                [{ text: 'View Profile', callback_data: 'view_emp_profile' }],
            ]
        })
    },
    cancel_emp: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Cancel', callback_data: 'cancel_emp' }],
            ]
        })
    },
    browse_applied_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_emp_applied' }, { text: 'Next', callback_data: 'next_emp_applied' }],
                [{ text: 'Show Details', callback_data: 'detail_emp_applied_job' }],
            ]
        })
    },
    screening_answer: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Yes', callback_data: 'yes' }, { text: 'No', callback_data: 'no' }],
            ]
        })
    },
    apply_for_job: (id) => {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Apply for Job', url: 'http://t.me/yesexamplebot?start=' + id }],
                ]
            })
        }
    },
    apply_emp: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Apply for Job', callback_data: 'apply_for_job' }],
            ]
        })
    },
    applied_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'View Applied Jobs', callback_data: 'applied_jobs' }],
            ]
        })
    },
    edit_employer_profile: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Post a Job', callback_data: 'new_job' }],
                [{ text: 'My Jobs', callback_data: 'my_jobs' }],
                [{ text: 'Edit Profile', callback_data: 'edit_employer_profile' }],
            ]
        })
    },
    email_or_phone: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Email', callback_data: 'email' }, { text: 'Phone', callback_data: 'phone' }],
                [{ text: 'Cancel', callback_data: 'cancel_employer' }],
            ]
        })
    },
    cancel_employer: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Cancel', callback_data: 'cancel_employer' }],
            ]
        })
    },
    browse_jobs: (reviewed) => {
        if (reviewed) {
            return {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Previous', callback_data: 'previous' }, { text: 'Next', callback_data: 'next' }],
                        [{ text: 'Pending', callback_data: 'pending_employer' }, { text: 'Active', callback_data: 'active_employer' }, { text: 'Closed', callback_data: 'closed_employer' }],
                        [{ text: 'Applicants', callback_data: 'applicants' }],
                        [{ text: 'Show Details', callback_data: 'detail_job' }],
                        [{ text: 'Close Job', callback_data: 'close_job' }],
                    ]
                })
            }
        } else {
            return {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Previous', callback_data: 'previous' }, { text: 'Next', callback_data: 'next' }],
                        [{ text: 'Pending', callback_data: 'pending_employer' }, { text: 'Active', callback_data: 'active_employer' }, { text: 'Closed', callback_data: 'closed_employer' }],
                        [{ text: 'Edit Job', callback_data: 'edit_job' }],
                        [{ text: 'Applicants', callback_data: 'applicants' }],
                        [{ text: 'Show Details', callback_data: 'detail_job' }],
                        [{ text: 'Close Job', callback_data: 'close_job' }],
                    ]
                })
            }
        }
    },
    screening_question: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Add a pre-screening question', callback_data: 'add_screening_question' }]
            ]
        })
    },
    browse_applicants: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_app' }, { text: 'Next', callback_data: 'next_app' }],
                [{ text: 'Download CV', callback_data: 'get_cv' }]
            ]
        })
    },
    download_applicant_cv: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Download CV', callback_data: 'get_applicant_cv' }]
            ]
        })
    },
    admin: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Show Pending Requests', callback_data: 'admin_pending' }],
                [{ text: 'Show Active Jobs', callback_data: 'admin_posted' }],
                [{ text: 'Show Closed Jobs', callback_data: 'admin_closed' }],
                [{ text: 'Automatic Replies', callback_data: 'automatic_replies' }, { text: 'Customize Messages', callback_data: 'customize_messages' }],
            ]
        })
    },
    custom_options: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_message' }, { text: 'Next', callback_data: 'next_message' }],
                [{ text: 'Edit', callback_data: 'edit_message' }]
            ]
        })
    },
    admin_operations: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'New Feedbacks', callback_data: 'new_feedbacks' }],
                [{ text: 'Feedbacks', callback_data: 'feedbacks' }],
            ]
        })
    },
    feedback_options: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_feedback' }, { text: 'Next', callback_data: 'next_feedback' }],
                // [{ text: 'Reply', callback_data: 'reply_feedback' }],
                [{ text: 'Mark as Read', callback_data: 'mark_as_read' }],
            ]
        })
    },
    login: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Login Technical', callback_data: 'login' }],
                [{ text: 'Login Operations', callback_data: 'login_operations' }],
            ]
        })
    },
    cancel_admin: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Cancel', callback_data: 'cancel_admin' }],
            ]
        })
    },
    reject_reason_buttons: (replies) => {
        return {
            reply_markup: {
                keyboard: [replies],
                resize_keyboard: true
            }
        }
    },
    browse_pending_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_pending' }, { text: 'Next', callback_data: 'next_pending' }],
                [{ text: 'Accept', callback_data: 'accept_pending' }],
                [{ text: 'Decline', callback_data: 'reject_pending' }]
            ]
        })
    },
    browse_active_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_active' }, { text: 'Next', callback_data: 'next_active' }],
                [{ text: 'Close Job', callback_data: 'close_job_active' }],
                [{ text: 'Show Details', callback_data: 'detail_job_active' }]
            ]
        })
    },
    browse_closed_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_active' }, { text: 'Next', callback_data: 'next_active' }],
                [{ text: 'Show Details', callback_data: 'detail_job_active' }]
            ]
        })
    },
    reject_job_reason: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Give a reason', callback_data: 'reject_reason' }]
            ]
        })
    },
    manage_replies: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous_reply' }, { text: 'Next', callback_data: 'next_reply' }],
                [{ text: 'Add a reply', callback_data: 'add_reply' }],
                [{ text: 'Delete', callback_data: 'delete_reply' }]
            ]
        })
    },
    add_replies: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Add a reply', callback_data: 'add_reply' }],
            ]
        })
    },
};