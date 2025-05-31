"use client"
import { useState, useRef } from "react";
import styles from "./page.module.css";
import runScript from "@/api/jsrunner";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [expression, setExpression] = useState("");
  const textareaRef = useRef(null);
  const display = (data, sep) => {
    if (Array.isArray(data)) {
      sep = sep || '\n';
      return data.map(it => display(it, '\t')).join(sep);
    } else {
      return data;
    }
  }
  const handleRunScript = async () => {
    const data = await runScript(expression, text);
    console.log(data)
    setResult(display(data));
  }


  return (
    <div className={styles.pageCustom}>
      <div className={styles.topSection}>
        <div className={styles.leftPane}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="请输入文本"
            rows={16}
            ref={textareaRef}
          />
        </div>
        <div className={styles.rightPane}>
          <textarea
            className={styles.textarea}
            value={result}
            rows={16}
            readOnly
            ref={textareaRef}
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
          value={expression}
          onChange={e => setExpression(e.target.value)}
          placeholder="底部操作区输入框"
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
