module.exports = {
    welcome: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Job Seeker', callback_data: 'job_seeker' }],
                [{ text: 'Employer', callback_data: 'employer' }]
            ]
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
    edit_employer_profile: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Post a Job', callback_data: 'new_job' }],
                [{ text: 'My Jobs', callback_data: 'my_jobs' }],
                [{ text: 'Edit Profile', callback_data: 'edit_employer_profile' }],
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
    browse_jobs: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Previous', callback_data: 'previous' }, { text: 'Next', callback_data: 'next' }],
                [{ text: 'Edit Job', callback_data: 'edit_job' }],
                [{ text: 'Applicants', callback_data: 'applicants' }],
                [{ text: 'Show Details', callback_data: 'detail_job' }],
                [{ text: 'Close Job', callback_data: 'close_job' }],
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
                [{ text: 'Show Posted Jobs', callback_data: 'admin_posted' }]
            ]
        })
    },
    login: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Login', callback_data: 'login' }],
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
    reject_job_reason: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Give a reason', callback_data: 'reject_reason' }]
            ]
        })
    },
};