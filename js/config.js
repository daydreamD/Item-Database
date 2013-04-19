define(["cookies"], function(cookies){
    var proto = location.protocol;
    
    if (location.protocol == "file:") proto = "http:";
    
    var regions = {
		eu: {
			name: "Europe",
			desc: "European",
			home: 1,
			flag: "eu",
			pricer: "GBP"
		},
		us: {
			name: "North America",
			desc: "North American",
			home: 110,
			flag: "us",
			pricer: "USD"
		},
		jp: {
			name: "Japan",
			desc: "Japanese",
			home: 383,
			flag: "jp",
			pricer: "YEN"
		},
		hk: {
			name: "Asia",
			desc: "Asian",
			home: 286,
			flag: "hk",
			pricer: "HKD"
		}
	};
	
	// home2dat gen
	var h2d = {};
	for(var ii in regions) {
		h2d[ regions[ ii ].home ] = {
			region: regions[ ii ].name,
			flag: "flag_"+regions[ ii ].flag
		};
	}
    
    // look for saved settings
    var maxRows = cookies.get("az4config_maxRows") || 5;
    var itemTitle = cookies.get("az4config_itemTitle") || "name";

    // basic application settings go here (can be overridden)!
    return {
        // baseURL, where all URLs are created. No trailing slash please
        baseURL: "http://alphazone4.com/store",
        
        apiBase: proto+"//dev.alphazone4.com",
        
        cdnBase: proto+"//cdn.alphazone4.com",
        
        home2Dat: h2d,
        
        regions: regions,
        
        regionLock: false, // only show specified region
        
        categoryLinks: true, // don't enable cat links
        
        maxRows: maxRows, // number of rows of items to show
        
        itemTitle: itemTitle, // what to display on tile list
        
        linkType: "none"
    };
});
