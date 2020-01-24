import { ExecException } from "child_process";

export interface ExecError {
    type: "error";
    error: ExecException;
    stderr: string;
}

export interface ExecSuccess {
    type: "success";
    stdout: string;
}
