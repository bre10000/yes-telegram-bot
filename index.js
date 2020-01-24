'strict mode'

const Telegraf = require('telegraf')
const http = require('http');
const fs = require('fs');

const buttons = require('./buttons');
const dbCon = require('./databaseConnection');
const db = require('./databaseFunctions');

const app = new Telegraf('1030576944:AAEgABxuJs3dQTTEU7EMKhgYiemx9Vw8qyI')

const property = 'data'

const channel_id = "-1001394963347";


// Wait for database async initialization finished (storageFileAsync or your own asynchronous storage adapter)
dbCon.localSession.DB.then(DB => {
    // Database now initialized, so now you can retrieve anything you want from it
    // console.log('Current LocalSession DB:', DB.value())
    // console.log(DB.get('sessions').getById('1:1').value())
})

// Telegraf will use `telegraf-session-local` configured above middleware with overrided `property` name
app.use(dbCon.localSession.middleware(property))

app.command('start', (ctx) => {
    let user = db.getUser(ctx);
    if (user) {
        if (user.type == 'job_seeker') {
            let command = ctx.update.message.text.split(' ')[1]
            if (command) {
                var job = db.getJob(ctx, command)
                ctx.reply('Do you want to apply for ' + job.title + '?', buttons.apply_emp)
                let emp = db.getApplicant(ctx, ctx.from.id)
                db.setApplyJob(ctx, emp.index, job)
                return
            }
        }
    }
    // console.log(user)
    // if (user == null){

    // }else if (user.type == 'employer') {
    //     db.setCommandEmployer(ctx, user.index, '', null);
    // } else if (user.type == 'job_seeker') {
    //     db.setCommand(ctx, user.index, '');
    // }
    // user.type = null
    // user.command = '';
    // db.resetUser(ctx, user, user.index)

    ctx.telegram.sendMessage(
        ctx.from.id,
        'Welcome to the Yes.et job bot! \nRight Fit. Right Now. \n Are you an Employer or a Job Seeker?',
        buttons.welcome)
})
app.command('admin', (ctx) => {
    let user = db.getUser(ctx);

    if (user) {
        if (user.type == 'admin') {
            ctx.telegram.sendMessage(
                ctx.from.id,
                `Welcome to the Yes.et job bot! $user.name \nRight Fit. Right Now. \n ADMIN ACCOUNT`,
                buttons.admin)
        } else {
            ctx.telegram.sendMessage(
                ctx.from.id,
                'Welcome to the Yes.et job bot! \nRight Fit. Right Now. \n ADMIN ACCOUNT',
                buttons.login)
            db.logOutAdmin(ctx, user.index)
        }
    } else {
        user = {
            id: -1,
            command: '',
            name: '',
            email: '',
            phone: '',
            cv: '',

        };
        user.id = ctx.from.id;
        user.userid = ctx.from.id;
        user.type = null
        ctx[property + 'DB'].get('users').push(user).write()
    }

})
app.on('callback_query', (ctx) => {

    const action = ctx.update.callback_query.data;
    //--------------------------------------------------- Apply For a Job
    if (action === 'apply_for_job') {
        let index = db.findIndex(ctx, ctx.from.id)
        let job = ctx[property + 'DB'].get('employees').value()[index].apply
        let emp = db.getEmployee(ctx, index)
        ctx.reply('You have successfully applied to ' + job.title)
        db.applyForJob(ctx, job.id)
        let index_employer = db.findEmployer(ctx, job.userid)
        db.setApplicantEmployer(ctx, index_employer, ctx.from.id)
        job.chatId ? ctx.telegram.sendMessage(job.chatId, 'New Applicant \n' + emp.name + '\nPhone and Email - ' + emp.phone + ', ' + emp.email, buttons.download_applicant_cv).then() : false
        jobSeekerAction(ctx)
    }
    else if (action === 'get_applicant_cv') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let applicant = ctx[property + 'DB'].get('employers').value()[index].applicant_cv
        const msg = ctx.update.callback_query.message
        let emp = db.getApplicant(ctx, applicant)
        if (emp.cv != '') {
            ctx.telegram.sendDocument(msg.chat.id, emp.cv)
        } else {
            ctx.reply('Applicant has not uploaded CV')
        }
    } 
    // --------------------------------------------------- Job Seeker
    else if (action === 'job_seeker') {
        ctx.reply('Find the right job!')
        jobSeekerAction(ctx)
    } else if (action === 'edit_emp_profile') {
        let index = db.findIndex(ctx, ctx.from.id)

        ctx.reply('Profile Edit\nPlease Enter your First and Last name', buttons.cancel_emp)
        db.setCommand(ctx, index, 'name')
    } else if (action === 'view_emp_profile') {
        let index = db.findIndex(ctx, ctx.from.id)

        let emp = db.getEmployee(ctx, index)
        ctx.reply('Name: ' + emp.name + '\nEmail and Phone: ' + emp.email + ', ' + emp.phone)
    } else if (action === 'cancel_emp') {
        let index = db.findIndex(ctx, ctx.from.id)

        ctx.reply('Operation Canceled')
        jobSeekerAction(ctx, index)
    }

    // ---------------------------------------------------- Employer
    else if (action === 'employer') {
        ctx.reply('Find the right fit!')
        employerAction(ctx)
    } else if (action === 'new_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply('What is the Title of your job?', buttons.cancel_employer)
        db.setCommandEmployer(ctx, index, 'new_job_title', null)
    } else if (action === 'my_jobs') {
        let index = db.findEmployer(ctx, ctx.from.id)

        let jobs = db.getActiveJobs(ctx)
        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n This job is posted. Applicants - ' + jobs[0].applicants.length : '\n This job is being reviewed'
            ctx.reply('Your Jobs\n' + jobs[0].title + status, buttons.browse_jobs)
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply('No active jobs with this account :(\n')
            employerAction(ctx)
        }
    } else if (action === 'previous') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message

        if (page > 0) {
            let status = jobs[page - 1].reviewed ? '\n This job is posted. Applicants - ' + jobs[page - 1].applicants.length : '\n This job is being reviewed';
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page - 1].title + status, buttons.browse_jobs).then()
            db.setJobPage(ctx, index, page - 1, null)
        } else if (page == 0) {
            let status = jobs[page].reviewed ? '\n This job is posted. Applicants - ' + jobs[page].applicants.length : '\n This job is being reviewed';

            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + status + '\nNo Previous Page', buttons.browse_jobs)
        }

    } else if (action === 'next') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message
        if (page + 1 < jobs.length) {
            let status = jobs[page + 1].reviewed ? '\n This job is posted. Applicants - ' + jobs[page + 1].applicants.length : '\n This job is being reviewed'

            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page + 1].title + status, buttons.browse_jobs).then()
            db.setJobPage(ctx, index, page + 1, null)
        } else if (page + 1 == jobs.length) {
            let status = jobs[page].reviewed ? '\n This job is posted. Applicants - ' + jobs[page].applicants.length : '\n This job is being reviewed'

            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + status + '\nNo Next Page', buttons.browse_jobs)
        }
    } else if (action === 'edit_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage

        ctx.reply('Job Edit\nPlease Enter Job Title', buttons.cancel_employer)
        db.setCommandEmployer(ctx, index, 'edit_job_title', null)
    } else if (action === 'detail_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage

        ctx.reply('Job Details\n' + jobs[page].title + '\n' + jobs[page].description)
    } else if (action === 'close_job') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message
        let job = jobs[page]
        if (jobs.length > page) {
            db.closeJob(ctx, job.id)
            if (job.reviewed)
                app.telegram.editMessageText(264335782, job.message_id, null, job.title + '\nThis Job is Closed!')
            ctx.reply(job.title + ' Job Closed!')
            jobs = db.getActiveJobs(ctx)
            if (jobs.length > page + 1)
                db.setJobPage(ctx, index, page, jobs)
            else if (jobs.length > 0)
                db.setJobPage(ctx, index, page - 1, jobs)

        }

    } else if (action === 'applicants') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage

        if (jobs[page].applicants.length > 0) {
            let applicant = db.getApplicant(ctx, jobs[page].applicants[0])
            ctx.reply('Applicants \n' + applicant.name + '\n' + applicant.phone, buttons.browse_applicants)
            db.setApplicantPage(ctx, index, 0, jobs[page].applicants)
        } else {
            ctx.reply('No Applicants for this Job :(\n')
            employerAction(ctx)
        }
    } else if (action === 'previous_app') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let applicants = ctx[property + 'DB'].get('employers').value()[index].applicants
        let page = ctx[property + 'DB'].get('employers').value()[index].applicant
        const msg = ctx.update.callback_query.message


        if (page > 0) {
            let applicant = db.getApplicant(ctx, applicants[page - 1])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, 'Applicants \n' + applicant.name + '\n' + applicant.phone, buttons.browse_applicants)
            db.setApplicantPage(ctx, index, page - 1, null)
        } else {
            let applicant = db.getApplicant(ctx, applicants[page])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, 'Applicants \n' + applicant.name + '\n' + applicant.phone + '\n' + 'No previous page', buttons.browse_applicants)
        }
    } else if (action === 'next_app') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let applicants = ctx[property + 'DB'].get('employers').value()[index].applicants
        let page = ctx[property + 'DB'].get('employers').value()[index].applicant
        const msg = ctx.update.callback_query.message
        if (page + 1 < applicants.length) {
            let applicant = db.getApplicant(ctx, applicants[page + 1])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, 'Applicants \n' + applicant.name + '\n' + applicant.phone, buttons.browse_applicants)
            db.setApplicantPage(ctx, index, page + 1, null)
        } else {
            let applicant = db.getApplicant(ctx, applicants[page])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, 'Applicants \n' + applicant.name + '\n' + applicant.phone + '\n' + 'No next page', buttons.browse_applicants)
        }
    } else if (action === 'get_cv') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let applicants = ctx[property + 'DB'].get('employers').value()[index].applicants
        let page = ctx[property + 'DB'].get('employers').value()[index].applicant
        const msg = ctx.update.callback_query.message
        let emp = db.getApplicant(ctx, applicants[page])
        if (emp.cv != '') {
            ctx.telegram.sendDocument(msg.chat.id, emp.cv)
        } else {
            ctx.reply('Applicant has not uploaded CV')
        }
    } else if (action === 'edit_employer_profile') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply('Profile Edit\nPlease Enter your Organization\'s name', buttons.cancel_employer)
        db.setCommandEmployer(ctx, index, 'name_employer', null)
    } else if (action === 'cancel_employer') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply('Operation Canceled')
        employerAction(ctx)
    }

    // admin account --------------------------------------
    else if (action === 'login') {
        let user = db.getUser(ctx);

        ctx.reply('Enter Your Password', buttons.cancel_)
        db.setCommandUser(ctx, user.index, 'password')

    } else if (action === 'admin_pending') {
        // ------------------------------------------------- Pending
        let user = db.getUser(ctx);
        let jobs = db.getPendingJobsAdmin(ctx)
        if (jobs.length > 0) {
            ctx.reply('Pending Jobs\n' + jobs[0].title, buttons.browse_pending_jobs)
            db.setPendingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No active jobs with this account :(\n', buttons.admin)
        }

    } else if (action === 'previous_pending') {
        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
        const msg = ctx.update.callback_query.message

        if (page > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page - 1].title, buttons.browse_pending_jobs)
            db.setPendingJobPageAdmin(ctx, user.index, page - 1, null)
        } else if (page == 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + '\nNo Previous Page', buttons.browse_pending_jobs)
                // db.setPendingJobPageAdmin(ctx, user.index , page , null)
        }

    } else if (action === 'next_pending') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
        const msg = ctx.update.callback_query.message
        if (jobs && page + 1 < jobs.length) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page + 1].title, buttons.browse_pending_jobs)
            db.setPendingJobPageAdmin(ctx, user.index, page + 1, null)
        } else if (jobs && page + 1 == jobs.length)
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + '\nNo Next Page', buttons.browse_pending_jobs)
    } else if (action === 'accept_pending') {

        let user = db.getUser(ctx)
        var jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
        var page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
        const msg = ctx.update.callback_query.message
        var job = jobs[page]
        if (jobs.length > page) {
            db.acceptJob(ctx, job.id)
            ctx.reply(job.title + ' Job Accepted!')
                // post the job to the channel here
            let message = ctx.telegram.sendMessage(channel_id, 'Title: ' + job.title + '\nJob Description: ' + job.description, buttons.apply_for_job(job.id))
            message.then(function(result) {
                db.setJobChannelMessage(ctx, job.id, result.message_id)
            });
            job.chatId ? ctx.telegram.sendMessage(job.chatId, 'Congrats! your job ' + job.title + ' has been posted.').then() : false
            let jobs = db.getPendingJobsAdmin(ctx)
            if (jobs.length > page)
                db.setPendingJobPageAdmin(ctx, user.index, page, jobs)
            else
                db.setPendingJobPageAdmin(ctx, user.index, page - 1, jobs)
        }

    } else if (action === 'reject_pending') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
        const msg = ctx.update.callback_query.message

        if (jobs.length > page) {
            db.closeJobAdmin(ctx, jobs[page].id)
            let user = db.getUser(ctx)
            ctx.reply(jobs[page].title + ' Job Rejected!', buttons.reject_job_reason)

            jobs[page].chatId ? ctx.telegram.sendMessage(jobs[page].chatId, 'Unfortunately your job ' + jobs[page].title + ' could not be posted.').then() : false
            let jobs = db.getPendingJobsAdmin(ctx)
            if (jobs.length > page)
                db.setPendingJobPageAdmin(ctx, user.index, page, jobs)
            else
                db.setPendingJobPageAdmin(ctx, user.index, page - 1, jobs)
        }

    } else if (action === 'reject_reason') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
        const msg = ctx.update.callback_query.message

        if (jobs.length > page) {
            db.closeJobAdmin(ctx, jobs[page].id)
            let user = db.getUser(ctx)
            ctx.reply(jobs[page].title + 'What is your reason for declining the job?', buttons.cancel_admin)
            db.setCommandUser(ctx, user.index, 'reject_reason_send')
        }

    } else if (action === 'admin_posted') {
        // ----------------------------------------------------- Posted
        let user = db.getUser(ctx);
        let jobs = db.getPostedJobs(ctx)
        if (jobs.length > 0) {
            ctx.reply('Posted Jobs\n' + jobs[0].title + '.\n Applicants - ' + jobs[0].applicants.length, buttons.browse_active_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No posted jobs :(\n', buttons.admin)
        }
    } else if (action === 'previous_active') {
        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].postingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPostingPage
        const msg = ctx.update.callback_query.message

        if (page > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page - 1].title + '.\n Applicants - ' + jobs[page - 1].applicants.length, buttons.browse_active_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, page - 1, null)
        } else
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + '\nNo Previous Page' + '.\n Applicants - ' + jobs[page].applicants.length, buttons.browse_active_jobs)

    } else if (action === 'next_active') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].postingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPostingPage
        const msg = ctx.update.callback_query.message

        if (page + 1 < jobs.length) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page + 1].title + '.\n Applicants - ' + jobs[page + 1].applicants.length, buttons.browse_active_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, page + 1, null)
        } else
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, jobs[page].title + '\nNo Next Page' + '.\n Applicants - ' + jobs[page].applicants.length, buttons.browse_active_jobs)
    } else if (action === 'close_job_active') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].postingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPostingPage
        const msg = ctx.update.callback_query.message

        if (jobs.length > page) {
            db.closeJob(ctx, jobs[page].id)
            ctx.reply(jobs[page].title + ' Job Closed!')
            if (jobs[page].reviewed)
                app.telegram.editMessageText(264335782, jobs[page].message_id, null, jobs[page].title + '\nThis Job is Closed!')
            let jobs = db.getPostedJobs(ctx)
            if (jobs.length > page)
                db.setPostingJobPageAdmin(ctx, user.index, page, jobs)
            else
                db.setPostingJobPageAdmin(ctx, user.index, page - 1, jobs)
        }

    } else if (action === 'detail_job_active') {

        let user = db.getUser(ctx)
        let jobs = ctx[property + 'DB'].get('users').value()[user.index].postingJobs
        let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPostingPage
        const msg = ctx.update.callback_query.message

        ctx.reply('Job Details: \n' + jobs[page].title + '\n' + jobs[page].description)

    } else if (action === 'cancel_admin') {
        ctx.reply('Operation Canceled', buttons.admin)
    }

    return;
});

