(function($ftt){
    $ftt.module.create("MOD_PROFILE_EDITOR", function(name, parent, ajax){
        var $module = this;

        var ajax = function(f, p, c){
            storage.callMethod("myfamily", "FTTMyFamily", f, p, function(res){
                c(storage.getJSON(res.responseText));
            })
        }

        return this;
    });
})($FamilyTreeTop)



