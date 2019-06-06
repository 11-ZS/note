class Compiler{
   constructor(el,vm){
      this.el = isElementNode(el)?el:document.querySelector(el);

      let fragment = this.node2fragment(this.el);

      this.compile(fragment);

      this.el.appendChild(fragment);
   }

   isDirective(attrName){
      return attrName.startWith('v-');
   }

   compileElement(node){
      let attributes = node.attributes;
      [...attributes].forEach(attr=>{
            let{name,value:expr} = attr;
            if(this.isDirective(name)){
               let [,directive] = name.split('-')
               CompileUtils[directive](node,expr,this.vm);
            }
      })
   }
   compileText(node){
      let content = node.textContent;
      if(/\{\{(.+?)\}\}/.test(content)){
         
      }
   }
   
   compile(node){
      let childNodes = node.childNodes;
      [...childNodes].forEach(child=>{
         if(this.isElementNode(child)){
            this.compileElement(child)
            this.compile(child);
         }else{
            this.compileText(child)
         }
      })
   }
   node2fragment(node){
      let fragment = document.createDocumentFragment();
      let firstChild;
      while(firstChild = node.firstChild){
         fragment.appendChild(firstChild);
      }
   }
   isElementNode(node){
      return node.nodeType===1;
   }
}
class Vue{
   constructor(options){
      this.$el = options.el;
      this.$data = options.data;
      if(this.$el){
         new Compiler(this.$el,this);
      }
   }
}
