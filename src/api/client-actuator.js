// client 
Array.prototype.replace = function (a, b) {
  return this.map(it => it.replace(a, b));
};
Array.prototype.toString = function () {
  return this.join('\n');
};
class Table extends Array {
  constructor(data) {
    super();
    this.data = data;
  }
  column(index) {
    return this.data.map(it => it[index] === undefined ? null : it[index])
  }

  print(template) {
    return this.data.map(it => template.replace(/\$(\d+)/g, (match, index) => {
      const arrIndex = parseInt(index) - 1; // 模板中 $1 对应数组索引 0
      return it[arrIndex] !== undefined ? it[arrIndex] : match;
    }))
  }
  toString() {
    return this.data.map(it => it.join('\t')).join('\n')
  }
};

String.prototype.list = function () {
  return this.split('\n')
};

String.prototype.table = function (columnSep) {
  let data = this.split('\n').map(line => {
    return line.split(columnSep || '\t').map(it => it.trim())
  });
  return new Table(data);
};
String.prototype.int = function () {
  const trimmed = this.trim();
  const num = Number(trimmed);
  const res = (!isNaN(num) && isFinite(num)) ? num : 0;
  return res;
};

function diff(a, b) {
  const aUnique = [...new Set(a)];
  const bUnique = [...new Set(b)];
  const aMore = aUnique.filter(x => !bUnique.includes(x));
  const bMore = bUnique.filter(x => !aUnique.includes(x));
  const intersection = aUnique.filter(x => bUnique.includes(x));
  return ["1比2多的:", ...aMore, "", "2比1多的:", ...bMore, "", "1和2的交集:", ...intersection]
}

const runScript = (expression, text) => {
  if (!expression) {
    return expression;
  }
  const context = createContext(text);
  try {
    let fun = new Function(...Object.keys(context), 'return ' + expression)
    let result = fun(...Object.values(context));
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
  return context;
}

export { runScript };