app.on('text', (ctx) => {
    var user = db.getUser(ctx);

    // ctx.telegram.sendMessage(channel_id, JSON.stringify(ctx.update.message))

    let user_type = null;
    let index = null;
    let command = null;

    if (user == null) {
        ctx.reply("Welcome new user! use /start to register.");
    } else {
        user_type = user.type;
        index = user.index
    }
    
    
    

    switch (user_type) {
        case null:
            {
                index = index
                if (index == null) {
                    ctx.reply("I don't know you.");
                    return
                }
                if (ctx[property + 'DB'].get('users').value()[index].command == 'password') {
                    if (ctx.update.message.text == 'yesadminpass1278') {
                        let user = db.getUser(ctx)
                        db.logInAdmin(ctx, user.index)
                        ctx.reply('Welcome Admin!', buttons.admin)
                    } else {
                        ctx.reply('Wrong Password \ntry again!', buttons.login)
                    }
                    return
                }

                ctx.telegram.sendMessage(
                    ctx.from.id,
                    'Welcome to the Yes.et job bot! \nRight Fit. Right Now. \n Are you an Employer or a Job Seeker?',
                    buttons.welcome)

                break
            }
        case 'employer':
            {
                index = db.findEmployer(ctx, ctx.from.id)
                if (index == null) {
                    ctx.reply("Command unrecognized! Please select options from the Menu");
                    return
                }
                command = ctx[property + 'DB'].get('employers').value()[index].command;
                switch (command) {
                    case 'name_employer':
                        {
                            ctx.reply("Welcome " + ctx.update.message.text + "\nEnter Phone Number\n ", buttons.cancel_employer);
                            db.setNameEmployer(ctx, index, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, 'phone_employer', null)
                            break
                        }
                    case 'phone_employer':
                        {
                            ctx.reply(" Your phone number is " + ctx.update.message.text + "\n Enter Email address", buttons.cancel_employer);
                            db.setPhoneEmployer(ctx, index, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, 'email_employer', null)
                            break
                        }
                    case 'email_employer':
                        {
                            ctx.reply(" Your Email is " + ctx.update.message.text + "\nThank you for Registering!");
                            db.setEmailEmployer(ctx, index, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            employerAction(ctx)
                            break
                        }
                    case 'new_job_title':
                        {
                            ctx.reply("Job Title: " + ctx.update.message.text + "\nEnter Job Description");
                            let job = {
                                id: -1,
                                command: '',
                                name: '',
                                email: '',
                                phone: '',
                                cv: ''
                            };
                            job.id = ctx.from.id.toString() + Date.now().toString()
                            job.userid = ctx.from.id
                            job.active = true
                            job.reviewed = false
                            job.closed = false
                            job.edited = false
                            job.title = ctx.update.message.text
                            job.applicants = []
                            job.chatId = ctx.update.message.chat.id
                            ctx[property + 'DB'].get('jobs').push(job).write()
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, 'job_description', job.id)
                            break
                        }
                    case 'job_description':
                        {
                            ctx.reply("Description: " + ctx.update.message.text + "\nJob Successfully Added!\nYour job will be reviewed an posted. We will notify you as soon as we can :) - Yes Team");
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setJobDescription(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            employerAction(ctx)
                            break
                        }
                    case 'edit_job_title':
                        {
                            ctx.reply("Job Title: " + ctx.update.message.text + "\nEnter Job Description", buttons.cancel_employer);
                            let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
                            let jobid = ctx[property + 'DB'].get('employers').value()[index].jobs[page].id
                            db.setJobName(ctx, jobid, ctx.update.message.text)
                            db.setCommandEmployer(ctx, index, 'job_description_edit', jobid)
                            break
                        }
                    case 'job_description_edit':
                        {
                            ctx.reply("Description: " + ctx.update.message.text + "\nJob Successfully Added!\nYour job will be reviewed an posted. We will notify you as soon as we can :) - Yes Team");
                            let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
                            let jobid = ctx[property + 'DB'].get('employers').value()[index].jobs[page].id
                            db.setJobDescription(ctx, jobid, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            employerAction(ctx)
                            break
                        }
                }
                break
            }
        case 'job_seeker':
            {
                index = db.findIndex(ctx, ctx.from.id)
                if (index == null) {
                    ctx.reply("Command unrecognized! Please select options from the Menu");
                    return
                }
                command = ctx[property + 'DB'].get('employees').value()[index].command;
                switch (command) {
                    case 'name':
                        {
                            ctx.reply("Hello " + ctx.update.message.text + "\nEnter your phone number", buttons.cancel_emp);
                            db.setName(ctx, index, ctx.update.message.text)
                            index = db.findIndex(ctx, ctx.from.id)
                            db.setCommand(ctx, index, 'phone')
                            break
                        }
                    case 'phone':
                        {
                            ctx.reply(" Your phone number is " + ctx.update.message.text + "\n Enter your Email please", buttons.cancel_emp);
                            db.setPhone(ctx, index, ctx.update.message.text)
                            index = db.findIndex(ctx, ctx.from.id)
                            db.setCommand(ctx, index, 'email')
                            break
                        }
                    case 'email':
                        {
                            ctx.reply(" Your Email is " + ctx.update.message.text + "\n Upload your CV in PDF format", buttons.cancel_emp);
                            db.setEmail(ctx, index, ctx.update.message.text)
                            index = db.findIndex(ctx, ctx.from.id)
                            db.setCommand(ctx, index, 'file')
                            break
                        }
                }
                break
            }
        case 'admin':
            {
                if (ctx[property + 'DB'].get('users').value()[index].command == 'reject_reason_send') {
                    let jobs = ctx[property + 'DB'].get('users').value()[user.index].pendingJobs
                    let page = ctx[property + 'DB'].get('users').value()[user.index].jobsPendingPage
                    jobs[page].chatId ? ctx.telegram.sendMessage(jobs[page].chatId, 'Your job ' + jobs[page].title + ' was rejected because \n' + ctx.update.message.text).then() : false
                    ctx.reply('Reason Sent!', buttons.admin)
                }
                break
            }
        default:
            {
                db.resetItem(ctx, index)
                ctx.reply("Whoa! That flew right by me");
                return
            }
    }

})

app.on('document', (ctx) => {
    let index = db.findIndex(ctx, ctx.from.id)
    if (ctx[property + 'DB'].get('employees').value()[index].command == 'file') {
        db.setCV(ctx, index, ctx.update.message.document.file_id);
        ctx.reply("Upload Successful \n Thank you for Registering!");
        jobSeekerAction(ctx)
    } else {
        ctx.reply("File could not be saved. I did not ask for a file.");
    }
});


app.startPolling()


function jobSeekerAction(ctx) {
    let user = db.getUser(ctx);
    if (user) {
        if (user.type != 'job_seeker')
            user.type = 'job_seeker'
        db.resetUser(ctx, user, user.index)
    } else {
        user = {
            id: -1,
            command: '',
            name: '',
            email: '',
            phone: '',
            cv: '',

        };
        user.id = ctx.from.id;
        user.userid = ctx.from.id;
        user.type = 'job_seeker'
        ctx[property + 'DB'].get('users').push(user).write()
    }

    let index = db.findIndex(ctx, ctx.from.id)
    if (index == null) {
        user.command = 'name'
        ctx[property + 'DB'].get('employees').push(user).write()
        ctx.reply('Please Enter your First and Last name')
        db.setCommand(ctx, index, 'name')
    } else {
        if (ctx[property + 'DB'].get('employees').value()[index].name != '') {
            ctx.reply('Hi ' + ctx[property + 'DB'].get('employees').value()[index].name, buttons.edit_employee_profile)
            db.setCommand(ctx, index, '')
        } else {
            ctx.reply('Please Enter your First and Last name')
            db.setCommand(ctx, index, 'name')
        }
    }
}

function employerAction(ctx) {
    let user = db.getUser(ctx);
    if (user) {
        if (user.type != 'employer')
            user.type = 'employer'
        db.resetUser(ctx, user, user.index)
    } else {
        user = {
            id: -1,
            command: '',
            name: '',
            email: '',
            phone: '',
            cv: '',

        };
        user.id = ctx.from.id;
        user.userid = ctx.from.id;
        user.type = 'employer'
        ctx[property + 'DB'].get('users').push(user).write()
    }

    let index = db.findEmployer(ctx, ctx.from.id);

    if (index == null) {
        // ctx[property + 'DB'].get('users').push(user).write()
        user.command = 'name_employer'
        ctx[property + 'DB'].get('employers').push(user).write()
        ctx.reply('New Employer\nWhat is your Personal or Organization’s name?')
            // db.setCommand(ctx ,index, 'name')
    } else if (index >= 0) {
        if (ctx[property + 'DB'].get('employers').value()[index].name != '') {
            ctx.reply('Welcome ' + ctx[property + 'DB'].get('employers').value()[index].name, buttons.edit_employer_profile)
            db.setCommandEmployer(ctx, index, '', null)
        } else {
            ctx.reply('Welcome Back\nWhat is your Personal or Organization’s name?')
            db.setCommandEmployer(ctx, index, '', null)
        }

    }
}