"use server"

import vm from "vm";


const PrototypeDefination = `
  String.prototype.list = function() {
    return this.split('\\n')
  };
  String.prototype.table = function(columnSep) {
    return this.split('\\n').map(line=> {
        return line.split(columnSep || '\\t').map(it=>it.trim())
      })
  };
  `

const runScript = async (expression, text) => {
  if (!expression) {
    return expression;
  }
  const context = createContext(text);
  try {
    vm.runInNewContext(PrototypeDefination, context);
    const result = vm.runInNewContext(expression, context);
    return result;
  } catch (e) {
    console.log(e)
    return e.message;
  }
}

const tryConvertToNumber = (str) => {
  if (typeof str !== 'string') return str;

  const trimmed = str.trim();
  const num = Number(trimmed);

  // 允许科学计数法（如 "1e3" → 1000）
  return (!isNaN(num) && isFinite(num)) ? num : str;
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
    context[key] = tryConvertToNumber(context[key].join("\n"));
  }
  context[String] = String;
  return context;
}

export default runScript;