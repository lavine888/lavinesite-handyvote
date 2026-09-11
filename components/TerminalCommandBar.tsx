"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const HELP = [
  "  cd articles       open writing",
  "  cd projects       browse selected work",
  "  now               see the current direction",
  "  contact           open contact details",
  "  home              return to the workspace",
  "  open latest       read the latest article",
  "  help              show this message",
];

type Props = { cwd?: string };

export default function TerminalCommandBar({ cwd = "~/app" }: Props) {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  const run = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    setCommand("");

    if (value === "help") {
      setOutput(HELP);
      return;
    }
    if (value === "open latest") {
      router.push("/articles/01");
      return;
    }
    if (value === "now") {
      router.push("/about#now");
      return;
    }
    if (value === "contact") {
      router.push("/about#contact");
      return;
    }
    if (value === "home") {
      router.push("/");
      return;
    }

    const match = value.match(/^(?:cd|open)\s+(articles|projects|about)\/?$/);
    if (match) {
      router.push(`/${match[1]}`);
      return;
    }

    if (value) setOutput([`command not found: ${value}`, "type 'help' for available commands"]);
  };

  return (
    <div className="reference-commandbar">
      <div className="reference-output" aria-live="polite">
        {output.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}
      </div>
      <form onSubmit={run}>
        <label htmlFor="terminal-command">guest@{cwd} $</label>
        <input
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}
