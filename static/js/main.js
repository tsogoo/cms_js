(function(){
var CMS
CMS = this.CMS = {}
CMS.VERSION = '0.0.1'

var Event = CMS.Event = {
}
    
var View = CMS.View = function(options){
    this.initialize(options)
}
_.extend(View.prototype,{
    initialize:function(options){},
        
    /*
    options: {template: 'template-name', action:'action-name', url_params:'url-params'}
    */
    run:function(options){
        var me = this
        if(!options.template)
            options.template = this.alias
        this.init_template({file_name:options.template, success:function(){
            me.init_model({ action:options.action, params:options.url_params, success:function(){
                me.render({template:options.template})
            }})
        }, unsuccess:function(){ alert('error')}})
    },
    init_template:function(options){
        if(!this.template_string){
            var me=this
            $.get(this.root_url+'templates/'+options.file_name+'.html',function(data){
                me.template_string = data
                $('#templates').append(me.template_string)
                options.success()
            })    
        }
        else{
            $('#templates').append(this.template_string)
            options.success()
        }
    },
    init_model:function(options){
        if(options.action)
            this.current_action = options.action
        options.success()
    },
    render:function(options){
        $('#page_content').empty()
        $('#page_content').html(_.template($('#template_'+this.alias+'_'+this.current_action).html()))
        this.select_menu()
    }
})
    
    
var ctor = function(){}
var inherits = function(parent, protoProps, staticProps) {
    var child;
    
        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }
    
    _.extend(child, parent);
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    if (protoProps) _.extend(child.prototype, protoProps);
    
    if (staticProps) _.extend(child, staticProps);
    
    child.prototype.constructor = child;
    
    child.__super__ = parent.prototype;
    return child;
};
var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
};
View.extend = extend
}).call(this)
var List = function(options) {
    this.initialize(options)
}
_.extend(List.prototype,{
    meta:{sort:'ordering', sort_by:'ASC', current_page:0, total:0},
    attributes:[{name:"id"},
        {name:"ordering", label:"Эрэмбэ",columnOption:{width:80,order:true}},
        {name:"title", label:"Гарчиг",columnOption:{order:true,align:"left"}},
        {name:"i_state",label:"Төлөв",columnOption:{width:60,order:true}}
    ],
    initialize:function (options){
        _.extend(this,options)
        this.filter.addElement(CMSHml.HiddenField('sort', this.meta.sort))
        this.filter.addElement(CMSHml.HiddenField('sort_by', this.meta.sort_by))
        this.filter.addElement(CMSHml.HiddenField('current_page', this.meta.current_page))
        this.filter.addElement(CMSHml.HiddenField('total', this.meta.total))
        this.fetch()
    },
    
    setData:function(options){
        
    },
    setElement:function(){
        this.table=$('<table class="table table-striped table-bordered table-condensed"></table>')
        this.setHead()
        return this.table
    },
    setHead:function(){
        var thead = $('<thead></thead>')
        var row = $('<tr></tr>')
        thead.append(row)
        this.table.append(thead)
        row.append($('<th>#</th>').css('width',5))
        for(var j in this.attributes) {
            //  create table column and append it
            var col = $('<th></th>');
            if(this.attributes[j].name == 'id') {
                checkbox = $('<span><input type="checkbox" id="checkAll" /><span>');
                col.css('width',5)
                col.append(checkbox);
            }
            if(this.attributes[j].columnOption) {
                if(!this.attributes[j].columnOption.align)
                    this.attributes[j].columnOption.align = 'center'
                col.css('text-align', this.attributes[j].columnOption.align)
                if(this.attributes[j].columnOption.order) {
                    links = $('<a href="#" id="'+this.attributes[j].name+'">'+this.attributes[j].label+' <i></i></a>');
                    if(this.attributes[j].name == this.meta.sort)
                        links.find('i').addClass('icon-'+this.meta.sort_by);
                    else links.find('i').addClass('icon-SORT');
                    if(this.attributes[j].columnOption.width != '')
                        col.css('width', this.attributes[j].columnOption.width);
                    col.append(links);
                } else {
                    col.html(this.attributes[j].label);
                }
            }
            row.append(col);
        }
    },
    setBody:function(){
        
    },
    fetch:function(options){
        if(!options) options={}
        if(!options.success){
            options.success = function(){
                alert(0)
            }
        }
        this.collection.fetch(options)
    }
})

var Filter = function(options) {
    this.initialize(options)
}
_.extend(Filter.prototype,{
    sort:'ordering DESC',
    rowsPerPage:10,
    elements:[
        CMSHml.TextField('search_key','',{ placeholder:'Түлхүүр үг...'}),
        CMSHml.RadioButtonList('published',-1,{1:'Нээлттэй',0:'Хаалттай','-1':'Бүгд'},{separator:' '})
    ],
    initialize:function (options){
        _.extend(this,options)
        this.form = $('<form class="well form-inline"></form>')
        for(name in this.elements){
            this.form.append(this.elements[name],' ')
        }
        this.form.append($('<a href="#" class="btn"><i class="icon-search"></i> Шүүх...</a>'))
    },
    addElement:function(element){
        this.elements.push(element)
        this.form.append(element)
    },
    setValues:function(options){ //options
        for(name in options){
            this.attributes[name].value=options[name]
        }
    },
    getForm:function(){
        return this.form  
    }
})