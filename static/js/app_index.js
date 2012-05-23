var News = Backbone.Model.extend({
    url:'api/news'
})
var NewsCollection = Backbone.Collection.extend({
    model:News,
    url:'api/news'
    
    
    
})
var DashboardView = CMS.View.extend({
    alias:'dashboard',
    current_action:'dashboard',
    initialize:function(options){
        _.extend(this, options)
        var me = this
        this.router.route("", "run", function(){me.run({})})
    },
    select_menu:function(){
        this.router.mainView.select_menu(0)
    }
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
    current_action:'list',
    initialize:function(options){
        _.extend(this,options)
        var me = this
        this.model = new News
        this.alias = 'news'
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
        this.action = options.action
        if(!options.template)
            options.template = this.alias
        this.init_template({file_name:options.template, success:function(){
            me.init_model({ params:options.url_params, success:function(){
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
        if(this.action=='list'){
            this.filter = new Filter({})
            this.list = new List({collection: new NewsCollection(),filter: this.filter})
            
            //alert(this.list.setElement().html()) 
        }
        else if(this.action=='edit'){
            
        }
        options.success()
    },
    render:function(options){
        $('#page_content').empty()
        $('#page_content').html(_.template($('#template_'+this.alias+'_'+this.current_action).html()))
        $('.filter').append(this.filter.form)
        $('.list').append(this.list.setElement())
        this.select_menu()
    },
    select_menu:function(){
        this.router.mainView.select_menu(1)
    }
})

var MainView = CMS.View.extend ({
    initialize:function(options){
        this.alias = 'layout'
        this.root_url = options.root_url
        this.menus = options.menus
        this.run({action:'index'})
    },
    render:function(options){
        $('#body').append(_.template($('#template_layout_menu').html(),{menus: this.menus}))
        $('#body').append('<div id="page_content" class="container"></div>')
        $('.dropdown-toggle').dropdown()
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
        var newsView = new NewsView(viewOptions)
        var dashboardView = new DashboardView(viewOptions)
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
