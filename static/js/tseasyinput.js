/**
 *  Copyright (c) 2012
 *  Tsogoo
**/
function CMSHml(){
}
CMSHml.TextField = function(name, value, options){
    var str='<input type="text" name="'+name+'" value="'+value+'"'
    for(opt in options){
        str+=' '+opt+'="'+options[opt]+'"'
    }
    return str+ ' />'
}
CMSHml.HiddenField = function(name, value, options){
    var str='<input type="hidden" name="'+name+'" value="'+value+'"'
    for(opt in options){
        str+=' '+opt+'="'+options[opt]+'"'
    }
    return str+ ' />'
}
CMSHml.Button = function(name, options){
    var str='<input type="button" value="'+name+'" class="btn"'
    for(opt in options){
        str+=' '+opt+'="'+options[opt]+'"'
    }
    return str+ ' />'
}
CMSHml.RadioButtonList = function(name,selected_value,values,options){
    var str=""
    if(!options.separator){
        options.separator = '&nbsp;'
    }
    for(value in values){
        str+='<label class="radio"><input type="radio" name="'+name+'" value="'+value+'"'
        if(value == selected_value){
            str+=' checked="checked"'
        }
        if(options.length){
            for(opt in options){
                if(opt != 'separator')
                    str+=' '+opt+'="'+options[opt]+'"'
            }
        }
        str+=' />'+values[value]+'</label>'+options.separator;
    }
    return str
}
CMSHml.DropDownList = function(name,selected_value,values,options){
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
