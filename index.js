const Telegraf = require('telegraf')
var express = require('express');

const buttons = require('./buttons');
const keyboards = require('./keyboards');
const dbCon = require('./databaseConnection');
const db = require('./databaseFunctions');


const app = new Telegraf('1030576944:AAEgABxuJs3dQTTEU7EMKhgYiemx9Vw8qyI')

const property = 'data'

// Things to change
// const channel_id = "-1001394963347"; // The channel to be posted on
const channel_id = "-1001341473286";
const channel_chat_id = "-1001341473286"; // The channel to be posted on
const admin_pass = "yesadminpass1278"
const admin_operations_pass = "yesadminpass1278"

// ^^^^^^^^^^^^^^^^^^^^^


const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

let ui_messages = {};

// Wait for database async initialization finished (storageFileAsync or your own asynchronous storage adapter)
dbCon.localSession.DB.then(DB => {
    ui_messages = DB.get('customMessages').value()[0];
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
                if (job == null) {
                    ctx.reply('Job not found :(', { parse_mode: 'markdown'})
                    return
                }
                ctx.reply(ui_messages['apply_confirm_question'] + job.title + '?', {reply_markup:buttons.apply_emp.reply_markup, parse_mode:'markdown'})
                let emp = db.getApplicant(ctx, ctx.from.id)
                db.setApplyJob(ctx, emp.index, job)
                return
            }
            else {
                jobSeekerAction(ctx)
                return
            }
        } else if (user.type == 'employer') {
            employerAction(ctx)
            return
        }
    }
    // **** Keyboard
    ctx.telegram.sendMessage(ctx.from.id, '...',keyboards.welcome()).then()
    ctx.telegram.sendMessage(
        ctx.from.id,
        ui_messages['welcome_message_user'],
        {reply_markup:buttons.welcome.reply_markup, parse_mode: 'markdown'})
})

app.command('feedback', (ctx) => {
    let user = db.getUser(ctx);
    if (user) {
        db.setCommandUser(ctx, user.index, 'feedback')
        ctx.telegram.sendMessage(
            ctx.from.id,
            ui_messages['feedback'], { parse_mode: 'markdown' })
    }
    else {
        ctx.telegram.sendMessage(
            ctx.from.id,
            ui_messages['feedback_negative'], {reply_markup:buttons.welcome.reply_markup, parse_mode: 'markdown'})

    }

})


