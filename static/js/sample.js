$(function(){
            $('.filterDiv .radio_published, .filterDiv .radio_type, .filterDiv select').change(function(){
                $('#fForm').submit()
            })
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
                else if(d.attributes[j].name=='title'){
                    var template
                    template = jsontemplate.fromString('meta: aaabbb\n\n<a href="/mcs_holding/index.php/admin/news/edit/id/aaaidbbb">aaatitlebbb</a>');
                    template = template.expand(d.data[i].a)
                    col.append(template);
                }
                else {
                    var template
                    if(d.attributes[j].template){
                        template = jsontemplate.Template(d.attributes[j].template);
                        template = template.expand(d.data[i].a)
                    }
                    else template = eval('d.data[i].a.'+d.attributes[j].name)
                    col.append(template);
                }
                return col;
            }
        })