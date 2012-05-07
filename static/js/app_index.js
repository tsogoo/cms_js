var News = Backbone.Model.extend({
})
var NewsView = Backbone.View.extend({
    params:{
        search:'',
        publish:'all',
        page:2,
    },
    list_fields:[],
    edit_fields:[],
    templates:{ list:null, edit:null},
    initialize:function(options){
        this.model = new News
        this.route = options.route
        var me = this
        this.route.route("news/list", "run", function(){me.run({action:'list'})})
        this.route.route("news/list/:page", "run", function(page){me.run({action:'list',url_params:{page:page}})})
        this.route.route("news/list/:search/:publish/:page", "run", function(search,publish,page){ me.run({action:'list', url_params:{search:search,publish:publish,page:page}})})
        this.route.route("news/new", "run", function(){me.run({action:'edit'})})
        this.route.route("news/edit/:id", "run", function(id){me.run({action:'edit', url_params:{id:id}})})
    },


    /*
    options: {template: 'template-name', action:'action-name', url_params:'url-params'}
    */
    run:function(options){
        var me = this
        if(!options.template)
            options.template = options.action
        this.init_template({name:options.template, success:function(){
            me.init_model({ action:options.action, params:options.url_params, success:function(){
                me.render({template:options.template})
            }})
        }, unsuccess:function(){ alert('error')}})
    },
    init_template:function(options){
        for( temp in this.templates){
            if(options.name == temp){
                if(this.templates[temp]){
                    options.success()
                }
                else {
                    this.templates[temp] = temp
                    options.success()
                }
                return
            }
        }
        options.unsuccess()
    },
    init_model:function(options){
        options.success()
    },
    render:function(options){
        alert(this.templates[options.template])
    },
})
var AppRouter = Backbone.Router.extend({
    modules:{'News':null},
    initialize:function(options){
        for(var module in this.modules){
            var view = eval('new '+module+'View({route:this})')
        }
    },
    routes: {
        "": "index",
        "help": "help",
    },
    index: function(page){
        alert(1)
    }
})
$(function(){
    var appRouter = new AppRouter({});
    Backbone.history.start();
})
