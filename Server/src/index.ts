import { config } from "dotenv";
import { join } from "path";
import Server from "./boot/server";

config({
    path: join(__dirname, "..", ".env")
});

new Server();