app.command('admin', (ctx) => {
    let user = db.getUser(ctx);

    if (user) {
        if (user.type == 'admin') {
            ctx.telegram.sendMessage(
                ctx.from.id,
                `Welcome to the Yes.et job bot! $user.name \nRight Fit. Right Now. \n ADMIN ACCOUNT`,
                buttons.admin)
        } else if (user.type == 'admin_operations') {
            ctx.telegram.sendMessage(
                ctx.from.id,
                `Welcome to the Yes.et job bot! $user.name \nRight Fit. Right Now. \n ADMIN ACCOUNT`,
                buttons.admin_operations)
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
        user.chatId = ctx.update.message.chat.id
        ctx[property + 'DB'].get('users').push(user).write()
    }

})
app.on('callback_query', (ctx) => {

    const action = ctx.update.callback_query.data;
    //--------------------------------------------------- Show Job Details with Apply Button
    if ( action.startsWith("_showjob") ) {
        let jobid = action.slice(8, -1)
        jobid += action.slice(-1)
        let job = db.getJob(ctx, jobid)

        ctx.reply('Title: ' + job.title + '\nJob Description: ' + job.description, buttons.apply_for_job_search(job.id)).then()

        return
    }

    if ( action.startsWith("_applyforjob") ) {
        let jobid = action.slice(12, -1)
        jobid += action.slice(-1)
        let job = db.getJob(ctx, jobid)

        if (job.question == null) {
            db.applyForJob(ctx, job.id)
            let index_employer = db.findEmployer(ctx, job.userid)
            db.setApplicantEmployer(ctx, index_employer, ctx.from.id)
            index_employer = db.findEmployer(ctx, job.userid)
            let reply = '\n'
            if(job.application_method == 'email')
                reply += 'Send your application to: *' + ctx[property + 'DB'].get('employers').value()[index_employer].email + '*'
            else if(job.application_method == 'phone')
                reply += 'Contact the employer: *' + ctx[property + 'DB'].get('employers').value()[index_employer].phone + '*'
            ctx.reply(ui_messages['apply_successful'] + job.title + reply, { parse_mode: 'markdown' })
        } else {
            ctx.reply('*' + job.question + '*' + job.title, { parse_mode: 'markdown', reply_markup: buttons.screening_answer_search(jobid).reply_markup})
        }

        return
    }
    if (action.startsWith('yes.')) {
        let jobid = action.slice(4, -1)
        jobid += action.slice(-1)
        let job = db.getJob(ctx, jobid)

        db.applyForJob(ctx, job.id)
        let index_employer = db.findEmployer(ctx, job.userid)
        db.setApplicantEmployer(ctx, index_employer, ctx.from.id)

        index_employer = db.findEmployer(ctx, job.userid)
        let reply = '\n'
        if(job.application_method == 'email')
            reply += 'Send your application to: *' + ctx[property + 'DB'].get('employers').value()[index_employer].email + '*'
        else if(job.application_method == 'phone')
            reply += 'Contact the employer: *' + ctx[property + 'DB'].get('employers').value()[index_employer].phone + '*'
        
        ctx.reply(ui_messages['apply_successful'] + job.title + reply, { parse_mode: 'markdown' })

    }
    //--------------------------------------------------- Apply For a Job
    if (action === 'apply_for_job') {

        let index = db.findIndex(ctx, ctx.from.id)
        let job = ctx[property + 'DB'].get('employees').value()[index].apply
        
        if (job.question == null) {
            db.applyForJob(ctx, job.id)
            let index_employer = db.findEmployer(ctx, job.userid)
            db.setApplicantEmployer(ctx, index_employer, ctx.from.id)
            index_employer = db.findEmployer(ctx, job.userid)
            let reply = '\n'
            if(job.application_method == 'email')
                reply += 'Send your application to: *' + ctx[property + 'DB'].get('employers').value()[index_employer].email + '*'
            else if(job.application_method == 'phone')
                reply += 'Contact the employer: *' + ctx[property + 'DB'].get('employers').value()[index_employer].phone + '*'
            ctx.reply(ui_messages['apply_successful'] + job.title + reply, { parse_mode: 'markdown' })
        } else {
            ctx.reply('*' + job.question + '*' + job.title, { parse_mode: 'markdown', reply_markup: buttons.screening_answer.reply_markup})
        }

    } else if (action === 'yes') {

        let index = db.findIndex(ctx, ctx.from.id)
        let job = ctx[property + 'DB'].get('employees').value()[index].apply

        db.applyForJob(ctx, job.id)
        let index_employer = db.findEmployer(ctx, job.userid)
        db.setApplicantEmployer(ctx, index_employer, ctx.from.id)

        index_employer = db.findEmployer(ctx, job.userid)
        let reply = '\n'
        if(job.application_method == 'email')
            reply += 'Send your application to: *' + ctx[property + 'DB'].get('employers').value()[index_employer].email + '*'
        else if(job.application_method == 'phone')
            reply += 'Contact the employer: *' + ctx[property + 'DB'].get('employers').value()[index_employer].phone + '*'
        
        ctx.reply(ui_messages['apply_successful'] + job.title + reply, { parse_mode: 'markdown' })

    }
    else if (action === 'no') {
        ctx.reply(ui_messages['apply_fail'], { parse_mode: 'markdown' })

    }
    else if (action === 'get_applicant_cv') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let applicant = ctx[property + 'DB'].get('employers').value()[index].applicant_cv
        const msg = ctx.update.callback_query.message
        let emp = db.getApplicant(ctx, applicant)
        if (emp.cv != '') {
            ctx.telegram.sendDocument(msg.chat.id, emp.cv)
        } else {
            ctx.reply(ui_messages['no_applicant_cv'], { parse_mode: 'markdown' })
        }
    }
    // --------------------------------------------------- Job Seeker
    else if (action === 'job_seeker') {
        jobSeekerAction(ctx)
    } else if (action === 'search_jobs') {
        let index = db.findIndex(ctx, ctx.from.id)
        db.setCommand(ctx, index, 'search_jobs')
        ctx.reply('Type in a key word or choose a category from below.', {reply_markup: keyboards.category_keys(ctx[property + 'DB'].get('categories').value()).reply_markup, parse_mode: 'markdown'});
    } else if (action === 'cancel_emp') {
        ctx.reply('Operation Canceled')
        jobSeekerAction(ctx)
    } else if (action === 'applied_jobs') {
        let index = db.findIndex(ctx, ctx.from.id)
        let jobs = db.getEmployee(ctx, index).appliedJobs
        if (jobs.length > 0) {
            let job = db.getJob(ctx, jobs[0])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            ctx.reply(ui_messages['employee_applied_jobs'] +'\n' + job.title + status, {reply_markup:buttons.browse_applied_jobs.reply_markup, parse_mode:'markdown'})
            db.setAppliedPageEmp(ctx, index, 0)

        } else {
            ctx.reply(ui_messages['employee_no_applied_jobs'], {parse_mode:'markdown'})
            jobSeekerAction(ctx)
        }
    } else if (action === 'previous_emp_applied') {
        let index = db.findIndex(ctx, ctx.from.id)
        let jobs = db.getEmployee(ctx, index).appliedJobs
        let page = db.getEmployee(ctx, index).applied_page
        const msg = ctx.update.callback_query.message

        if (page > 0) {
            let job = db.getJob(ctx, jobs[page - 1])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, job.title + status, {reply_markup:buttons.browse_applied_jobs.reply_markup, parse_mode:'markdown'}).then()
            db.setAppliedPageEmp(ctx, index, page - 1)
        } else if (page == 0) {
            let job = db.getJob(ctx, jobs[page])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, job.title + status + '\nNo Previous Page', {reply_markup:buttons.browse_applied_jobs.reply_markup, parse_mode: 'markdown'}).then()
        }

    } else if (action === 'next_emp_applied') {
        let index = db.findIndex(ctx, ctx.from.id)
        let jobs = db.getEmployee(ctx, index).appliedJobs
        let page = db.getEmployee(ctx, index).applied_page
        const msg = ctx.update.callback_query.message

        if (page + 1 < jobs.length) {
            let job = db.getJob(ctx, jobs[page + 1])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, job.title + status, {reply_markup:buttons.browse_applied_jobs.reply_markup, parse_mode:'markdown'}).then()
            db.setAppliedPageEmp(ctx, index, page + 1)
        } else if (page + 1 == jobs.length) {
            let job = db.getJob(ctx, jobs[page])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, job.title + status + '\nNo Next Page', {reply_markup:buttons.browse_applied_jobs.reply_markup, parse_mode:'markdown'}).then()
        }

    } else if (action === 'detail_emp_applied_job') {
        let index = db.findIndex(ctx, ctx.from.id)
        let jobs = db.getEmployee(ctx, index).appliedJobs
        let page = db.getEmployee(ctx, index).applied_page

        let job = db.getJob(ctx, jobs[page] )
        ctx.reply(ui_messages['job_details'] + '\n' + job.title + '\n' + job.description, {parse_mode: 'markdown'})
    }


    // ---------------------------------------------------- Employer
    else if (action === 'employer') {
        employerAction(ctx)
    } else if (action === 'email') {
        index = db.findEmployer(ctx, ctx.from.id)
        db.setCommandEmployer(ctx, index, 'email_employer', null)
        ctx.reply(ui_messages['employer_email'], {parse_mode: 'markdown'})
    } else if (action === 'phone') {
        index = db.findEmployer(ctx, ctx.from.id)
        db.setCommandEmployer(ctx, index, 'phone_employer', null)
        ctx.reply(ui_messages['employer_phone'], {parse_mode: 'markdown'})
    } else if (action === 'new_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply(ui_messages['new_job_title'], {reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown'})
        db.setCommandEmployer(ctx, index, 'new_job_title', null)
    } else if (action === 'telegram_method') {
        let index = db.findEmployer(ctx, ctx.from.id)
        db.setApplicationMethodEmployer(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, 'telegram')
        ctx.reply( 'Applicants will contact you with Telegram.', {parse_mode: 'markdown'}).then()
    } else if (action === 'email_method') {
        let index = db.findEmployer(ctx, ctx.from.id)
        db.setApplicationMethodEmployer(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, 'email')
        ctx.reply( 'Applicants will contact you with Email.', {parse_mode: 'markdown'}).then()
    } else if (action === 'phone_method') {
        let index = db.findEmployer(ctx, ctx.from.id)
        db.setApplicationMethodEmployer(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, 'phone')
        ctx.reply( 'Applicants will contact you with Phone.', {parse_mode: 'markdown'}).then()
    } else if (action === 'add_screening_question') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply( ui_messages['pre_screening_question'], {reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown'})
        db.setCommandEmployer(ctx, index, 'pre-screening', null)
    } else if (action === 'my_jobs') {
        let index = db.findEmployer(ctx, ctx.from.id)

        let jobs = db.getActiveJobs(ctx, 'pending')
        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n' + ui_messages['job_is_posted'] + jobs[0].applicants.length : '\n' + ui_messages['job_is_being_reviewed']
            ctx.reply(ui_messages['pending_jobs']+'\n' + jobs[0].title + status, {reply_markup:buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'})
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_pending_jobs'], {parse_mode: 'markdown'})
            // employerAction(ctx)
        }
    } else if (action === 'pending_employer') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'pending')
        const msg = ctx.update.callback_query.message

        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n' + ui_messages['job_is_posted'] + jobs[0].applicants.length : '\n' + ui_messages['job_is_being_reviewed']
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['pending_jobs']+'\n' + jobs[0].title + status, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_pending_jobs'], {parse_mode: 'markdown'})
        }
    } else if (action === 'active_employer') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'active')
        const msg = ctx.update.callback_query.message

        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n' + ui_messages['job_is_posted'] + jobs[0].applicants.length : '\n' + ui_messages['job_is_being_reviewed']
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['active_jobs'] +'\n' + jobs[0].title + status, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_active_jobs'], {parse_mode: 'markdown'})
        }
    } else if (action === 'closed_employer') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'closed')
        const msg = ctx.update.callback_query.message

        if (jobs.length > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['closed_jobs'] + '\n' + jobs[0].title, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_closed_jobs'], {parse_mode: 'markdown'})
        }
    } else if (action === 'previous') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message
        let opening = jobs[page].closed ? ui_messages['closed_jobs'] + '\n' : (jobs[page].reviewed ? ui_messages['active_jobs']+'\n' : ui_messages['pending_jobs'] + '\n')

        if (page > 0) {
            let status = jobs[page - 1].reviewed && !jobs[page - 1].closed ? '\n' + ui_messages['job_is_posted'] + jobs[page - 1].applicants.length : '';
            !jobs[page - 1].closed && !jobs[page - 1].reviewed ? status += '\n' + ui_messages['job_is_being_reviewed'] : ''
             jobs[page - 1].closed ? status += '\n*This job is closed*':''
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, opening + jobs[page - 1].title + status, {reply_markup: buttons.browse_jobs(jobs[page - 1].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, page - 1, null)
        } else if (page == 0) {
            let status = jobs[page].reviewed && !jobs[page].closed ? '\n' + ui_messages['job_is_posted'] + jobs[page].applicants.length : '\n';
            !jobs[page].closed && !jobs[page].reviewed ? status += '\n' + ui_messages['job_is_being_reviewed'] : ''
            jobs[page].closed ? status += '\n*This job is closed*':''
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, opening + jobs[page].title + status + '\n' + ui_messages['no_previous_page'], {reply_markup: buttons.browse_jobs(jobs[page].reviewed).reply_markup, parse_mode: 'markdown'}).then()
        }

    } else if (action === 'next') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message
        let opening = jobs[page].closed ?  ui_messages['closed_jobs']+'\n' : (jobs[page].reviewed ? ui_messages['active_jobs']+'\n' : ui_messages['pending_jobs']+'\n')

        if (page + 1 < jobs.length) {
            let status = jobs[page + 1].reviewed && !jobs[page + 1].closed ? '\n' + ui_messages['job_is_posted'] + jobs[page + 1].applicants.length : '\n';
            !jobs[page + 1].closed && !jobs[page + 1].reviewed? status += '\n' + ui_messages['job_is_being_reviewed'] : ''
            jobs[page + 1].closed ? status += '\n *This job is closed*':''
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, opening + jobs[page + 1].title + status, {reply_markup: buttons.browse_jobs(jobs[page + 1].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, page + 1, null)
        } else if (page + 1 == jobs.length) {
            let status = jobs[page].reviewed && !jobs[page].closed ? '\n' + ui_messages['job_is_posted'] + jobs[page].applicants.length : '\n';
            !jobs[page].closed && !jobs[page].reviewed? status += '\n' + ui_messages['job_is_being_reviewed'] : ''
            jobs[page].closed ? status += '\n *This job is closed*':''
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, opening + jobs[page].title + status + '\n' + ui_messages['no_next_page'], {reply_markup: buttons.browse_jobs(jobs[page].reviewed).reply_markup, parse_mode: 'markdown'}).then()
        }
    } else if (action === 'edit_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage

        ctx.reply(ui_messages['edit_job_title'], {reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown'})
        db.setCommandEmployer(ctx, index, 'edit_job_title', null)
    } else if (action === 'detail_job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage

        ctx.reply( ui_messages['job_details']+'\n' + jobs[page].title + '\n' + jobs[page].description, {parse_mode: 'markdown'})
    } else if (action === 'close_job') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = ctx[property + 'DB'].get('employers').value()[index].jobs
        let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
        const msg = ctx.update.callback_query.message
        let job = jobs[page]
        if (jobs.length > page) {
            db.closeJob(ctx, job.id)
            if (job.reviewed)
                app.telegram.editMessageText(channel_chat_id, job.message_id, null, job.title + '\nThis Job is Closed!')
            ctx.reply(job.title + ' *Job Closed!*', {parse_mode: 'markdown'})
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
            ctx.reply(ui_messages['applicants'] + '\n' + applicant.name + '\n' + applicant.phone, {reply_markup: buttons.browse_applicants.reply_markup, parse_mode: 'markdown'})
            db.setApplicantPage(ctx, index, 0, jobs[page].applicants)
        } else {
            ctx.reply(ui_messages['no_applicants'], {parse_mode: 'markdown'})
            employerAction(ctx)
        }
    } else if (action === 'previous_app') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let applicants = ctx[property + 'DB'].get('employers').value()[index].applicants
        let page = ctx[property + 'DB'].get('employers').value()[index].applicant
        const msg = ctx.update.callback_query.message


        if (page > 0) {
            let applicant = db.getApplicant(ctx, applicants[page - 1])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['applicants']+'\n' + applicant.name + '\n' + applicant.phone, {reply_markup:buttons.browse_applicants.reply_markup, parse_mode: 'markdown'}).then()
            db.setApplicantPage(ctx, index, page - 1, null)
        } else {
            let applicant = db.getApplicant(ctx, applicants[page])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['applicants']+'\n' + applicant.name + '\n' + applicant.phone + '\n' + ui_messages['no_previous_page'], {reply_markup:buttons.browse_applicants.reply_markup, parse_mode: 'markdown'}).then()
        }
    } else if (action === 'next_app') {

        let index = db.findEmployer(ctx, ctx.from.id)
        let applicants = ctx[property + 'DB'].get('employers').value()[index].applicants
        let page = ctx[property + 'DB'].get('employers').value()[index].applicant
        const msg = ctx.update.callback_query.message
        if (page + 1 < applicants.length) {
            let applicant = db.getApplicant(ctx, applicants[page + 1])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['applicants']+'\n' + applicant.name + '\n' + applicant.phone, {reply_markup: buttons.browse_applicants.reply_markup, parse_mode: 'markdown'}).then()
            db.setApplicantPage(ctx, index, page + 1, null)
        } else {
            let applicant = db.getApplicant(ctx, applicants[page])
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, ui_messages['applicants']+'\n' + applicant.name + '\n' + applicant.phone + '\n' + ui_messages['no_next_page'], {reply_markup: buttons.browse_applicants.reply_markup, parse_mode: 'markdown'}).then()
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
            ctx.reply(ui_messages['no_applicant_cv'], {parse_mode: 'markdown'})
        }
    } else if (action === 'cancel_employer') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply(ui_messages['employer_cancel', {parse_mode: 'markdown'}])
        employerAction(ctx)
    }

    // admin account ---------------------------------------------------- ADMIN
    else if (action === 'login') {
        let user = db.getUser(ctx);

        ctx.reply('Technical: Enter Your Password', buttons.cancel_)
        db.setCommandUser(ctx, user.index, 'password')

    } else if (action === 'login_operations') {
        let user = db.getUser(ctx);

        ctx.reply('Operations: Enter Your Password', buttons.cancel_)
        db.setCommandUser(ctx, user.index, 'password_operations')

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
            if(job == null)
                return
            db.acceptJob(ctx, job.id)
            ctx.reply(job.title + ' Job Accepted!')
            // post the job to the channel here
            let message = ctx.telegram.sendMessage(channel_id, 'Title: ' + job.title + '\nJob Description: ' + job.description, buttons.apply_for_job(job.id))
            message.then(function (result) {
                db.setJobChannelMessage(ctx, job.id, result.message_id)
            });
            job.chatId ? ctx.telegram.sendMessage(job.chatId, 'Congrats! your job has been posted. \n' + job.title).then() : false
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
        let job = jobs[page]
        if (jobs.length > page) {
            db.closeJobAdmin(ctx, job.id)
            let user = db.getUser(ctx)
            ctx.reply(job.title + ' Job Rejected!', buttons.reject_job_reason)

            job.chatId ? ctx.telegram.sendMessage(job.chatId, 'Unfortunately your job could not be posted.' + job.title).then() : false
            let jobs = db.getPendingJobsAdmin(ctx)
            if (jobs.length > page)
                db.setPendingJobPageAdmin(ctx, user.index, page, jobs)
            else
                db.setPendingJobPageAdmin(ctx, user.index, page - 1, jobs)
        }

    } else if (action === 'reject_reason') {

        let user = db.getUser(ctx)
        let reasons = ctx[property + 'DB'].get('adminReplies').value()
        ctx.reply(user.rejectedJob.title + 'What is your reason for declining the job?', buttons.reject_reason_buttons(reasons))
        db.setCommandUser(ctx, user.index, 'reject_reason_send')


    } else if (action === 'admin_posted') {
        // ----------------------------------------------------- Posted
        let user = db.getUser(ctx);
        let jobs = db.getPostedJobs(ctx)
        if (jobs.length > 0) {
            ctx.reply('Active Jobs\n' + jobs[0].title + '.\n Applicants - ' + jobs[0].applicants.length, buttons.browse_active_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No posted jobs :(\n', buttons.admin)
        }
    } else if (action === 'admin_closed') {
        // ----------------------------------------------------- Closed
        let user = db.getUser(ctx);
        let jobs = db.getClosedJobs(ctx)
        if (jobs.length > 0) {
            ctx.reply('Closed Jobs\n' + jobs[0].title + '.\n Applicants - ' + jobs[0].applicants.length, buttons.browse_closed_jobs)
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
        let job = jobs[page]
        if (jobs.length > page) {
            db.closeJob(ctx, job.id)
            ctx.reply(job.title + ' Job Closed!')
            if (job.reviewed)
                app.telegram.editMessageText(channel_chat_id, job.message_id, null, job.title + '\nThis Job is Closed!')
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

    } else if (action === 'customize_messages') {

        let user = db.getUser(ctx);
        if (user.type != 'admin'){
            return
        }
        let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
        let message_titles = Object.keys(messages_ui)
        if (message_titles.length > 0) {
            ctx.reply('Bot Messages:\n' + message_titles[0] + '\n' + messages_ui[message_titles[0]], {reply_markup: buttons.custom_options.reply_markup, parse_mode: 'markdown'})
            db.setMessagesPageAdmin(ctx, user.index, 0)
        } else {
            ctx.reply('No Bot Messages :(\n', buttons.admin)
        }

    } else if (action === 'previous_message') {

        let user = db.getUser(ctx);
        let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
        let message_titles = Object.keys(messages_ui)
        let page = user.messagePage
        const msg = ctx.update.callback_query.message
        if (page > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null,'Bot Messages:\n' + message_titles[page-1].replace(/_/g, ' ') + '\n' + messages_ui[message_titles[page-1]], {reply_markup: buttons.custom_options.reply_markup, parse_mode: 'markdown'}).then()
            db.setMessagesPageAdmin(ctx, user.index, page-1)
        } else {
            ctx.reply('No Previous Message :(')
        }

    } else if (action === 'next_message') {

        let user = db.getUser(ctx);
        let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
        let message_titles = Object.keys(messages_ui)
        let page = user.messagePage
        const msg = ctx.update.callback_query.message

        if (page + 1 < message_titles.length) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null,'Bot Messages:\n' + message_titles[page+1].replace(/_/g, ' ') + '\n' +  messages_ui[message_titles[page+1]], {reply_markup: buttons.custom_options.reply_markup, parse_mode: 'markdown'}).then()
            db.setMessagesPageAdmin(ctx, user.index, page+1)
        } else {
            ctx.reply('No Next Message :(')
        }

    } else if (action === 'edit_message') {

        let user = db.getUser(ctx);
        let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
        let message_titles = Object.keys(messages_ui)
        let page = user.messagePage
        
        ctx.reply('Edit Message \n' + message_titles[page] + '\n' +  messages_ui[message_titles[page]], {reply_markup: buttons.cancel_admin.reply_markup, parse_mode: 'markdown'})
        db.setCommandUser(ctx, user.index, 'edit_message')
        

    } else if (action === 'new_feedbacks') {

        let user = db.getUser(ctx);
        let feedbacks = db.getNewFeedbacks(ctx)
        if (feedbacks.length > 0) {
            ctx.reply('New Feedbacks:\n' + feedbacks[0].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'})
            db.setFeedbackPageAdmin(ctx, user.index, 0, feedbacks)
        } else {
            ctx.reply('No feedbacks :(\n', buttons.admin_operations)
        }

    } else if (action === 'feedbacks') {

        let user = db.getUser(ctx);
        let feedbacks = ctx[property + 'DB'].get('feedbacks').value()
        if (feedbacks.length > 0) {
            ctx.reply('Feedbacks:\n' + feedbacks[0].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'})
            db.setFeedbackPageAdmin(ctx, user.index, 0, feedbacks)
        } else {
            ctx.reply('No feedbacks :(\n', buttons.admin_operations)
        }

    } else if (action === 'previous_feedback') {

        let user = db.getUser(ctx);
        let feedbacks = db.getNewFeedbacks(ctx)
        let page = user.feedbackPage
        const msg = ctx.update.callback_query.message
        if (page > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null,'Feedbacks:\n' + feedbacks[page - 1].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'}).then()
            db.setFeedbackPageAdmin(ctx, user.index, page-1, null)
        } else {
            ctx.reply('No Previous Feedback :(')
        }

    } else if (action === 'next_feedback') {
        
        let user = db.getUser(ctx);
        let feedbacks = db.getNewFeedbacks(ctx)
        let page = user.feedbackPage
        const msg = ctx.update.callback_query.message
        if (page + 1 < feedbacks.length) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null,'Feedbacks:\n' + feedbacks[page + 1].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'}).then()
            db.setFeedbackPageAdmin(ctx, user.index, page+1, null)
        } else {
            ctx.reply('No Next Feedback :(')
        }

    } else if (action === 'mark_as_read') {
        
        let user = db.getUser(ctx);
        let feedbacks = db.getNewFeedbacks(ctx)
        let page = user.feedbackPage
        db.markFeedbackRead(ctx, feedbacks[page].id)
        ctx.reply('*Marked as read!*', {parse_mode: 'markdown'})
        

    } else if (action === 'automatic_replies') {

        let user = db.getUser(ctx);
        let replies = db.getAdminReplies(ctx)
        if (replies.length > 0) {
            ctx.reply('Automated Replies\n' + replies[0], buttons.manage_replies)
            db.setReplyPageAdmin(ctx, user.index, 0)
        } else {
            ctx.reply('No Automated Replies :(\n', buttons.add_replies)
        }

    } else if (action === 'previous_reply') {

        let user = db.getUser(ctx);
        let replies = db.getAdminReplies(ctx)
        const msg = ctx.update.callback_query.message
        if (user.replyPage > 0) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null,'Automated Replies\n' + replies[user.replyPage - 1], buttons.manage_replies).then()
            db.setReplyPageAdmin(ctx, user.index, user.replyPage - 1)
        } else {
            ctx.reply('No previous reply')
        }

    } else if (action === 'next_reply') {

        let user = db.getUser(ctx);
        let replies = db.getAdminReplies(ctx)
        const msg = ctx.update.callback_query.message
        if (user.replyPage + 1< replies.length) {
            app.telegram.editMessageText(msg.chat.id, msg.message_id, null, 'Automated Replies\n' + replies[user.replyPage + 1], buttons.manage_replies).then()
            db.setReplyPageAdmin(ctx, user.index, user.replyPage + 1)
        } else {
            ctx.reply('No next reply')
        }

    } else if (action === 'delete_reply') {

        let user = db.getUser(ctx);
        let replies = db.getAdminReplies(ctx)
        db.deleteAdminReplies(ctx, replies[user.replyPage])
        ctx.reply('Automated Reply Deleted: \n' + replies[user.replyPage])
        

    } else if (action === 'add_reply') {

        let user = db.getUser(ctx);
        db.setCommandUser(ctx, user.index, 'new_reply')
        ctx.reply('Enter your reply', buttons.cancel_admin)
        

    } else if (action === 'cancel_admin') {
        ctx.reply('Operation Canceled', buttons.admin)
    }

    return;
});

