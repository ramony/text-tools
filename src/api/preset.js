const VMContext = `
  Array.prototype.replace = function(a, b){
    return this.map(it=>it.replace(a, b));
  };
  Array.prototype.toString = function(){
    return this.join('\\n');
  };
  class Table extends Array {
    constructor(data) {
      super();
      this.data = data;
    }
    column(index) {
      return this.data.map(it=>it[index] === undefined ?null: it[index])
    }
    toString() {
      return this.data.map(it=> it.join('\\t')).join('\\n')
    }
  };

  String.prototype.list = function() {
    return this.split('\\n')
  };
  
  String.prototype.table = function(columnSep) {
    let data = this.split('\\n').map(line=> {
      return line.split(columnSep || '\\t').map(it=>it.trim())
    });
    return new Table(data);
  };
  String.prototype.int = function(){
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
    return ["1比2多的:", ...aMore,"", "2比1多的:", ...bMore,"", "1和2的交集:", ...intersection]
  }
  `

export { VMContext }