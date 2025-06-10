"use server"

import vm from "vm";
import { VMContext } from "./preset"

const runScript = async (expression, text) => {
  if (!expression) {
    return expression;
  }
  const context = createContext(text);
  try {
    vm.runInNewContext(VMContext, context);
    let result = vm.runInNewContext(expression, context);
    if (result) {
      result = result.toString();
    }
    return result;
  } catch (e) {
    console.log(e)
    return e.message;
  }
}

const createContext = (text) => {
  if (!text || text.trim() === "") {
    return { text: "" }
  }
  const lines = text.split("\n");
  const context = {};
  let key = null;
  lines.forEach(line => {
    line = line.trim();
    if (line === "") {
      return;
    }
    if (line.startsWith("#")) {
      key = line.replace(/#/g, "").trim();
    } else {
      key = key || "data";
      context[key] = context[key] || [];
      context[key].push(line);
    }
  })
  for (const key in context) {
    context[key] = context[key].join("\n");
  }
  context[String] = String;
  return context;
}

export { runScript };