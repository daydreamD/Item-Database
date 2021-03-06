define(["config", "popup", "page_track", "scripts/jquery.history"], function(_config, popup, page_track) {
    
    var History = window.History;
    
    // file header
    var $t = {};
	$t.module = "nav";
    
    // basic nav structure
    var nav = {
        logo: {
            title: "",
            page: ""
        },
        links: [
            {
                name: 'Home',
                page: '',
                type: 'link'
            },
            {
                name: '<i class="az4im flag_eu"></i> Europe',
                page: 'cat/1',
                type: 'link'
            },
            {
                name: '<i class="az4im flag_us"></i> America',
                page: 'cat/110',
                type: 'link'
            },
            {
                name: '<i class="az4im flag_jp"></i> Japan',
                page: 'cat/383',
                type: 'link'
            },
            {
                name: '<i class="az4im flag_hk"></i> Asia',
                page: 'cat/286',
                type: 'link'
            },
            {
                name: "<i class='icon-search icon-white'></i> Search",
                page: "search",
                type: "rlink"
            },
            {
                name: "<i class='icon-cog icon-white'></i> Options",
                page: "settings",
                type: "rlink"
            },
            {
                name: "<i class='icon-info-sign icon-white'></i>",
                page: "about",
                type: "rlink"
            }
        ]
    };
    
    // frame hook
    var frame_hook = null;
    
    // normalises URL back to just the page id
    $t.normaliseURL = function(page) {
        if (!page) return "";
        return page.replace(_config.baseURL, "").replace(/[a-z]+:/, "").replace(/\/+$/, "").replace(/^\/+/, "");
    };
    
    // link handler
    $t.clicky = function(p){
        // remove popup
        popup.hide();
        
        // no page supplied, let's see if we can find a href
        if ( typeof(p) !== "string") {
            // stop other objects firing events
            p.stopPropagation();
            
            // ok, let's grab the href from the event object
            p = p || window.event;
            
            // extract absolute database URL from link
            if (!p.target.href) {
                // search parents for link if this clicked object doesn't contain one
                p = $(p.target).parents("a").attr("href");
            } else {
                p = p.target.href;
            }
            p = $t.normaliseURL(p);
        }
        
        if (frame_hook) frame_hook(p);
        
        return false;
    };
    
    $t.cur_page = null;
    
    var handlePageChange = function(l) {
        if (_config.linkType == "none") return;
        
        // save page title, History.js sometimes erases it
        var save_title = document.title;
        
        // add base path to URL
        var href = _config.basePath+"/"+l+((l!=="")?"/":"");
        var full = _config.baseURL+"/"+l+((l!=="")?"/":"");
        
        // track page change
        page_track(href);
        
        // store current page (normalised first)
        $t.cur_page = $t.normaliseURL(full);
        
        // push state using History library
        History.pushState(null, "PlayStation Home Item Database | AlphaZone4 - Your home away from PlayStation Home", href);
        
        document.title = save_title;
    };
    
    History.Adapter.bind(window, 'statechange', function() {
        if (_config.linkType == "none") return;
        
        // get current state and clean up
        var State = History.getState();
        var href = $t.normaliseURL(State.cleanUrl);
        
        // if page is actually different, tell frame to load new page
        if ($t.cur_page != href) {
            if (frame_hook) frame_hook(href);
        }
    });
    
    var createMenu = function(opt){
        if (!opt) opt = nav;
        
        // basic navbar structure
        var h = $('<div class="navbar navbar-inverse">');
        
        var inner = $('<div class="navbar-inner">');
        h.append(inner);
        
        // add logo/brand
        inner.append( $t.link(opt.logo.title, opt.logo.page, {
            'class' :["brand"]
        }).prepend('<i class="az4im minilogo"></i> ') );
        
        // create list of nav items
        var list = $("<ul class='nav'>");
        var list_right = $("<ul class='nav pull-right'>");
        for(var ii=0; ii<opt.links.length; ii++) {
            var l = $("<li>").html($t.link(opt.links[ii].name, opt.links[ii].page));
            if (opt.links[ii].type == "rlink") {
                list_right.append( l );
            } else {
                list.append( l );
            }
        }
        inner.append(list);
        inner.append(list_right);
        
        return h;
    };
    
    // returns a jQuery object of a navigation bar
    $t.create = function(hook) {
        frame_hook = hook;
        return createMenu();
    };
    
    // returns a jQuery object of a link to an item database page
    $t.link = function(content, page, config){
        // setup initial a object with jQuery
        var a = $("<a>");
        
        // normalise page first
        page = $t.normaliseURL(page);
        
        // set correct URL
        a.attr("href", _config.baseURL+"/"+page);
        
        // set link text
        a.html(content);
        
        // add CSS classes if desired
        if (config && config['class']) {
            if (typeof config['class'] === "string") {
                config['class'] = [ config['class'] ];
            }
            for(var ii=0; ii<config['class'].length; ii++) {
                a.addClass(config['class'][ ii ]);
            }
        }
        
        // add custom click function if specified
        if (config && config.click) {
            a.click(config.click);
        } else {
            // default click handler
            a.click($t.clicky);
        }
        
        return a;
    };
	
	// register hook on page change (so we can update menu items)
	az4db_when("pageChange", handlePageChange);
	
	return $t;
});
