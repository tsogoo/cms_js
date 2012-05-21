(function($){
    //  after confirmation or changing of data checked rows return unchecked
    $.fn.clearCheck = function(){
        $('tbody td input').attr('checked',false)
        $('thead th input').attr('checked',false)
    }
    //  select checked rows id
    $.fn.selectIds = function(command){
        var ids=[];var that=this;
        $('input:checked',this).each(function(){
            switch(command){
                case 'publish':src=$(this).parent().parent().children('.i_state').children('a').children('img').attr('src');if(src.match(/\d/)==0)ids.push($(this).val());break;
                case 'unpublish':src=$(this).parent().parent().children('.i_state').children('a').children('img').attr('src');if(src.match(/\d/)==1)ids.push($(this).val());break;
                case 'delete':ids.push($(this).val());break;
            }
        });
        return ids;
    }
    //  change state function
    $.fn.updateState = function(data){
        if(data!=null)
        $('input:checked',this).each(function(){
            if($.inArray(this.value,data.ids)!=-1){
                img=$(this).parent().parent().children('.i_state').children('a').children('img');
                    src=img.attr('src').replace(/\d/,data.state);
                $(img).attr('src',src);
            }
        });
        $(this).clearCheck();
    }
    $.fn.changeStateByOne = function(data,dragged){
        if(data!=null){
            src=$('img',dragged).attr('src');
            src=src.replace(/\d/,data.state);
            $('img',dragged).attr('src',src);
        }
    }
    //  create table, draw it, and attach eventhandlers
    $.fn.initGridView = function(d,options){
        //  filter form connect to table
        form=options.filter.form
        
        var sortField=CMSHml.HiddenField('sort',options.sort)
        var sortBy=CMSHml.HiddenField('sort_by',options.sortby)
        var currentPage=CMSHml.HiddenField('current_page',options.currentPage)
        var command=CMSHml.HiddenField('command',options.command)
        var ids=CMSHml.HiddenField('ids',options.ids)
        return
    
        form.append(sortfield,sortby,cpage,command,ids);
        
        form.bind('submit',function(){
            $.ajax({
                type: 'POST',
                url: $(options.filter_form).attr('action'),
                data: $(this).serialize(),
                success: function(data){that.createGridView(data,options)},
                dataType: "json"
            })
            return false
        })
        $(this).createGridView(d,options)
    }
    $.fn.createGridView = function(d,options){
        var defaults = {
            total:'Ð½Ð¸Ð¹Ñ‚',
            pub:'Ð½ÑÑÑ…',
            unpub:'Ñ…Ð°Ð°Ñ…',
            del:'ÑƒÑÑ‚Ð³Ð°Ñ…',
            changeMsg:'Ó¨Ó©Ñ€Ñ‡Ð»Ó©Ñ… Ò¯Ò¯?',
            delMsg:'Ð£ÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?',
            nonSelMsg:'Ð¼Ó©Ñ€ ÑÐ¾Ð½Ð³Ð¾Ð½Ð¾ ÑƒÑƒ!',
            errorMsg:'Ð°Ð»Ð´Ð°Ð°'
        };
        var defopt = {
            commands:['publish','delete']
        }
        var options = $.extend({}, defopt, options);
        var elems=$.extend(defaults,options);
        d.sorting = d.sorting.split(' ')
        $(options.filter_form+' input[name="sorting"]').val(d.sorting[0])
        var s;
        if(d.sorting[1]=='DESC'){s=1;}else{s=0; d.sorting[1]='ASC'}
        $(options.filter_form+' input[name="sortby"]').val(s)
        $(options.filter_form+' input[name="page"]').val(d.pager.currentPage)
        /**
         *  create table, append it and including items
         */
        $(this).find('table, div').remove()
        table=$(document.createElement('table')).attr('id','dtable').attr('cellpadding',0).attr('cellspacing',0).css('width','100%');
        $(this).append(table);
        /**
         *  header
         */
        header=$(document.createElement('thead'));
        row=$(document.createElement('tr')).attr('class','nodrag nodrop');
        header.append(row);
        table.append(header);
        /** 
         *  numbered column
         */
        col=$(document.createElement('th')).html('#').attr('width',5);
        row.append(col);
        /** 
         *  checkbox all box
         */
        
        for(var j = 0; j < d.attributes.length; ++j){
            //  create table column and append it
            col=$(document.createElement('th'));
            if(d.attributes[j].name == 'id'){
                checkbox = $(document.createElement('input')).attr('type','checkbox').attr('id','checkAll');
                col=$(document.createElement('th')).attr('width',5);
                col.append(checkbox);
            }
            if(d.attributes[j].columnOption){
                if(!d.attributes[j].columnOption.align)
                    d.attributes[j].columnOption.align='center'
                col.css('text-align',d.attributes[j].columnOption.align)
                
                if(d.attributes[j].columnOption.order){
                    links=$(document.createElement('a')).attr('href','#').html(d.attributes[j].label).attr('id',d.attributes[j].name);
                    if(d.attributes[j].name==d.sorting[0])links.attr('class',d.sorting[1]);
                    if(d.attributes[j].columnOption.width!='')col.attr('width',d.attributes[j].columnOption.width);
                    col.append(links);
                }else{
                    col.html(d.attributes[j].label);
                }
            }
            row.append(col);
        }
        //  end header
        /** 
         *  data
         */
        tbody=$(document.createElement('tbody'));
        table.append(tbody);
        
        $(this).appendData(d)
        
        //  end data
        /*
         *  check all function it is also available in yii cactivecheckbox
         *  add event handler to checkbox element
         */
        $('#dtable thead th input').bind('click',function(){
            $('#dtable tbody td input').attr('checked',this.checked)
        });
        $('#dtable tbody td input').bind('click',function(){
            $('#dtable thead th input').attr('checked',!($('#dtable tbody td input:not(:checked)').length))
        });
        //  end check all function
        /**
         *  footer including(pagination, delete,change state buttons)
         */
        //  pagination buttons
        var pages=Math.ceil(d.pager.total/d.pager.size)
        pager=$(document.createElement('div')).attr('class','pagination').html(elems.total+' : '+d.pager.total+'<span class="separator">|</span> ');
        
        if(d.pager.currentPage+1<pages){
            nextPage=$(document.createElement('tr')).attr('class','nodrag row1').attr('id','nextPage');
            row=$(document.createElement('td')).attr({colspan:d.attributes.length+1}).css('text-align','center');
            nextPageLink=$(document.createElement('a')).attr('href','#');
            nextPageImg=$(document.createElement('img')).attr('src',d.baseUrl+'/imgs/admin/bmove.gif');
            nextPageLink.append(nextPageImg);
            row.append(nextPageLink);
            nextPage.append(row);
            $('#dtable tbody',this).append(nextPage);
            $('#nextPage a').bind('click',function(){
                $(options.filter_form+' input[name="page"]').val(d.pager.currentPage+1)
                $.ajax({
                    type: 'POST',
                    url: $(options.filter_form).attr('action'),
                    data: $(options.filter_form).serialize(),
                    success: function(data){that.createGridView(data,options)},
                    dataType: "json"
                })
                return false
            });
        }
        if(d.pager.currentPage>0){
            prevPage=$(document.createElement('tr')).attr('class','nodrag row1').attr('id','prevPage');
            row=$(document.createElement('td')).attr('colspan',d.attributes.length+1).css('text-align','center');
            prevPageLink=$(document.createElement('a')).attr('href','#');
            prevPageImg=$(document.createElement('img')).attr('src',d.baseUrl+'/imgs/admin/atop.gif');
            prevPageLink.append(prevPageImg);
            row.append(prevPageLink);
            prevPage.append(row);
            $('#dtable',this).prepend(prevPage);
            $('#prevPage a').bind('click',function(){
                $(options.filter_form).find('input[name="page"]').val(d.pager.currentPage-1)
                $.ajax({
                    type: 'POST',
                    url: $(options.filter_form).attr('action'),
                    data: $(options.filter_form).serialize(),
                    success: function(data){that.createGridView(data,options)},
                    dataType: "json"
                })
                return false
            });
        }
        for(var i=1;i<=pages;i++){
            if(i-1==d.pager.currentPage){pageNum=$(document.createElement('span')).html(i)}
            else{pageNum=$(document.createElement('a')).attr('href','#').html(i)}
            pager.append(pageNum);
        }
        footer=$(document.createElement('div')).attr('class','list_foot');
        $(this).append(footer);
        footer.append(pager);
        that=$(this)
        //  pagination request
        $('.pagination a').bind('click',function(){
            $(options.filter_form).find('input[name="page"]').val($(this).html()-1)
            $.ajax({
                type: 'POST',
                url: $(options.filter_form).attr('action'),
                data: $(options.filter_form).serialize(),
                success: function(data){that.createGridView(data,options)},
                dataType: "json"
            })
            return false
        });
        //  creating delete, change state buttons
        commands=$(document.createElement('div')).attr('class','li_commands');
        for(i in options.commands){
            if(options.commands[i]=='publish'){
                commands.append($(document.createElement('a')).attr('href','#').attr('class','li_pub').html(elems.pub).attr('id','publish'));
                commands.append($(document.createElement('a')).attr('href','#').attr('class','li_unp').html(elems.unpub).attr('id','unpublish'))
            }
            else if(options.commands[i]=='delete'){
                commands.append($(document.createElement('a')).attr('href','#').attr('class','li_del').html(elems.del).attr('id','delete'));
            }
            else{
                commands.append($(document.createElement('a')).attr('href','#').attr('class','li_'.options.commands[i]).html(options.commands[i]).attr('id',options.commands[i]));
            }
        }
        footer.append(commands);
        clr=$(document.createElement('div')).attr('class','clr');
        footer.append(clr);
        //  delete and change state request
        $('.li_commands a').bind('click',function(){
            if($('#dtable tbody td input:checked').length>0){
                var command=$(this).attr('id');var ids = $('#dtable tbody',that).selectIds(command);
                if(ids!=''){
                confirmation=elems.changeMsg;
                if(command == 'delete') confirmation=elems.delMsg;
                if(confirm(confirmation)){
                    $(options.filter_form+ ' input[name="command"]').val(command)
                    $(options.filter_form+ ' input[name="ids"]').val(ids)
                    $.ajax({
                        type: 'POST',
                        url: $(options.filter_form).attr('action'),
                        data: $(options.filter_form).serialize(),
                        success: function(data){if(command!='delete'){$('#dtable tbody').updateState(data)}else{that.createGridView(data,options)}},
                        dataType: "json"
                    });
                    $(options.filter_form+ ' input[name="command"]').val('')
                    $(options.filter_form+ ' input[name="ids"]').val('')
                }else{that.clearCheck()}}else{that.clearCheck()}
            }else{alert(elems.nonSelMsg)}
            return false;
        });
        //  end footer
        /**
         *  sort request
         */
        $('#dtable th a').bind('click',function(){
            var sorting;
            sorting=$(this).attr('id');
            if($(options.filter_form+' #sorting').val()==sorting){sortby=($(options.filter_form+' #sortby').val($(options.filter_form+' #sortby').val()*(-1)+1));}
            else {$(options.filter_form+' #sorting').val(sorting); $(options.filter_form+' #sortby').val(0)}
            $.ajax({
                type: 'POST',
                url: $(options.filter_form).attr('action'),
                data: $(options.filter_form).serialize(),
                success: function(data){that.createGridView(data,options)},
                dataType: "json"
            })
            return false;
        });
        //  ajax change state request
        $('.i_state a').bind('click',function(){
            dragged=this
            id=$(this).parent().parent().children('td').children('input:checkbox').val();
            src=$('img',this).attr('src');state=src.charAt(src.length-5);state=state*(-1)+1;
            $.ajax({
                type: 'POST',
                url: $(options.filter_form).attr('action'),
                data: ({'id':id,'state':state, 'command':'ajaxpub',YII_CSRF_TOKEN : options.CSRF_token}),
                success: function(data){$('#dtable tbody').changeStateByOne(data,dragged)},
                dataType: "json"
            });
            return false
        });
        //  table drag and drop, used in changing order of data
        if(d.sorting[0] == 'i_ordering'){
            $("#dtable").tableDnD({dragHandle: "dragHandle",
                onDrop: function(table, row){
                    var pag,up,sortby,size;
                    if($('td input:checkbox',row).val()==$('tbody tr:last td input:checkbox',table).val() && $('tbody #nextPage',table).length){/*next page*/size=d.pager.size;pag=d.pager.currentPage;data=$('td > input:checkbox',row).val()+','+$('.dragHandle > img',row).attr('alt');up=0;
                    }else if($('td input:checkbox',row).val()==$('tbody tr:first td input:checkbox',table).val() && $('tbody #prevPage',table).length){/*prev page*/size=d.pager.size;pag=d.pager.currentPage;data=$('td > input:checkbox',row).val()+','+$('.dragHandle > img',row).attr('alt');up=1;}
                    else{data=$("#dtable tbody").orderValues();size='';pag='';up='';sortby='';}
                    if(data!='')
                    $.ajax({
                        type: "POST",
                        url: $(options.filter_form).attr('action'),
                        data: ({'order':data,'size':size,'page':pag,'up':up,'sortby':d.sorting[1],'command':'order','YII_CSRF_TOKEN': options.CSRF_token}),
                        success: function(data){if(data==1){$('tbody',that).afterDrop()}else if(data==0){alert('Ð°Ð»Ð´Ð°Ð°')}else{that.createGridView(data,options)}},
                        dataType: "json"
                    });
                },
                onDragStart: function(table, row){
                }
            });
        }
    }
    // data template
    $.fn.initColumn=function(d, col, i, j){
        if(d.attributes[j].name == 'id'){
            checkbox = $(document.createElement('input')).attr('type','checkbox').attr('value',d.data[i].a.id);
            col.append(checkbox);
        }
        else if(d.attributes[j].name=='i_state'){
            var linker=$(document.createElement('a')).attr('href','#');
            var img=$(document.createElement('img')).attr('src',d.baseUrl+'/imgs/admin/astat'+d.data[i].a.i_state+'.gif');
            linker.append(img);
            col.append(linker);
        }
        else if(d.attributes[j].name=='i_ordering'){
            if(d.sorting[0] == 'i_ordering'){
                var img=$(document.createElement('img')).attr('src',d.baseUrl+'/imgs/admin/amove.gif').attr('alt',d.data[i].a.i_ordering);
                col.append(img).attr('class','dragHandle');
            }
        }
        else{
            var template
            if(d.attributes[j].template){
                template = jsontemplate.Template(d.attributes[j].template);
                template = template.expand(d.data[i].a)
            }
            else template = eval('d.data[i].a.'+d.attributes[j].name)
            //alert(d.data[i].a.title);
            col.html(template);
        }
        return col
    }
    $.fn.appendData=function(d){
        for(var i = 0; i < d.data.length; ++i){
            //  create table row and append it
            row=$(document.createElement('tr')).attr('class','nodrag row'+i%2);
            $(this).find('tbody').append(row);
            //  numbering column
            col=$(document.createElement('td')).html((i+1+d.pager.currentPage*d.pager.size)+'.').css('font-weight','bold');
            row.append(col);
            for(var j = 0; j < d.attributes.length; ++j){
                //  create table column and append it
                var col=$(document.createElement('td')).addClass(d.attributes[j].name);
                var align = 'center'
                if(d.attributes[j].columnOption){
                    if(d.attributes[j].columnOption.align){
                        align = d.attributes[j].columnOption.align
                    }
                }
                col.css('text-align',align)
                row.append($(this).initColumn(d,col,i,j));
            }
        }
    }
    //  after Drop , renumber and change row style, class, etc..
    $.fn.afterDrop=function(){
        $(this).reNumber();
        $("tr:even",this).removeClass('row1').addClass('row0');
        $("tr:odd",this).removeClass('row0').addClass('row1');
        $('#dtable tbody').updateOrderValues();
    }
    //  renumber column numbers
    $.fn.reNumber=function(){
        var num=1;
        $("tr",this).not("#nextPage,#prevPage").each(function(){
            $('td:first',this).html(num+'.')
            num++;
        });
    }
    $.fn.orderValues=function(){
        var values=[];
        $('tr',this).not("#nextPage,#prevPage").each(function(){
            values.push($('.dragHandle > img',this).attr('alt'))
        });
        if($('#sorting').val()=='i_ordering' && $('#sortby').val()=='DESC'){
            values.sort(sortNumDesc)
        }
        else{values.sort(sortNumAsc)}
        var vals=[];var j=0;
        $('tr',this).not("#nextPage,#prevPage").each(function(){
            if($('.dragHandle > img',this).attr('alt')!=values[j]){
            vals.push($('td > input:checkbox',this).val()+','+values[j])
            }j++;
        });
        return vals;
    }
    $.fn.updateOrderValues=function(){
        var values=[];
        $('tr',this).not("#nextPage,#prevPage").each(function(){
            values.push($('.dragHandle > img',this).attr('alt'))
        });
        if($('#sorting').val()=='i_ordering' && $('#sortby').val()=='DESC'){
            values.sort(sortNumDesc)
        }else{values.sort(sortNumAsc)}
        var j=0;
        $('tr',this).not("#nextPage,#prevPage").each(function(){
            $('.dragHandle > img',this).attr('alt',values[j]);j++;
        });
    }
    function sortNumDesc(a,b){return a-b}
    function sortNumAsc(a,b){return b-a}
})(jQuery);