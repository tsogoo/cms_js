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
        
        /* options {action:'action name', template:'template name', url_params: 'url parameters'}*/
        run:function(options){
            var me = this
            if(!options.template)
                options.template = options.action
            this.init_template(options.template,{success:function(){
                me.init_model(options.url_params,{success:function(){
                    me.render()
                }})
            }})
        },
        init_template:function(template,options){
            this.template=template
            options.success()
        },
        init_model:function(url_params, options){
            options.success()
        },
        render:function(){
            alert(this.template)
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
    
        // Inherit class (static) properties from parent.
        _.extend(child, parent);
    
        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    
        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);
    
        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);
    
        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;
    
        // Set a convenience property in case the parent's prototype is needed later.
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

var NewsView = CMS.View.extend({
    initialize:function(options){
        var me = this
        this.router = options.router
        this.router.route('news/list','list',function(){me.run({action:'list',url_params:{}})})
        this.router.route('news/list/:search/:publish/:page','list',
            function(search,publish,page){me.run({action:'list',url_params:{search:search,publish:publish,page:page}})})
        
    }
})
var IndexRouter = Backbone.Router.extend({
    routes:{},
    initialize:function(options){
        var newsView = new NewsView({router:this})
    }
    
})
$(function(){
    var indexRouter = new IndexRouter({})
    Backbone.history.start()
})