app.on('text', (ctx) => {
    var user = db.getUser(ctx);
    // ctx.telegram.sendMessage(channel_id, JSON.stringify(ctx.update.message))
    if (ctx.update.message.text == ''){
        return
    }
    if (ctx.update.message.text == '\uD83D\uDC54 Job Seeker') {
        ctx.update.callback_query = ctx.update
        jobSeekerAction(ctx)
        return
    } else if (ctx.update.message.text == '\uD83D\uDCB8 Employer') {
        ctx.update.callback_query = ctx.update
        employerAction(ctx)
        return
    } else if (ctx.update.message.text == '\uD83D\uDD0E Search Jobs') {
        let index = db.findIndex(ctx, ctx.from.id)
        db.setCommand(ctx, index, 'search_jobs')
        ctx.reply('Type in a key word or choose a category from below.', {reply_markup: keyboards.category_keys(ctx[property + 'DB'].get('categories').value()).reply_markup, parse_mode: 'markdown'});
        return
    } else if (ctx.update.message.text == '\uD83D\uDCBC Applied Jobs') {
        let index = db.findIndex(ctx, ctx.from.id)
        if(index == null)
            return
        let jobs = db.getEmployee(ctx, index).appliedJobs
        if (jobs.length > 0) {
            let job = db.getJob(ctx, jobs[0])
            let status = job.closed ? '\n *This job is Closed.*' : '\n'
            ctx.reply('Applied Jobs\n' + job.title + status, buttons.browse_applied_jobs)
            db.setAppliedPageEmp(ctx, index, 0)

        } else {
            ctx.reply(ui_messages['employee_no_applied_jobs'], {parse_mode: 'markdown'})
            // jobSeekerAction(ctx)
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDC64 Profile') {
        ctx.reply('...',keyboards.profile()).then()
        return
    } else if (ctx.update.message.text == 'Job Seeker.') {
        ctx.reply('...',keyboards.job_seeker_profile()).then()
        return
    } else if (ctx.update.message.text == 'Employer.') {
        ctx.reply('...',keyboards.employer_profile()).then()
        return
    } else if (ctx.update.message.text == 'View Profile') {
        let index = db.findIndex(ctx, ctx.from.id)
        if(index == null){
            ctx.reply('Seems like you didn\'t setup the profile yet. *Wanna do it now?*', {reply_markup: keyboards.welcome(),parse_mode: 'markdown'}).then()
            return
        }
        let emp = db.getEmployee(ctx, index)
        ctx.reply('*Name: *' + emp.name + '\n*Email and Phone: *' + emp.email + ', ' + emp.phone, {parse_mode: 'markdown'})
        if(emp.cv != '')
            ctx.telegram.sendDocument(ctx.update.message.chat.id, emp.cv)
        return
    } else if (ctx.update.message.text == 'View Profile.') {
        let index = db.findEmployer(ctx, ctx.from.id)
        if(index == null){
            ctx.reply('Seems like you didn\'t setup the profile yet. *Wanna do it now?*', {reply_markup: keyboards.welcome(),parse_mode: 'markdown'}).then()
            return
        }
        let emp = db.getEmployer(ctx, index)
        let reply = '*Name: *' + emp.name
        if (emp.email != '')
            reply += '\n*Email: *' + emp.email
        if (emp.phone != '')
            reply += '\n*Phone: *' + emp.phone  
        ctx.reply( reply, {parse_mode: 'markdown'})
        return
    } else if (ctx.update.message.text == 'Edit Profile') {
        if(user.type == 'job_seeker') {
            ctx.reply('Choose what to edit',keyboards.job_seeker_edit()).then()
        } else if (user.type == 'employer') {
            ctx.reply('Choose what to edit',keyboards.employer_edit()).then()
        }
        return
    } else if (ctx.update.message.text == 'Back to Menu') {
        if(user.type == 'job_seeker') {
            ctx.reply('...',keyboards.job_seeker()).then()
        } else if (user.type == 'employer') {
            ctx.reply('...',keyboards.employer()).then()
        }else {
            ctx.reply('...',keyboards.welcome()).then()
        }
        return
    } 
    //////////////// EDIT
    else if (ctx.update.message.text == 'Name') {
        if(user.type == 'job_seeker') {
            let index = db.findIndex(ctx, ctx.from.id)
            let emp = db.getEmployee(ctx, index)
            db.setCommand(ctx,index, 'name_edit_employee')
            ctx.reply('*Name: *' + emp.name + '\nPlease enter your new name', {parse_mode: 'markdown'}).then()

        } else if (user.type == 'employer') {
            let index = db.findEmployer(ctx, ctx.from.id)
            let emp = db.getEmployer(ctx, index)
            db.setCommandEmployer(ctx,index, 'name_edit_employer')
            ctx.reply('*Name: *' + emp.name + '\nPlease enter your new name', {parse_mode: 'markdown'}).then()
        }
        return
    } else if (ctx.update.message.text == 'Email') {
        if(user.type == 'job_seeker') {
            let index = db.findIndex(ctx, ctx.from.id)
            let emp = db.getEmployee(ctx, index)
            db.setCommand(ctx,index, 'email_edit_employee')
            ctx.reply('*Email: *' + emp.email + '\nPlease enter your new email', {parse_mode: 'markdown'}).then()

        } else if (user.type == 'employer') {
            let index = db.findEmployer(ctx, ctx.from.id)
            let emp = db.getEmployer(ctx, index)
            db.setCommandEmployer(ctx,index, 'email_edit_employer')
            ctx.reply('*Email: *' + emp.email + '\nPlease enter your new email', {parse_mode: 'markdown'}).then()
        }
        return
    } else if (ctx.update.message.text == 'Phone') {
        if(user.type == 'job_seeker') {
            let index = db.findIndex(ctx, ctx.from.id)
            let emp = db.getEmployee(ctx, index)
            db.setCommand(ctx,index, 'phone_edit_employee')
            ctx.reply('*Phone: *' + emp.phone + '\nPlease enter your new phone number', {parse_mode: 'markdown'}).then()

        } else if (user.type == 'employer') {
            let index = db.findEmployer(ctx, ctx.from.id)
            let emp = db.getEmployer(ctx, index)
            db.setCommandEmployer(ctx,index, 'phone_edit_employer')
            ctx.reply('*Phone: *' + emp.phone + '\nPlease enter your new phone number', {parse_mode: 'markdown'}).then()
        }
        return
    } else if (ctx.update.message.text == 'CV') {
        if(user.type == 'job_seeker') {
            let index = db.findIndex(ctx, ctx.from.id)
            let emp = db.getEmployee(ctx, index)
            db.setCommand(ctx,index, 'cv_edit_employee')
            ctx.reply('Please upload your new CV in PDF or Word format', {parse_mode: 'markdown'}).then()

        } 
        return
    } 
    ////////////////// EDIT END
    else if (ctx.update.message.text == '\uD83D\uDCC4 Post a Job') {
        let index = db.findEmployer(ctx, ctx.from.id)
        ctx.reply(ui_messages['new_job_title'], {reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown'})
        db.setCommandEmployer(ctx, index, 'new_job_title', null)
        return
    } else if (ctx.update.message.text == '\uD83D\uDCD2 Pending Jobs') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'pending')
        if(index == null)
            return
        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n' + ui_messages['job_is_posted'] + jobs[0].applicants.length : '\n' + ui_messages['job_is_being_reviewed']
            ctx.reply(ui_messages['pending_jobs']+'\n' + jobs[0].title + status, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_pending_jobs'], {parse_mode: 'markdown'})
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCD7 Active Jobs') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'active')
        if(index == null)
            return
        if (jobs.length > 0) {
            let status = jobs[0].reviewed ? '\n' + ui_messages['job_is_posted'] + jobs[0].applicants.length : '\n' + ui_messages['job_is_being_reviewed']
            ctx.reply( ui_messages['active_jobs'] +'\n' + jobs[0].title + status, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_active_jobs'], {parse_mode: 'markdown'})
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCD5 Closed Jobs') {
        let index = db.findEmployer(ctx, ctx.from.id)
        let jobs = db.getActiveJobs(ctx, 'closed')
        if(index == null)
            return
        if (jobs.length > 0) {
            ctx.reply( ui_messages['closed_jobs'] + '\n' + jobs[0].title, {reply_markup: buttons.browse_jobs(jobs[0].reviewed).reply_markup, parse_mode: 'markdown'}).then()
            db.setJobPage(ctx, index, 0, jobs)
        } else {
            ctx.reply(ui_messages['no_closed_jobs'], {parse_mode: 'markdown'})
        }
        return
    } else if (ctx.update.message.text == '\uD83C\uDFC1 I\'m done') {
        var user = db.getUser(ctx);
        if(user == null)
            return
        db.logOutAdmin(ctx, user.index)
        ctx.telegram.sendMessage(ctx.from.id, '...',keyboards.welcome()).then()
        ctx.reply(ui_messages['user_logged_out'], {parse_mode: 'markdown'})
        return
    } 
    ///////////////////////////////////////////////////////////////////////////////////////ADMIN
    else if (ctx.update.message.text == '\uD83D\uDCD2 Pending Jobs Admin') {
        let user = db.getUser(ctx);
        let jobs = db.getPendingJobsAdmin(ctx)
        if (jobs.length > 0) {
            ctx.reply('Pending Jobs\n' + jobs[0].title, buttons.browse_pending_jobs)
            db.setPendingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No active jobs with this account :(\n', buttons.admin)
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCD7 Active Jobs Admin') {
        let user = db.getUser(ctx);
        let jobs = db.getPostedJobs(ctx)
        if (jobs.length > 0) {
            ctx.reply('Active Jobs\n' + jobs[0].title + '.\n Applicants - ' + jobs[0].applicants.length, buttons.browse_active_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No posted jobs :(\n', buttons.admin)
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCD5 Closed Jobs Admin') {
        let user = db.getUser(ctx);
        let jobs = db.getClosedJobs(ctx)
        if (jobs.length > 0) {
            ctx.reply('Closed Jobs\n' + jobs[0].title + '.\n Applicants - ' + jobs[0].applicants.length, buttons.browse_closed_jobs)
            db.setPostingJobPageAdmin(ctx, user.index, 0, jobs)
        } else {
            ctx.reply('No posted jobs :(\n', buttons.admin)
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCE4 Automated Replies') {
        let user = db.getUser(ctx);
        let replies = db.getAdminReplies(ctx)
        if (replies.length > 0) {
            ctx.reply('Automated Replies\n' + replies[0], buttons.manage_replies)
            db.setReplyPageAdmin(ctx, user.index, 0)
        } else {
            ctx.reply('No Automated Replies :(\n', buttons.add_replies)
        }
        return
    } else if (ctx.update.message.text == '\u2709: Customize Messages') {
        let user = db.getUser(ctx);
        if (user.type != 'admin'){
            return
        }
        let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
        let message_titles = Object.keys(messages_ui)
        if (message_titles.length > 0) {
            ctx.reply('Bot Messages:\n' + message_titles[0] + '\n' + messages_ui[message_titles[0]], {reply_markup: buttons.custom_options.reply_markup, parse_mode: 'markdown'})
            db.setMessagesPageAdmin(ctx, user.index, 0)
        } else {
            ctx.reply('No Bot Messages :(\n', buttons.admin)
        }
        return
    } else if (ctx.update.message.text == '\uD83D\uDCE8 Feedback') {
        let user = db.getUser(ctx);
        if (user) {
            db.setCommandUser(ctx, user.index, 'feedback')
            ctx.telegram.sendMessage(
                ctx.from.id,
                ui_messages['feedback'], {parse_mode: 'markdown'})
        }
        else {
            ctx.telegram.sendMessage(
                ctx.from.id,
                ui_messages['feedback_negative'], {reply_markup:buttons.welcome.reply_markup, parse_mode: 'markdown'})

        }
        return
    } else if (ctx.update.message.text == 'New Feedbacks') {
        let user = db.getUser(ctx);
        let feedbacks = db.getNewFeedbacks(ctx)
        if (feedbacks.length > 0) {
            ctx.reply('New Feedbacks:\n' + feedbacks[0].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'})
            db.setFeedbackPageAdmin(ctx, user.index, 0, feedbacks)
        } else {
            ctx.reply('No feedbacks :(\n', buttons.admin_operations)
        }
        return
    } else if (ctx.update.message.text == 'All Feedbacks') {
        let user = db.getUser(ctx);
        let feedbacks = ctx[property + 'DB'].get('feedbacks').value()
        if (feedbacks.length > 0) {
            ctx.reply('Feedbacks:\n' + feedbacks[0].feedback, {reply_markup: buttons.feedback_options.reply_markup, parse_mode: 'markdown'})
            db.setFeedbackPageAdmin(ctx, user.index, 0, feedbacks)
        } else {
            ctx.reply('No feedbacks :(\n', buttons.admin_operations)
        }
        return
    }

    let user_type = null;
    let index = null;
    let command = null;

    if (user == null) {
        ctx.reply( ui_messages['new_user'], {parse_mode: 'markdown'});
        return
    } else {
        user_type = user.type;
        index = user.index
        command = ctx[property + 'DB'].get('users').value()[index].command;
        if(command == 'feedback'){
            let feedback = {}
            feedback.id = ctx.from.id + Date.now()
            feedback.userid = ctx.from.id
            feedback.read = false
            feedback.feedback = ctx.update.message.text
            db.saveFeedback(ctx, feedback)
            ctx.reply('*Thank you for your feedback!*', {parse_mode: 'markdown'})
            db.setCommandUser(ctx, index, '')
            return
        }
    }




    switch (user_type) {
        case null:
            {
                index = index
                if (index == null) {
                    ctx.reply( ui_messages['new_user'], {parse_mode: 'markdown'});
                    return
                }
                if (ctx[property + 'DB'].get('users').value()[index].command == 'password') {
                    if (ctx.update.message.text == admin_pass) {
                        let user = db.getUser(ctx)
                        db.logInAdmin(ctx, user.index)
                        ctx.reply('...',keyboards.admin()).then()
                        ctx.reply('Welcome Technical Admin!', buttons.admin)
                    } else {
                        ctx.reply('Wrong Password \ntry again!', buttons.login)
                    }
                    return
                } else if (ctx[property + 'DB'].get('users').value()[index].command == 'password_operations') {
                    if (ctx.update.message.text == admin_operations_pass) {
                        let user = db.getUser(ctx)
                        db.logInAdminOperations(ctx, user.index)
                        ctx.reply('...',keyboards.admin_operations()).then()
                        ctx.reply('Welcome Operations Admin!', buttons.admin_operations)
                    } else {
                        ctx.reply('Wrong Password \ntry again!', buttons.login)
                    }
                    return
                }

                ctx.telegram.sendMessage(
                    ctx.from.id,
                    ui_messages['welcome_message_user'],
                    {reply_markup:buttons.welcome.reply_markup, parse_mode: 'markdown'})

                break
            }
        case 'employer':
            {
                index = db.findEmployer(ctx, ctx.from.id)
                if (index == null) {
                    ctx.reply(ui_messages['unknown_command'], {parse_mode: 'markdown'});
                    return
                }
                command = ctx[property + 'DB'].get('employers').value()[index].command;
                switch (command) {
                    case 'name_employer':
                        {
                            
                            ctx.reply('...',keyboards.employer()).then()
                            ctx.reply("Welcome " + ctx.update.message.text + "\n" + ui_messages['employer_contact_info'], {reply_markup: buttons.email_or_phone.reply_markup, parse_mode: 'markdown'});
                            db.setNameEmployer(ctx, index, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            break
                        }
                    case 'phone_employer':
                        {
                            if (phoneRegExp.test(ctx.update.message.text)) {
                                ctx.reply("Your phone number is *" + ctx.update.message.text + "*\n*Thank you for Registering!*", { reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown' });
                                db.setPhoneEmployer(ctx, index, ctx.update.message.text)
                                index = db.findEmployer(ctx, ctx.from.id)
                                db.setCommandEmployer(ctx, index, '', null)
                                employerAction(ctx)
                            } else {
                                ctx.reply(ui_messages['invalid_phone'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'email_employer':
                        {
                            if (emailRegexp.test(ctx.update.message.text)) {
                                ctx.reply("Your email is *" + ctx.update.message.text + "*\n*Thank you for Registering!*", { inline_keyboard: buttons.cancel_employer, parse_mode: 'markdown' });
                                db.setEmailEmployer(ctx, index, ctx.update.message.text)
                                index = db.findEmployer(ctx, ctx.from.id)
                                db.setCommandEmployer(ctx, index, '', null)
                                employerAction(ctx)
                            } else {
                                ctx.reply(ui_messages['invalid_email'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'name_edit_employer':
                        {
                            ctx.reply("Name edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                            db.setNameEmployer(ctx, index, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            break
                        }
                    case 'email_edit_employer':
                        {
                            if (emailRegexp.test(ctx.update.message.text)) {
                                ctx.reply("Email edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                                db.setEmailEmployer(ctx, index, ctx.update.message.text)
                                index = db.findEmployer(ctx, ctx.from.id)
                                db.setCommandEmployer(ctx, index, '', null)
                            } else {
                                ctx.reply(ui_messages['invalid_email'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'phone_edit_employer':
                        {
                            if (phoneRegExp.test(ctx.update.message.text)) {
                                ctx.reply("Phone edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                                db.setPhoneEmployer(ctx, index, ctx.update.message.text)
                                index = db.findEmployer(ctx, ctx.from.id)
                                db.setCommandEmployer(ctx, index, '', null)
                            } else {
                                ctx.reply(ui_messages['invalid_phone'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'new_job_title':
                        {
                            ctx.reply("Job Title: *" + ctx.update.message.text + "*\n" + 'Select a category', {reply_markup: keyboards.category_keys(ctx[property + 'DB'].get('categories').value()).reply_markup, parse_mode: 'markdown'});
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
                            job.date = new Date()
                            job.chatId = ctx.update.message.chat.id
                            job.application_method = 'telegram'
                            job.category = ''
                            ctx[property + 'DB'].get('jobs').push(job).write()
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, 'job_category', job.id)
                            break
                        }
                    case 'job_category':
                        {
                            ctx.reply('...',keyboards.employer()).then()
                            ctx.reply("Category: " + ctx.update.message.text + "\n" + ui_messages['job_description'], {parse_mode: 'markdown'});
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setJobCategory(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, ctx.update.message.text)
                            db.setCommandEmployer(ctx, index, 'job_description', null)
                            // employerAction(ctx)
                            break
                        }
                    case 'job_description':
                        {
                            ctx.reply("Description: " + ctx.update.message.text + "\n" + ui_messages['job_successfully_added'], {reply_markup: buttons.screening_question.reply_markup, parse_mode: 'markdown'});
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setJobDescription(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, ctx.update.message.text)
                            db.setCommandEmployer(ctx, index, '', null)
                            // employerAction(ctx)
                            break
                        }
                    case 'pre-screening':
                        {
                            ctx.reply("Pre-screeing Question: \n*" + ctx.update.message.text + "*\n" + ui_messages['pre_screening_question_added']);
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setJobScreeiningQuestion(ctx, ctx[property + 'DB'].get('employers').value()[index].jobid, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            // employerAction(ctx)
                            break
                        }
                    case 'edit_job_title':
                        {
                            ctx.reply("Job Title: *" + ctx.update.message.text + "\n*" + ui_messages['job_description'], {reply_markup: buttons.cancel_employer.reply_markup, parse_mode: 'markdown'});
                            let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
                            let jobid = ctx[property + 'DB'].get('employers').value()[index].jobs[page].id
                            db.setJobName(ctx, jobid, ctx.update.message.text)
                            db.setCommandEmployer(ctx, index, 'job_description_edit', jobid)
                            break
                        }
                    case 'job_description_edit':
                        {
                            ctx.reply("Description: " + ctx.update.message.text + "\n" + ui_messages['job_successfully_edited'], {reply_markup: buttons.screening_question.reply_markup, parse_mode: 'markdown'});
                            let page = ctx[property + 'DB'].get('employers').value()[index].jobsPage
                            let jobid = ctx[property + 'DB'].get('employers').value()[index].jobs[page].id
                            db.setJobDescription(ctx, jobid, ctx.update.message.text)
                            index = db.findEmployer(ctx, ctx.from.id)
                            db.setCommandEmployer(ctx, index, '', null)
                            // employerAction(ctx)
                            break
                        }

                }
                break
            }
        case 'job_seeker':
            {
                index = db.findIndex(ctx, ctx.from.id)
                if (index == null) {
                    ctx.reply(ui_messages['unknown_command'], {parse_mode: 'markdown'});
                    return
                }
                command = ctx[property + 'DB'].get('employees').value()[index].command;
                switch (command) {
                    case 'name':
                        {  
                            
                            ctx.reply('...',keyboards.job_seeker()).then()
                            ctx.reply(ui_messages['employee_new_greeting'] + ctx.update.message.text + "\n" + ui_messages['employee_phone'], {reply_markup: buttons.cancel_emp.reply_markup, parse_mode: 'markdown'});
                            db.setName(ctx, index, ctx.update.message.text)
                            index = db.findIndex(ctx, ctx.from.id)
                            db.setCommand(ctx, index, 'phone')
                            break
                        }
                    case 'phone':
                        {
                            if (phoneRegExp.test(ctx.update.message.text)) {
                                ctx.reply("Your phone number is *" + ctx.update.message.text + "*\n" + ui_messages['employee_email'], {reply_markup: buttons.cancel_emp.reply_markup, parse_mode: 'markdown'});
                                db.setPhone(ctx, index, ctx.update.message.text)
                                index = db.findIndex(ctx, ctx.from.id)
                                db.setCommand(ctx, index, 'email')
                            } else {
                                ctx.reply(ui_messages['invalid_phone'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'email':
                        {
                            if (emailRegexp.test(ctx.update.message.text)) {
                                ctx.reply("Your Email is *" + ctx.update.message.text + "*\n Upload your CV as a file", {reply_markup: buttons.cancel_emp.reply_markup, parse_mode: 'markdown'});
                                db.setEmail(ctx, index, ctx.update.message.text)
                                index = db.findIndex(ctx, ctx.from.id)
                                db.setCommand(ctx, index, 'file')
                            } else {
                                ctx.reply(ui_messages['invalid_email'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'name_edit_employee':
                        {
                            ctx.reply("Name edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                            db.setName(ctx, index, ctx.update.message.text)
                            index = db.findIndex(ctx, ctx.from.id)
                            db.setCommand(ctx, index, '', null)
                            break
                        }
                    case 'email_edit_employee':
                        {
                            if (emailRegexp.test(ctx.update.message.text)) {
                                ctx.reply("Email edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                                db.setEmail(ctx, index, ctx.update.message.text)
                                index = db.findIndex(ctx, ctx.from.id)
                                db.setCommand(ctx, index, '', null)
                            } else {
                                ctx.reply(ui_messages['invalid_email'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'phone_edit_employee':
                        {
                            if (phoneRegExp.test(ctx.update.message.text)) {
                                ctx.reply("Phone edited Successfuly\n" + ctx.update.message.text, {parse_mode: 'markdown'});
                                db.setPhone(ctx, index, ctx.update.message.text)
                                index = db.findIndex(ctx, ctx.from.id)
                                db.setCommand(ctx, index, '', null)
                            } else {
                                ctx.reply(ui_messages['invalid_phone'], {parse_mode: 'markdown'})
                            }
                            break
                        }
                    case 'search_jobs':
                    {
                        ctx.reply('...',keyboards.job_seeker()).then()
                        let results = db.searchJobs(ctx, ctx.update.message.text)
                        if (results.length > 0) {
                            if (results.length > 5)
                                results = results.slice(0, 5)
                            let temp = "*Search Results* \n"
                            let i = 1
                            results.forEach(element => {
                                temp += '*' + i + '* - ' + element.title
                                i ++
                            });
                            ctx.reply(temp, {parse_mode: 'markdown', reply_markup: buttons.job_details(results).reply_markup});
                        } else {
                            ctx.reply("Couldn't find any jobs :(", {parse_mode: 'markdown'});
                        }
                        break
                    }
                }
                break
            }
        case 'admin':
            {
                if (ctx[property + 'DB'].get('users').value()[index].command == 'reject_reason_send') {
                    let user = db.getUser(ctx)
                    user.rejectedJob.chatId ? ctx.telegram.sendMessage(user.rejectedJob.chatId, 'Your job ' + user.rejectedJob.title + ' was rejected because \n' + ctx.update.message.text).then() : false
                    ctx.reply('Reason Sent!', buttons.admin)
                    ctx.reply('...',keyboards.admin()).then()
                } else if (ctx[property + 'DB'].get('users').value()[index].command == 'new_reply') {
                    
                    ctx[property + 'DB'].get('adminReplies').push(ctx.update.message.text).write()
                    ctx.reply(ctx.update.message.text + '\nReply Saved!', buttons.admin)
                } else if (ctx[property + 'DB'].get('users').value()[index].command == 'edit_message') {
                    let user = db.getUser(ctx);
                    let messages_ui = ctx[property + 'DB'].get('customMessages').value()[0]
                    let message_titles = Object.keys(messages_ui)
                    let page = user.messagePage

                    db.saveMessages(ctx, message_titles[page], ctx.update.message.text)
                    ctx.reply('*Message Edited*:\n' + message_titles[page] + '\n' +  ctx.update.message.text, {reply_markup: buttons.custom_options.reply_markup, parse_mode: 'markdown'})
                    ui_messages =  ctx[property + 'DB'].get('customMessages').value()[0];
                }
                break
            }
        case 'admin_operations':
            {
                if (ctx[property + 'DB'].get('users').value()[index].command == 'reply_feedback') {
                    let user = db.getUser(ctx)
                    user.rejectedJob.chatId ? ctx.telegram.sendMessage(user.rejectedJob.chatId, 'Your job ' + user.rejectedJob.title + ' was rejected because \n' + ctx.update.message.text).then() : false
                    ctx.reply('Reason Sent!', buttons.admin)
                    ctx.reply('...',keyboards.admin()).then()
                } 
                break
            }
        default:
            {
                db.resetItem(ctx, index)
                ctx.reply(ui_messages['unknown_command'], {parse_mode: 'markdown'});
                return
            }
    }

})

app.on('document', (ctx) => {
    let index = db.findIndex(ctx, ctx.from.id)
    if(index == null)
        return
    if (ctx[property + 'DB'].get('employees').value()[index].command == 'file') {
        // check if file is PDF or Word
        db.setCV(ctx, index, ctx.update.message.document.file_id);
        ctx.reply(ui_messages['employee_registration_successfull'], {parse_mode: 'markdown'});
        jobSeekerAction(ctx)
    } else if (ctx[property + 'DB'].get('employees').value()[index].command == 'cv_edit_employee') {
        // check if file is PDF or Word
        db.setCV(ctx, index, ctx.update.message.document.file_id);
        ctx.reply('CV edited successfully', {parse_mode: 'markdown'});
    } else {
        ctx.reply(ui_messages['file_error'], {parse_mode: 'markdown'});
    }
});


app.launch()

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
        user.chatId = ctx.update.callback_query.message.chat.id
        ctx[property + 'DB'].get('users').push(user).write()
    }

    let index = db.findIndex(ctx, ctx.from.id)
    if (index == null) {
        user.command = 'name'
        user.appliedJobs = []
        ctx[property + 'DB'].get('employees').push(user).write()
        ctx.reply(ui_messages['employee_new'], {parse_mode: 'markdown'})
        db.setCommand(ctx, index, 'name')
    } else {
        
        ctx.telegram.sendMessage(ctx.from.id, '...',keyboards.job_seeker()).then()
        if (ctx[property + 'DB'].get('employees').value()[index].name != '') {
            ctx.reply(ui_messages['employee_new_greeting'] + ctx[property + 'DB'].get('employees').value()[index].name, {reply_markup:buttons.edit_employee_profile.reply_markup, parse_mode: 'markdown'})
            db.setCommand(ctx, index, '')
        } else {
            ctx.reply(ui_messages['employee_new'], {parse_mode: 'markdown'})
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
        user.chatId = ctx.update.callback_query.message.chat.id
        ctx[property + 'DB'].get('users').push(user).write()
    }

    let index = db.findEmployer(ctx, ctx.from.id);

    if (index == null) {
        // ctx[property + 'DB'].get('users').push(user).write()
        user.command = 'name_employer'
        ctx[property + 'DB'].get('employers').push(user).write()
        ctx.reply(ui_messages['employer_new'], {parse_mode: 'markdown'})
        // db.setCommand(ctx ,index, 'name')
    } else if (index >= 0) {
        
        ctx.telegram.sendMessage(ctx.from.id, '...',keyboards.employer()).then()
        if (ctx[property + 'DB'].get('employers').value()[index].name != '') {
            ctx.reply('Welcome ' + ctx[property + 'DB'].get('employers').value()[index].name, buttons.edit_employer_profile)
            db.setCommandEmployer(ctx, index, '', null)
        } else {
            ctx.reply(ui_messages['employer_new'], {parse_mode: 'markdown'})
            db.setCommandEmployer(ctx, index, '', null)
        }

    }
}
var server = express();


var server_port = process.env.PORT || 80;
var server_host = '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


server.get("/", function (req,res) {
           res.send("Hello World");
           });
