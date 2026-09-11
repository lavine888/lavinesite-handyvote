"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const HELP = ["  cd articles       open writing", "  cd projects       browse things built", "  cd about          learn about Lavine", "  open latest       read the latest article", "  help              show this message"];

export default function TerminalCommandBar() {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const run = (event: FormEvent) => {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    setCommand("");
    if (value === "help") return setOutput(HELP);
    if (value === "open latest") return router.push("/articles/01");
    const match = value.match(/^(?:cd|open)\s+(articles|projects|about)\/?$/);
    if (match) return router.push(`/${match[1]}`);
    if (value) setOutput([`command not found: ${value}`, "type 'help' for available commands"]);
  };
  return <div className="reference-commandbar"><div className="reference-output">{output.map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}</div><form onSubmit={run}><label htmlFor="terminal-command">guest@~/app $</label><input id="terminal-command" value={command} onChange={(e) => setCommand(e.target.value)} autoComplete="off" spellCheck={false} aria-label="Terminal command" /></form></div>;
}
