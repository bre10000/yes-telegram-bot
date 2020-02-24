const property = 'data'
let ctx
const buttons = require('./buttons');

module.exports = {
    // ----------------------------------------------------- Employee
    resetItem: function(ctx, index) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.command = ''
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    getEmployee(ctx, index) {
        return ctx[property + 'DB'].get('employees').value()[index]
    },
    getApplicant: function(ctx, id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('employees').value().length; i++) {
            if (ctx[property + 'DB'].get('employees').value()[i].id == id) {
                let employee = ctx[property + 'DB'].get('employees').value()[i]
                employee.index = i
                return employee
            }
        }

        return index
    },
    setCommand: function(ctx, index, command) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        if (!temp) {
            return
        }
        temp.command = command
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    setApplyJob: function(ctx, index, job) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.apply = job
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    setName: function(ctx, index, name) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.name = name
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    setPhone: function(ctx, index, phone) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.phone = phone
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    setEmail: function(ctx, index, email) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.email = email
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    setCV: function(ctx, index, cv) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.command = ''
        temp.cv = cv
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    findIndex: function(ctx, id) {
        let index
        for (var i = 0; i < ctx[property + 'DB'].get('employees').value().length; i++) {
            if (ctx[property + 'DB'].get('employees').value()[i].id == id) {
                index = i
            }
        }

        return index
    },
    setAppliedPageEmp: function(ctx, index, pageNo) {
        let temp = ctx[property + 'DB'].get('employees').value()[index]
        temp.applied_page = pageNo
        ctx[property + 'DB'].get('employees').splice(index, 1).write()
        ctx[property + 'DB'].get('employees').push(temp).write()
    },
    // ----------------------------------------------------- User
    getUser: function(ctx) {
        let users = ctx[property + 'DB'].get('users').value()
        for (var i = 0; i < users.length; i++) {
            if (users[i].userid == ctx.from.id) {
                let user = users[i]
                user.index = i
                return user
            }
        }
        return null
    },
    setCommandUser: function(ctx, index, command) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        if (!temp) {
            return
        }
        temp.command = command
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    logInAdmin: function(ctx, index) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.type = 'admin'
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    logInAdminOperations: function(ctx, index) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.type = 'admin_operations'
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    logOutAdmin: function(ctx, index) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.type = null
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    resetUser: function(ctx, index, user) {
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(user).write()
    },
    // --------------------------------------------------- Employer
    setNameEmployer: function(ctx, index, name) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        temp.name = name
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    setPhoneEmployer: function(ctx, index, phone) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        temp.phone = phone
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    setEmailEmployer: function(ctx, index, email) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        temp.email = email
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },

    findEmployer: function(ctx, id) {
        let index
        for (var i = 0; i < ctx[property + 'DB'].get('employers').value().length; i++) {
            if (ctx[property + 'DB'].get('employers').value()[i].id == id) {
                index = i
            }
        }
        return index
    },
    getEmployer(ctx, index) {
        return ctx[property + 'DB'].get('employers').value()[index]
    },
    setCommandEmployer: function(ctx, index, command, id) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        if (!temp) {
            return
        }
        temp.command = command
        if( id != null ){
            temp.jobid = id
        }
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    setApplicationMethodEmployer: function(ctx, id, method) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.application_method = method
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    setApplicantEmployer: function(ctx, index, applicant) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        if (!temp) {
            return
        }
        temp.applicant_cv = applicant
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    // ----------------------------------------- Job
    setJobPage: function(ctx, index, pageNo, jobs) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        temp.jobsPage = pageNo
        if (jobs != null)
            temp.jobs = jobs
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    setApplicantPage: function(ctx, index, pageNo, applicants) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        temp.applicant = pageNo
        if (applicants != null)
            temp.applicants = applicants
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
    },
    setJobName: function(ctx, id, name) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.title = name
                job.edited = true
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    closeJob: function(ctx, id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.closed = true
                if (job.reviewed && job.applicants.length > 0){
                    job.applicants.forEach(element => {
                        let emp = this.getApplicant(ctx, element)
                        ctx.telegram.sendMessage(emp.chatId, job.title + " has been closed.")
                    });
                }
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    acceptJob: function(ctx, id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.reviewed = true
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    applyForJob: function(ctx, id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let emp = this.getApplicant(ctx, ctx.from.id)

                let job = ctx[property + 'DB'].get('jobs').value()[i]
                let temp = true
                for (var j = 0; j < job.applicants.length; j++) {
                    if (job.applicants[j] == ctx.from.id)
                        temp = false
                }
                if (temp){
                    job.applicants.push(ctx.from.id)
                    if(job.application_method == 'telegram')
                        job.chatId ? ctx.telegram.sendMessage(job.chatId, 'New Applicant \n' + emp.name + '\nPhone and Email - ' + emp.phone + ', ' + emp.email, buttons.download_applicant_cv).then() : false
                    if(emp.appliedJobs == null)
                        emp.appliedJobs = []
                    emp.appliedJobs.push(id)
                    ctx[property + 'DB'].get('employees').splice(emp.index, 1).write()
                    ctx[property + 'DB'].get('employees').push(emp).write()
                }
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    closeJobAdmin: function(ctx, id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.closed = true
                let user = this.getUser(ctx)

                user.rejectedJob = job
                ctx[property + 'DB'].get('users').splice(user.index, 1).write()
                ctx[property + 'DB'].get('users').push(user).write()

                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    setJobCategory: function(ctx, id, category) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.category = category
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    setJobDescription: function(ctx, id, description) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.description = description
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    setJobScreeiningQuestion: function(ctx, id, question) {
        let index
        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.question = question
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    setJobChannelMessage: function(ctx, id, message_id) {
        let index

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.message_id = message_id
                ctx[property + 'DB'].get('jobs').splice(i, 1).write()
                ctx[property + 'DB'].get('jobs').push(job).write()
            }
        }

        return index
    },
    getJob: function(ctx, id) {
        let index
        
        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            if (ctx[property + 'DB'].get('jobs').value()[i].id == id) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                job.index = i
                return job
            }
        }

        return index
    },
    getActiveJobs: function(ctx, type) {
        let temp = []
        if (type == 'pending'){
            for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                if (job.userid == ctx.from.id && !job.closed && !job.reviewed) {
                    temp.push(job)
                }
            }
        } else if (type == 'active'){
            for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                if (job.userid == ctx.from.id && !job.closed && job.reviewed) {
                    temp.push(job)
                }
            }
        } else if (type == 'closed'){
           for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                if (job.userid == ctx.from.id && job.closed) {
                    temp.push(job)
                }
            }
        }


        return temp
    },
    // ------------------------------ admin
    getPendingJobs: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (job.userid == ctx.from.id && !job.closed) {
                temp.push(job)
            }
        }

        return temp
    },
    getPendingJobsAdmin: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (!job.reviewed && !job.closed) {
                temp.push(job)
            }
        }

        return temp
    },
    setPendingJobPageAdmin: function(ctx, index, pageNo, jobs) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.jobsPendingPage = pageNo
        if (jobs != null)
            temp.pendingJobs = jobs
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    getPostedJobs: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (job.active && job.reviewed && !job.closed) {
                temp.push(job)
            }
        }

        return temp
    },
    getClosedJobs: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (job.reviewed && job.closed) {
                temp.push(job)
            }
        }

        return temp
    },
    setPostingJobPageAdmin: function(ctx, index, pageNo, jobs) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.jobsPostingPage = pageNo
        if (jobs != null)
            temp.postingJobs = jobs
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    setReplyPageAdmin: function(ctx, index, pageNo) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.replyPage = pageNo
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    setMessagesPageAdmin: function(ctx, index, pageNo) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.messagePage = pageNo
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    setFeedbackPageAdmin: function(ctx, index, pageNo, feedbacks) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.feedbackPage = pageNo
        if(feedbacks != null)
            temp.feedbacks = feedbacks
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },
    getAdminReplies: function(ctx) {
        return ctx[property + 'DB'].get('adminReplies').value()
    },
    deleteAdminReplies: function(ctx, reply) {
        for (var i = 0; i < ctx[property + 'DB'].get('adminReplies').value().length; i++) {
    
            if (ctx[property + 'DB'].get('adminReplies').value()[i] == reply) {
                ctx[property + 'DB'].get('adminReplies').splice(i, 1).write()
            }
        }

    },
    saveFeedback: function(ctx, feedback) {
        ctx[property + 'DB'].get('feedbacks').push(feedback).write()
    },
    saveMessages: function(ctx, title, message) {
        let messages = ctx[property + 'DB'].get('customMessages').value()[0]
        messages[title] = message
        ctx[property + 'DB'].get('customMessages').pop().write()
        ctx[property + 'DB'].get('customMessages').push(messages).write()
    },
    getNewFeedbacks: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('feedbacks').value().length; i++) {
            let feedback = ctx[property + 'DB'].get('feedbacks').value()[i]
            if (!feedback.read) {
                temp.push(feedback)
            }
        }

        return temp
    },
    markFeedbackRead: function(ctx, id) {


        for (var i = 0; i < ctx[property + 'DB'].get('feedbacks').value().length; i++) {
            let feedback = ctx[property + 'DB'].get('feedbacks').value()[i]
            if (feedback.id == id) {
                feedback.read = true
                ctx[property + 'DB'].get('feedbacks').splice(i, 1).write()
                ctx[property + 'DB'].get('feedbacks').push(feedback).write()
            }
        }

        return
    },
    searchJobs: function(ctx, query) {
        query = query.toLowerCase()
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (job.reviewed && !job.closed && (job.title.toLowerCase().includes(query) || job.category.toLowerCase().includes(query))) {
                temp.push(job)
            }
        }

        return temp
    },
};