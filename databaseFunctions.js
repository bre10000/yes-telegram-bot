const property = 'data'
let ctx

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
    setCommandEmployer: function(ctx, index, command, id) {
        let temp = ctx[property + 'DB'].get('employers').value()[index]
        if (!temp) {
            return
        }
        temp.command = command
        temp.jobid = id
        ctx[property + 'DB'].get('employers').splice(index, 1).write()
        ctx[property + 'DB'].get('employers').push(temp).write()
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
                let job = ctx[property + 'DB'].get('jobs').value()[i]
                let temp = true
                for (var j = 0; j < job.applicants.length; j++) {
                    if (job.applicants[j] == ctx.from.id)
                        temp = false
                }
                if (temp)
                    job.applicants.push(ctx.from.id)
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
    getActiveJobs: function(ctx) {
        let temp = []

        for (var i = 0; i < ctx[property + 'DB'].get('jobs').value().length; i++) {
            let job = ctx[property + 'DB'].get('jobs').value()[i]
            if (job.userid == ctx.from.id && !job.closed) {
                temp.push(job)
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
    setPostingJobPageAdmin: function(ctx, index, pageNo, jobs) {
        let temp = ctx[property + 'DB'].get('users').value()[index]
        temp.jobsPostingPage = pageNo
        if (jobs != null)
            temp.postingJobs = jobs
        ctx[property + 'DB'].get('users').splice(index, 1).write()
        ctx[property + 'DB'].get('users').push(temp).write()
    },

};