const vscode = require('vscode');

module.exports = class TestCreator {
    async create() {
        
        if (this.activeEditor() === undefined) {
            return;
        } 
        
        let activeDocument = this.activeDocument().uri;
        
        if (activeDocument === undefined) {
            return;
        }
        
        await this.insertTestMethod(activeDocument);
    } 
    
    async insertTestMethod(activeDocument) {
        let doc = await vscode.workspace.openTextDocument(activeDocument);

        let lineNumber = -1;

        let snippet = '';

        let multipleTests = false;
        
        for (let line = 0; line < doc.lineCount; line++) {
            let textLine = doc.lineAt(line).text.trim();

            lineNumber++;

            multipleTests = lineNumber !== line;

            if (/^test .+/.test(textLine)) {
                let newText = textLine.substring(5).replace(/\s/g, '_');

                snippet = multipleTests ? '\n' : '';
                
                if (this.config('withoutExceptionHandling.visiblity')) {
                    snippet += '\t/** @test */\n'
                        + `\tpublic function ${newText}()\n`
                        + '\t{\n'
                        + '\t\t\\$this->withoutExceptionHandling();\$1\n'
                        + '\t}\n';
                } else {
                    snippet += '\t/** @test */\n'
                        + `\tpublic function ${newText}()\n`
                        + '\t{\n'
                        + '\t\t\$1\n'
                        + '\t}\n';
                }

                this.activeEditor().insertSnippet(
                    new vscode.SnippetString(snippet),
                    this.range(lineNumber)
                );

                lineNumber = multipleTests ? lineNumber + 5 : lineNumber + 4;
            }
        }
    }
    
    range(line) {
        return new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line + 1, 0))
    }

    activeEditor() {
        return vscode.window.activeTextEditor;
    }

    activeDocument() {
        return this.activeEditor().document;
    }

    config(key) {
        return vscode.workspace.getConfiguration('phpTestCreator').get(key);
    }
}