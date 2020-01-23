import { exec, ExecOptions, ExecException } from "child_process";

import { ExecError, ExecSuccess } from "../interfaces/Exec";

export const execPromise = (
    command: string,
    execOptions: ExecOptions
): Promise<ExecError | ExecSuccess> => {
    return new Promise((resolve, reject) => {
        exec(
            command,
            execOptions,
            (error: ExecException | null, stdout: string, stderr: string) => {
                if (error || !stdout) {
                    return reject({ error, stderr, type: "error" });
                }
                return resolve({ stdout, type: "success" });
            }
        );
    });
};
