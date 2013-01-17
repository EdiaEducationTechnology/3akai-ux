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

// load the master sakai object to access all Sakai OAE API methods
require(['jquery', 'sakai/sakai.api.core'], function($, sakai) {
     
    /**
     * @name sakai.opensocial
     *
     * @class opensocial
     *
     * @description
     * opensocial is a widget that embeds a opensocial feed using the opensocial API
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.opensocial = function(tuid, showSettings) {
         
        /////////////////////////////
        // Configuration variables //
        /////////////////////////////
        var DEFAULT_INPUT = 'sakaiproject';

        // DOM jQuery Objects
        var $rootel = $('#' + tuid); //unique container for each widget instance
        var $mainContainer = $('#opensocial_main', $rootel);
        var $settingsContainer = $('#opensocial_settings', $rootel);
        var $mainContainer = $('#opensocial_main', $rootel);
        var $settingsForm = $('#opensocial_settings_form', $rootel);
        var $cancelSettings = $('#opensocial_cancel_settings', $rootel);
        var $profileText = $('#opensocial_profile_text', $rootel);
        var $searchText = $('#opensocial_search_text', $rootel);
        var $openSocialXmlUrl = $('#opensocial_xml_url', $rootel);
        var $openSocialConsumerKey = $('#opensocial_consumer_key', $rootel);
        var $openSocialConsumerSecret = $('#opensocial_consumer_secret', $rootel);
        

        ///////////////////////
        // Utility functions //
        ///////////////////////
        
        /**
         * Checks if the provided profile or query is non-empty and returns it
         * if that is the case. If it is empty it returns the DEFAULT_INPUT
         *
         * @param {String} openSocialXmlUrl The profile or query
         */
        var checkInput = function(openSocialXmlUrl) {
            return (openSocialXmlUrl && $.trim(openSocialXmlUrl)) ? $.trim(openSocialXmlUrl) : DEFAULT_INPUT;
        };


        

        /////////////////////////
        // Main View functions //
        /////////////////////////

        /**
         * Shows the Main view that contains the opensocial widget
         *
         * @param {String} openSocialXmlUrl The profile name or query
         * @param {String} widgetType Is it a profile or a search widget
         */
         
        var showMainView = function() {
        	$mainContainer.show();
        }
        
        
        var retrieveWidgetData = function (callback) {
        	
            // get the data associated with this widget
            sakai.api.Widgets.loadWidgetData(tuid, function (success, data) {
            	
            	callback(data);
            	
            });
            
            
            
        };
        
            

        ////////////////////
        // Event Handlers //
        ////////////////////

        $settingsForm.on('submit', function(ev) {
            // get the selected input
            var openSocialXmlUrl = $openSocialXmlUrl.val();
            var openSocialConsumerKey = $openSocialConsumerKey.val();
            var openSocialConsumerSecret = $openSocialConsumerSecret.val();
            
            // save the selected input
            sakai.api.Widgets.saveWidgetData(tuid, {
                openSocialXmlUrl: openSocialXmlUrl,
                openSocialConsumerKey: openSocialConsumerKey,
            	openSocialConsumerSecret : openSocialConsumerSecret
            },
                function(success, data) {
                    if (success) {
                        // Settings finished, switch to Main view
                        sakai.api.Widgets.Container.informFinish(tuid, 'opensocial');
                    }
                }
            );
            return false
        });

        $cancelSettings.on('click', function() {
            sakai.api.Widgets.Container.informFinish(tuid, 'opensocial');
        });


        /////////////////////////////
        // Initialization function //
        /////////////////////////////
        
        
        var init = function(widgetData){
        	
        	var encodedXmlURI = '';
        	var consumerKey = '';
        	var consumerSecret = ''
        	
        	
        	 if(widgetData){
        		 
             	encodedXmlURI = encodeURI(widgetData.openSocialXmlUrl);
             	consumerKey = widgetData.openSocialConsumerKey;
             	consumerSecret = widgetData.openSocialConsumerSecret;
        	 }
        	 
        	
        	if (showSettings) {
        		$rootel.find('#opensocial_xml_url').val(encodedXmlURI);
        		$rootel.find('#opensocial_consumer_key').val(consumerKey);
        		$rootel.find('#opensocial_consumer_secret').val(consumerSecret);
        		
        		
                $settingsContainer.show();
            } else {
                showMainView();
                
                if(widgetData){
			    $.getJSON('/system/opensocial/shindigtoken?widgetId='+tuid, {}, function(data){
 				
				var token = data.token;
				token = encodeURI(token);

				var url = 'http://localhost:8080/gadgets/ifr?url='+encodedXmlURI+'&st='+token;


			  	$rootel.find(".open_social_iframe").attr('src', url);


                  });
                	
                    
                    
                }
            }
        }
        
        
        
        /**
         * Initialization function DOCUMENTATION
         */
        var doInit = function() {
        	
        	var widgetData = retrieveWidgetData(init);
        	
          
            
            
            
        };
        
        // run the initialization function when the widget object loads
        doInit();
    };

    // inform Sakai OAE that this widget has loaded and is ready to run
    sakai.api.Widgets.widgetLoader.informOnLoad('opensocial');
});


