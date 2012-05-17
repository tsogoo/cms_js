var News = Backbone.Model.extend({
})
var NewsCollection = Backbone.Collection.extend({
    
})
var NewsView = CMS.View.extend({
    params:{
        search:'',
        publish:'all',
        page:2,
    },
    list_fields:[],
    edit_fields:[],
    templates:{ list:null, edit:null},
    initialize:function(options){
        var me = this
        this.model = new News
        this.collection = new NewsCollection
        this.alias = 'news'
        this.router = options.router
        this.root_url = options.root_url
        this.router.route("news", "run", function(){me.run({action:'list'})})
        this.router.route("news/list", "run", function(){me.run({action:'list'})})
        this.router.route("news/list/:page", "run", function(page){me.run({action:'list',url_params:{page:page}})})
        this.router.route("news/list/:search/:publish/:page", "run", function(search,publish,page){ me.run({action:'list', url_params:{search:search,publish:publish,page:page}})})
        this.router.route("news/new", "run", function(){me.run({action:'edit'})})
        this.router.route("news/edit/:id", "run", function(id){me.run({action:'edit', url_params:{id:id}})})
    },


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
            var me = this
            $.get(this.root_url+'templates/'+options.file_name+'.html',function(data){
                me.template_string = data
                $('body').append(me.template_string)
                options.success()
            })
        }
        else{
            $('body').append(this.template_string)
            options.success()
        }
    },
    init_model:function(options){
        this.current_action = options.action
        this.model = 
        options.success()
    },
    render:function(options){
        $('#page_content').empty()
        $('#page_content').html(_.template($('#template_'+this.alias+'_'+this.current_action).html()))
        this.router.mainView.select_menu(1)
    },
})
var List = function(options) {
    this.initialize(options)
}
_.extend(List.prototype,{
    initialize:function (options){
        this.collection = options.collection
        this.listFields = options.fields
    },
    initField:function(){
        
    }
})
var MainView = CMS.View.extend ({
    initialize:function(options){
        this.alias = 'layout'
        this.root_url = options.root_url
        this.menus = options.menus
        this.run({action:'index'})
    },
    init_model:function(options){
        this.list = new List({collection: new NewsCollection()})
        this.list.initField = function(){alert(1)}
        this.list.initField()
        options.success()
    },
    render:function(options){
        $('#body').append(_.template($('#template_layout_menu').html(),{menus: this.menus}))
        $('#body').append('<div id="page_content"></div>')
    },
    select_menu:function(index){
        for( var i=0; i<$('#main_menu').children().length; i++){
            $('#main_menu li').removeClass('active')
            if(i == index){
                $('#main_menu li:nth-child('+(i+1)+')').addClass('active')
                return
            }
        }
    }
})
var AppRouter = Backbone.Router.extend({
    modules: {'News':null},
    initialize: function(options){
        this.mainView = new MainView({root_url:options.root_url, menus:options.menus})
        var viewOptions = {router: this, root_url: options.root_url}
        var view = new NewsView(viewOptions)
        for(var module in this.modules){
            //var view = eval('new '+module+'View(viewOptions)')
        }
    },
    routes: {
        "": "index",
        "help": "help",
    },
    index: function(page){
    }
})
$(function(){
    var menus = [
        {label:'Хянах самбар', url:'', items:[]},
        {label:'Мэдээ мэдээлэл', url:'news', items:[]},
        {label:'Мэдиа', url:'fm', items:[
            {label:'Image manager', url:'im'},
            {label:'File manager', url:'fm'}
        ]}
    ]
    var appRouter = new AppRouter({root_url:'/static/', menus: menus});
    Backbone.history.start();
})
