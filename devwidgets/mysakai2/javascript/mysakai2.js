/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
/*global $ */

var sakai = sakai || {};

/**
 * @name sakai.mysakai2
 *
 * @class mysakai2
 *
 * @description
 * Initialize the mysakai2 w    idget
 *
 * @version 0.0.1
 * @param {String} tuid Unique id of the widget
 */
sakai.mysakai2 = function(tuid){


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////

    var rootel = $("#" + tuid);

    var mysakai2List = "#mysakai2_list";
    var mysakai2ListTemplate = "#mysakai2_list_template";
    var mysakai2ErrorNosites = "#mysakai2_error_nosites";


    /**
     * Takes a set of json and renders the sakai2 sites.
     * @param {Object} newjson sakai 2 list object
     */
    var doRender = function(newjson , useDisplayProperties){
        // If the user is not registered for any sites, show the no sites error.
        if (newjson.sites.length === 0) {
            $(mysakai2List, rootel).html(sakai.api.Security.saneHTML($(mysakai2ErrorNosites).html())).addClass("sites_error");
        }
        else {
            // if useDisplayProperties is set..display the first x no. of sites
            var lastIndex = newjson.sites.length;
            if(useDisplayProperties){
                lastIndex = newjson.display;            
            }

            // store result json
            var resultJson = {};
            resultJson.sites = [];
            // loop through the diplay properties if there is no site is slected
            // loop through selected list if sites are selected.            
            for (var i=0;i<lastIndex;i++) {
                var site = newjson.sites[i];
                site.title = sakai.api.Security.escapeHTML(site.title);
                resultJson.sites.push(site);
            }

            $(mysakai2List, rootel).html($.TemplateRenderer(mysakai2ListTemplate.replace(/#/, ''), resultJson));
        }
    };

    /**
     * 
     * 
     */
    var loadSakai2SiteList = function(){
        // get sakai2favouriteList
        sakai.api.Server.loadJSON("/~" + sakai.data.me.user.userid + "/private/sakai2favouriteList",function(success,data){
            if(success){
                sakai.data.me.sakai2List = data;
                doRender(sakai.data.me.sakai2List);    
            } else {
                $.ajax({
                    url: "/devwidgets/mysakai2/bundles/sites.json",
                    type : "GET",
                    dataType: "json",
                    success: function(data){
                        sakai.data.me.sakai2List = data;
                        doRender(sakai.data.me.sakai2List, true);
                    }
                 });   
            }
        });
    };

    ////////////////////
    // Event Handlers //
    ////////////////////

    // Listen for completion of sakai2 favourites site addition
    // to refresh this widget's sites listing
    $(window).bind("sakai2-favourites-selected", function() {
        doInit();
    });

    $("#mysakai2_add_files_link").click(function(ev){
        sakai.sakai2favourites.initialise(); 
    });

    /**
     * Will initiate a request to the my groups service.
     */
    var doInit = function(){
        //get sakai2 list information and then render in my sakai2 widget
        loadSakai2SiteList();
    };


    // Start the request
    doInit();

};

sakai.api.Widgets.widgetLoader.informOnLoad("mysakai2");