import * as vscode from 'vscode';

function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.logBeforeLine', () => {
    insertLogStatement(true);
  });

  let disposable2 = vscode.commands.registerCommand('extension.logAfterLine', () => {
    insertLogStatement(false);
  });

  vscode.languages.registerCodeActionsProvider('*', {
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext) {
      const diagnostic = new vscode.Diagnostic(
        range,
        'Insert console.log',
        vscode.DiagnosticSeverity.Hint
      );

      const beforeLineAction = new vscode.CodeAction('Insert console.log before line', vscode.CodeActionKind.QuickFix);
      beforeLineAction.command = { command: 'extension.logBeforeLine', title: 'Insert Console.log Before Line' };
      beforeLineAction.diagnostics = [diagnostic];

      const afterLineAction = new vscode.CodeAction('Insert console.log after line', vscode.CodeActionKind.QuickFix);
      afterLineAction.command = { command: 'extension.logAfterLine', title: 'Insert Console.log After Line' };
      afterLineAction.diagnostics = [diagnostic];

      return [beforeLineAction, afterLineAction];
    }
  });

  context.subscriptions.push(disposable, disposable2);
}

function insertLogStatement(beforeLine: boolean) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    const position = selection.active;
    const line = position.line;
    const text = document.getText(selection) ? document.getText(selection) : document.getText(document.getWordRangeAtPosition(position));
    const lineText = document.lineAt(line).text;
    const indentation = lineText.match(/^\s*/)?.[0];

    const logStatement = `${indentation}console.log('${text}', ${text});\n`;

    if (beforeLine) {
      const newLine = new vscode.Position(line, 0); 
      editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(newLine, logStatement);
      });
    } else {
      const newLine = new vscode.Position(line + 1, 0); 
      editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(newLine, logStatement);
      });
    }
  }
}

export { activate };
