module.exports = {
    welcome: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Job Seeker'],
                    ['Employer'],
                ],
                resize_keyboard: true
            }
        }
    },
    job_seeker: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Applied Jobs', 'Edit Profile'],
                    ['View Profile', 'Feedback'],
                ],
                resize_keyboard: true
            }
        }
    },
    employer: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Post a Job', 'Pending Jobs'],
                    ['Active Jobs', 'Closed Jobs'],
                    ['Edit Profile.', 'Feedback'],
                ],
                resize_keyboard: true
            }
        }
    },
    admin: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Pending Jobs Admin'],
                    ['Active Jobs Admin'],
                    ['Closed Jobs Admin'],
                    ['Automated Replies', 'Customize Messages'],
                ],
                resize_keyboard: true
            }
        }
    },
    admin_operations: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['New Feedbacks'],
                    ['All Feedbacks'],
                ],
                resize_keyboard: true
            }
        }
    },
};