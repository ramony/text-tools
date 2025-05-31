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
  String.prototype.int = function(){
    const trimmed = this.trim();
    const num = Number(trimmed);
    const res = (!isNaN(num) && isFinite(num)) ? num : 0;
    return res;
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
    console.log(result)
    console.log("fkk12")
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