define(["config", "encode", "XDM"], function(_config, encoder, XDM) {
    var $t = {};
    $t.module = "api";
    
    var loader = $('<div class="az4db">'+
            '<div class="loader progress progress-info progress-striped active">'+
            '<div class="bar" style="width:100%"></div></div></div>')
            .hide().appendTo($("body"));
    
    // API wrapper for making API requests
    $t.call = function(method, args, cb) {
        // use args variable for callback if only two arguments are passed
        if (!cb && typeof(args)=="function") {
            cb = args;
            args = {};
        }
        
        // data callback variable, basically just passes to handle but with cb too
        var dd = function(data) {
            loader.hide();
            
            handle(data, cb);
        };
        
        // show loader
        loader.show();
        
        // basic AJAX request
        $.ajax({
            // build API request URI
            url: _config.apiBase+"/"+method,
            
            // pass GET parameters
            data: args,
            
            // force JSONP transport
            dataType: "JSONP",
            
            // data callbacks
            success: dd,
            error: dd
        });
    };
    
    $t.post = function(method, args, cb) {
        // show loading bar
        loader.show();
        
        XDM(method, args, function(data) {
            loader.hide();
            
            cb(data);
        });
    };
    
    // handle data from API
    var handle = function(data, cb) {
        // handle some errors and pass them through
        if (!data) {
            return cb({error: "No data fetched"});
        }
        if (data.error) {
            // if AJAX fails miserably, we get a function
            if (typeof data.error == "function") {
                return cb({error: "AJAX error. Try again later or check you are using an up-to-date and correctly configured browser."});
            }
            return cb({error: "API returned error: "+encoder.encode(data.error)});
        }
        
        // no errors? let's pass the data through to the callback!
        cb(data);
    };
    
    return $t;
});
