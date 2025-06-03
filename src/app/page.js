"use client"
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import { runScript } from "@/api/executor";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const display = (data, sep) => {
    if (Array.isArray(data)) {
      sep = sep || '\n';
      return data.map(it => display(it, '\t')).join(sep);
    } else {
      return data;
    }
  }

  useEffect(() => {
    const input = localStorage.getItem('input');
    if (input) {
      setInput(input);
    }
    const command = localStorage.getItem('command');
    if (command) {
      setCommand(command);
    }
  }, [])

  const handleInputChange = (value) => {
    localStorage.setItem('input', value);
    setInput(value);
  }

  const handleCommandChange = (value) => {
    localStorage.setItem('command', value);
    setCommand(value);
  }

  const handleRunScript = async () => {
    const data = await runScript(command, input);
    const output = display(data)
    setOutput(output);
  }

  return (
    <div className={styles.pageCustom}>
      <div className={styles.topSection}>
        <div className={styles.leftPane}>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="请输入文本"
            rows={16}
          />
        </div>
        <div className={styles.rightPane}>
          <textarea
            className={styles.textarea}
            value={output}
            rows={16}
            readOnly
            style={{
              backgroundColor: "#f5f5f5",
              color: "#888",
              fontSize: "15px",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
      </div>
      <div className={styles.bottomSection}>
        <input
          className={styles.bottomInput}
          type="text"
          value={command}
          onChange={e => handleCommandChange(e.target.value)}
          placeholder="命令"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleRunScript();
            }
          }}
        />
      </div>
    </div>
  );
}
