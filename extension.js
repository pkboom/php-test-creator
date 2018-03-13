const vscode = require('vscode');
const TestCreator = require('./TestCreator');

function activate(context) {
    let creator = new TestCreator();

    context.subscriptions.push(vscode.commands.registerCommand('create.test', () => {
            creator.create();
        })
    );
}

exports.activate = activate;