/**
 * Copyright (c) 2011
 *  Tsogoo
 **/
(function($){
    $.fn.extend({
    tseasyinput : function(options) {
        if (!$.event._dpCache) $.event._dpCache = [];
        var defaults = {
            emptystring : 'empty'
            ,value      : ''
            ,emptyclass  : 'empty'
            ,change : function(value){}
            
        }
        return this.each(function() {
            if(options) {
                options = $.extend(defaults, options);
            }
            var o   = options;
            var obj = $(this);
            obj.val(o.value)
            if(trim(obj.val()) == '')
                obj.val(o.emptystring)
            if(obj.val() == o.emptystring){
                obj.addClass(o.emptyclass)
            }
            obj.focus(function(){
                if(trim(obj.val()) == o.emptystring){
                    obj.val('')
                    obj.removeClass(o.emptyclass)
                }
            }).blur(function(){
                obj.val(trim(obj.val()))
                if(obj.val() == '' || obj.val() == o.emptystring){
                    obj.val(o.emptystring)
                    obj.addClass(o.emptyclass)
                }
            }).change(function(k){
                o.change(k)
            })
        });
    }
    })
})(jQuery)
function TsEasyHtml(){
}
TsEasyHtml.RadioButtonListIndex=0
TsEasyHtml.RadioButtonList = function(name,selected_value,values,options,option){
    var str=""
        if(!option){
        option={separator:' '}
    }
    for(var val=0; val<values.length; val++){
        TsEasyHtml.RadioButtonListIndex++
        str+='<input type="radio" name="'+name+'" value="'+values[val].value+'" id="'+name+TsEasyHtml.RadioButtonListIndex+'"'
        if(values[val].value == selected_value){
            str+=' checked="checked"'
        }
        for(opt in options){
            str+=' '+options[opt][0]+'="'+options[opt][1]+'"'
        }
        str+=' /><label for="'+name+TsEasyHtml.RadioButtonListIndex+'">'+values[val].label+'</label>'+option.separator;
    }
    return $(str)
}
TsEasyHtml.DropDownList = function(name,selected_value,values,options){
    var str='<select name="'+name+'"'
    for(opt in options){
        if(options[opt][1] != "")
            str+=' '+options[opt][0]+'="'+options[opt][1]+'"'
    }
    str+='>'
    for(var val in values){
        str+='<option value="'+values[val].value+'"'
        if(values[val].value == selected_value){
            str+=' selected="selected"'
        }
        str+=">"
        str+=values[val].label+'</option>'
    }
    str+='</select>'
    return $(str)
}
