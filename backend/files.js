import { writeFileSync, readFileSync } from "node:fs";
const users = [{ name: "Adam Ondra", email: "adam.ondra@climbing" }];

const usersJson = JSON.stringify(users);

writeFileSync("backend/users.json", usersJson);

const readUsersJson = readFileSync("backend/users.json");
const readUsers = JSON.parse(readUsersJson);

console.log(readUsers);
