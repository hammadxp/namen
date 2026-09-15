import { spawn } from "node:child_process"
import process from "node:process"

for (const script of ["scripts/build-city-data.mjs", "scripts/update-category-data.mjs"]) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], { cwd: process.cwd(), stdio: "inherit" })
    child.on("error", reject)
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${script} exited with code ${code}`)))
  })
}

console.log("All local name data is current.")
