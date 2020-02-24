module.exports = {
    welcome: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDC54 Job Seeker', callback_data: 'job_seeker' }],
                [{ text: '\uD83D\uDCB8 Employer', callback_data: 'employer' }]
            ],
           
        }),
    },
    edit_employee_profile: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCF0 Browse Jobs', url: 'https://t.me/ethiopiacareers' }],
                [{ text: '\uD83D\uDD0E Search', callback_data: 'search_jobs' }]
            ]
        })
    },
    cancel_emp: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u274C Cancel', callback_data: 'cancel_emp' }],
            ]
        })
    },
    browse_applied_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_emp_applied' }, { text: '\u25C0 Next', callback_data: 'next_emp_applied' }],
                [{ text: '\uD83D\uDCCB Show Details', callback_data: 'detail_emp_applied_job' }],
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
    screening_answer_search: (id) => {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Yes', callback_data: 'yes.'+id }, { text: 'No', callback_data: 'no' }],
                ]
            })
        }
    },
    apply_for_job: (id) => {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '\u2705 Apply for Job', url: 'http://t.me/yesexamplebot?start=' + id }],
                ]
            })
        }
    },
    apply_for_job_search: (id) => {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '\u2705 Apply for Job', callback_data: '_applyforjob' + id }],
                ]
            })
        }
    },
    job_details: (jobs) => {
        let i = 1
        let temp = []
        jobs.forEach(element => {
            let entry = {}
            entry.text = i
            entry.callback_data = "_showjob" + element.id
            temp.push(entry)
        });
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    temp
                ]
            })
        }
    },
    apply_emp: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u2705 Apply for Job', callback_data: 'apply_for_job' }],
            ]
        })
    },
    applied_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCCB View Applied Jobs', callback_data: 'applied_jobs' }],
            ]
        })
    },
    edit_employer_profile: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCC4 Post a Job', callback_data: 'new_job' }],
                [{ text: '\uD83D\uDCBC My Jobs', callback_data: 'my_jobs' }]
            ]
        })
    },
    email_or_phone: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCE7 Email', callback_data: 'email' }, { text: '\uD83D\uDCF1 Phone', callback_data: 'phone' }],
                [{ text: '\u274C Cancel', callback_data: 'cancel_employer' }],
            ]
        })
    },
    cancel_employer: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u274C Cancel', callback_data: 'cancel_employer' }],
            ]
        })
    },
    browse_jobs: (reviewed) => {
        if (reviewed) {
            return {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: '\u25B6 Previous', callback_data: 'previous' }, { text: '\u25C0 Next', callback_data: 'next' }],
                        [{ text: '\uD83D\uDCD2 Pending', callback_data: 'pending_employer' }, { text: '\uD83D\uDCD7 Active', callback_data: 'active_employer' }, { text: '\uD83D\uDCD5 Closed', callback_data: 'closed_employer' }],
                        [{ text: '\uD83D\uDC65 Applicants', callback_data: 'applicants' }],
                        [{ text: '\uD83D\uDCCB Show Details', callback_data: 'detail_job' }],
                        [{ text: '\u274C Close Job', callback_data: 'close_job' }],
                    ]
                })
            }
        } else {
            return {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: '\u25B6 Previous', callback_data: 'previous' }, { text: '\u25C0 Next', callback_data: 'next' }],
                        [{ text: '\uD83D\uDCD2 Pending', callback_data: 'pending_employer' }, { text: '\uD83D\uDCD7 Active', callback_data: 'active_employer' }, { text: '\uD83D\uDCD5 Closed', callback_data: 'closed_employer' }],
                        [{ text: '\u270F Edit Job', callback_data: 'edit_job' }],
                        [{ text: '\uD83D\uDC65 Applicants', callback_data: 'applicants' }],
                        [{ text: '\uD83D\uDCCB Show Details', callback_data: 'detail_job' }],
                        [{ text: '\u274C Close Job', callback_data: 'close_job' }],
                    ]
                })
            }
        }
    },
    screening_question: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'telegram', callback_data: 'telegram_method' }, { text: 'email', callback_data: 'email_method' }, { text: 'phone', callback_data: 'phone_method' }],
                [{ text: '\u2754 Add a pre-screening question', callback_data: 'add_screening_question' }],
            ]
        })
    },
    browse_applicants: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_app' }, { text: '\u25C0 Next', callback_data: 'next_app' }],
                [{ text: '\uD83D\uDCC1 Download CV', callback_data: 'get_cv' }]
            ]
        })
    },
    download_applicant_cv: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCC1 Download CV', callback_data: 'get_applicant_cv' }]
            ]
        })
    },
    admin: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83D\uDCD2 Show Pending Requests', callback_data: 'admin_pending' }],
                [{ text: '\uD83D\uDCD7 Show Active Jobs', callback_data: 'admin_posted' }],
                [{ text: '\uD83D\uDCD5 Show Closed Jobs', callback_data: 'admin_closed' }],
                [{ text: '\uD83D\uDCE4 Automatic Replies', callback_data: 'automatic_replies' }, { text: '\u2709: Customize Messages', callback_data: 'customize_messages' }],
            ]
        })
    },
    custom_options: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_message' }, { text: '\u25C0 Next', callback_data: 'next_message' }],
                [{ text: '\u270F Edit', callback_data: 'edit_message' }]
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
                [{ text: '\u25B6 Previous', callback_data: 'previous_feedback' }, { text: '\u25C0 Next', callback_data: 'next_feedback' }],
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
                [{ text: '\u274C Cancel', callback_data: 'cancel_admin' }],
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
                [{ text: '\u25B6 Previous', callback_data: 'previous_pending' }, { text: '\u25C0 Next', callback_data: 'next_pending' }],
                [{ text: '\u2705 Accept', callback_data: 'accept_pending' }],
                [{ text: '\u274C Decline', callback_data: 'reject_pending' }]
            ]
        })
    },
    browse_active_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_active' }, { text: '\u25C0 Next', callback_data: 'next_active' }],
                [{ text: '\u274C Close Job', callback_data: 'close_job_active' }],
                [{ text: '\uD83D\uDCCB Show Details', callback_data: 'detail_job_active' }]
            ]
        })
    },
    browse_closed_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_active' }, { text: '\u25C0 Next', callback_data: 'next_active' }],
                [{ text: '\uD83D\uDCCB Show Details', callback_data: 'detail_job_active' }]
            ]
        })
    },
    reject_job_reason: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: ':speech_balloon: Give a reason', callback_data: 'reject_reason' }]
            ]
        })
    },
    manage_replies: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\u25B6 Previous', callback_data: 'previous_reply' }, { text: '\u25C0 Next', callback_data: 'next_reply' }],
                [{ text: '\uD83C\uDD95 Add a reply', callback_data: 'add_reply' }],
                [{ text: '\u274C Delete', callback_data: 'delete_reply' }]
            ]
        })
    },
    add_replies: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '\uD83C\uDD95 Add a reply', callback_data: 'add_reply' }],
            ]
        })
    },
};