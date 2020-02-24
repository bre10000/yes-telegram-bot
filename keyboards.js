module.exports = {
    welcome: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['\uD83D\uDC54 Job Seeker'],
                    ['\uD83D\uDCB8 Employer'],
                ],
                resize_keyboard: true,
            }
        }
    },
    job_seeker: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Menu of Services'],
                    ['\uD83D\uDD0E Search Jobs', '\uD83D\uDCBC Applied Jobs'],
                    ['\uD83D\uDC64 Profile', '\uD83D\uDCE8 Feedback', '\uD83C\uDFC1 I\'m done'],
                ],
                resize_keyboard: true,
            }
        }
    },
    employer: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Menu of Services'],
                    ['\uD83D\uDCC4 Post a Job', '\uD83D\uDC64 Profile'],
                    ['\uD83D\uDCD2 Pending Jobs', '\uD83D\uDCD7 Active Jobs', '\uD83D\uDCD5 Closed Jobs'],
                    ['\uD83D\uDCE8 Feedback', '\uD83C\uDFC1 I\'m done'],
                ],
                resize_keyboard: true
            }
        }
    },
    admin: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['\uD83D\uDCD2 Pending Jobs Admin'],
                    ['\uD83D\uDCD7 Active Jobs Admin'],
                    ['\uD83D\uDCD5 Closed Jobs Admin'],
                    ['\uD83D\uDCE4 Automated Replies', '\u2709: Customize Messages'],
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
    profile: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Job Seeker.'],
                    ['Employer.'],
                    ['Back to Menu']
                ],
                resize_keyboard: true,
            }
        }
    },
    job_seeker_profile: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['View Profile'],
                    ['Edit Profile'],
                    ['Back to Menu']
                ],
                resize_keyboard: true,
            }
        }
    },
    job_seeker_edit: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Name', 'Email'],
                    ['Phone', 'CV'],
                    ['Back to Menu']
                ],
                resize_keyboard: true,
            }
        }
    },
    employer_profile: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['View Profile.'],
                    ['Edit Profile'],
                    ['Back to Menu']
                ],
                resize_keyboard: true,
            }
        }
    },
    employer_edit: () => {
        return {
            reply_markup: {
                keyboard: [
                    ['Name', 'Email', 'Phone'],
                    ['Back to Menu']
                ],
                resize_keyboard: true,
            }
        }
    },
    category_keys: (categories) => {
        let temp = []
        categories.forEach(element => {
            temp.push([element])
        })
        return {
            reply_markup: {
                keyboard: temp,
                resize_keyboard: true
            }
        }
    },
};