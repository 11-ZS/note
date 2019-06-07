class Compiler {
   constructor(el, vm) {
      this.el = this.isElementNode(el) ? el : document.querySelector(el);
      this.vm = vm;
      let fragment = this.node2fragment(this.el);

      this.compile(fragment);

      this.el.appendChild(fragment);
   }

   isDirective(attrName) {
      return attrName.startsWith('v-');
   }

   compileElement(node) {
      let attributes = node.attributes;
      console.log(attributes);
      [...attributes].forEach(attr => {
         let { name, value: expr } = attr;
         if (this.isDirective(name)) {
            let [, directive] = name.split('-')
            CompileUtils[directive](node, expr, this.vm);
         }
      })
   }
   compileText(node) {
      let content = node.textContent;
      if (/\{\{(.+?)\}\}/.test(content)) {
         CompileUtils['text'](node, content, this.vm)
      }
   }

   compile(node) {
      let childNodes = node.childNodes;
      [...childNodes].forEach(child => {
         if (this.isElementNode(child)) {
            this.compileElement(child)
            this.compile(child);
         } else {
            this.compileText(child)
         }
      })
   }
   node2fragment(node) {
      let fragment = document.createDocumentFragment();
      let firstChild;
      while (firstChild = node.firstChild) {
         fragment.appendChild(firstChild);
      }
      return fragment;
   }
   isElementNode(node) {
      return node.nodeType === 1;
   }
}
console.log("skdfjlsdkfj")

CompileUtils = {
   getVal(vm, expr) {
      return expr.split('.').reduce((data, current) => {
         return data[current];
      }, vm.$data)
   },
   model(node, expr, vm) {
      let fn = this.updater['modelUpdater']
      let value = this.getVal(vm, expr);

      fn(node, value);
   },
   html() {

   }, 
   text(node,expr,vm) {
      let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
         return this.getVal(vm,args[1]);
      })
      let fn = this.updater['textUpdater'];
      fn(node,content);

   },
   updater: {
      modelUpdater(node, value) {
         console.log(node);
         node.value = value;
      },
      htmlUpdater() {

      },
      textUpdater(node, value) {
         node.textContent = value;
      }
   }
}
class Vue {
   constructor(options) {
      this.$el = options.el;
      this.$data = options.data;
      if (this.$el) {
         new Compiler(this.$el, this);
      }
   }
}
