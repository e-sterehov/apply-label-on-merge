import { Application } from 'probot' // eslint-disable-line no-unused-vars

const regex = /(- issue#[^\s]+)/i;

export = (app: Application) => {
    app.on('pull_request.closed', async (context) => {
        const pullRequest = context.payload.pull_request

        if (!pullRequest.merged) {
            app.log('Pull request is closed, but not merged.');
            return;
        }

        const match = regex.exec(pullRequest.title);
        if (!match) {
            app.log('No issues associated to PR found.');
            return;
        }

        const issueId = match[1].split('#')[1];
        // const issue = await context.github.issues.get(context.issue({
        //     issue_number: issueId,
        // }))
        await context.github.issues.addLabels(context.issue({
            labels: ['QA Ready'],
            issue_number: issueId,
        }))
        app.log(`#${issueId} successfuly marked as QA Ready.`)
    })
}
