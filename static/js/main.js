(function(){
var CMS
CMS = this.CMS = {}
CMS.VERSION = '0.0.1'
    
var Event = CMS.Event = {
}
    
    
var View = CMS.View = function(options){
    this.initialize(options)
}
_.extend(View.prototype,Event,{
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
            
            $.get(this.root_url+'templates/'+options.file_name+'.html',function(data){
                this.template_string = data
                $('#templates').append(this.template_string)
                options.success()
            })    
        }
        else{
            $('#templates').append(this.template_string)
            options.success()
        }
    },
    init_model:function(options){
        this.current_action = options.action
        options.success()
    },
    render:function(options){
        $('#page_content').empty()
        $('#page_content').html(_.template($('#template_'+this.alias+'_'+this.current_action).html()))
    },
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

