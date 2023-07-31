import * as shelljs from 'shelljs';

export interface HandleOptions {
  onErrorMessage?: string;
}

const validateShell = (
  shellExecution: shelljs.ShellString,
  cmd: string,
  options?: HandleOptions,
) => {
  const failed = shelljs.error();
  const { onErrorMessage } = options || {};

  if (failed)
    throw new Error(
      `${
        onErrorMessage ? `${onErrorMessage}\n` : ''
      }[Shell] cmd:${cmd} ${failed}`,
    );

  return shellExecution;
};

export const shell = {
  pwd: (options?: HandleOptions): shelljs.ShellString => {
    return validateShell(shelljs.pwd(), 'pwd', options);
  },
  exec: (cmd: string, options?: HandleOptions): shelljs.ShellString => {
    return validateShell(shelljs.exec(cmd), cmd, options);
  },
  mkdir: (cmd: string, options?: HandleOptions): shelljs.ShellString => {
    return validateShell(shelljs.mkdir(cmd), cmd, options);
  },
  cd: (cmd: string, options?: HandleOptions): shelljs.ShellString => {
    const cdOptions = options || {};

    cdOptions.onErrorMessage = `${
      options?.onErrorMessage ? `${options.onErrorMessage} - ` : ''
    }current path: ${shelljs.pwd()}`;

    return validateShell(shelljs.cd(cmd), cmd, cdOptions);
  },
};
