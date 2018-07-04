/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        /* key and at least value given, set cookie... */
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', /* use expires attribute, max-age is not supported by IE */
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        /* key and possibly options given, get cookie... */
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); /*  IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined */
        }
        return null;
    };
})(jQuery);

/*!
 * Papertank Cookie Plugin v0.2 
 * https://github.com/papertank/eu-cookie
 */
(function ($) {
    
    $.pt_cookie = function (options) {

        var defaults = {
            info_link: "http://www.allaboutcookies.org/",
            message: "We need your consent to store cookies on your computer. These improve your experience and help us remember you.",
            info_label: "Learn More",
            close_label: "Close",
            css_path: '/',
            cookie_domain: '', /* if using across subdomains */
            cookie_expires: 365,
            default_action: 'accept', /* accept / decline */
            always_show: false,

        };
        var options = $.extend(defaults, options);        
                
        var wrapper_style = '';
        
        /* Added check incase we got our knickers in a twist and _both_ cookies are set */
        if ( ( $.cookie("pt-euc_accept") == 'pt-euc_accept' ) && ( $.cookie("pt-euc_decline") == 'pt-euc_decline' ) )
        {
	        
	        $.cookie("pt-euc_accept", null, {
                path: '/',
                domain: options.cookie_domain
            });
            
            $.cookie("pt-euc_decline", null, {
                path: '/',
                domain: options.cookie_domain
            });
            
            location.reload();
	        
        }
        
        
        if ( ( $.cookie("pt-euc_accept") == null ) && ( $.cookie("pt-euc_decline") == null ) )
        {
        	/* The user hasn't chosen to accept or decline yet */
        	
        	var $cookie_accepted = ( options.default_action == 'accept' );
        	var $cookie_declined = ( options.default_action == 'decline' );
        
        	if ( options.always_show == false )
        	{
	        	$.cookie("pt-euc_"+options.default_action, "pt-euc_"+options.default_action, {
	                expires: options.cookie_expires,
	                domain: options.cookie_domain,
	                path: '/'
	            });
	        }
            
        }
        else
        {
        	/* The user has chosen to accept or decline, so let's hide the box and load the cookies */
        	
        	wrapper_style = 'style="display: none;"'
        	
        	var $cookie_accepted = $.cookie('pt-euc_accept') == "pt-euc_accept";
	        var $cookie_declined = $.cookie('pt-euc_decline') == "pt-euc_decline";
       
        }
        
        $.cookie_accepted = function () {
            return $cookie_accepted;
        };
        
        $.cookie_declined = function () {
            return $cookie_declined;
        }; 
        
        $.accept_cookies = function () {
        	$.cookie("pt-euc_decline", null, {
                path: '/',
                domain: options.cookie_domain
            });
            $.cookie("pt-euc_accept", "pt-euc_accept", {
                expires: options.cookie_expires,
                path: '/',
                domain: options.cookie_domain
            });
            return true;
        }
        
        $.decline_cookies = function () {
        	
        	$.cookie("pt-euc_accept", null, {
                path: '/',
                domain: options.cookie_domain
            });
            $.cookie("pt-euc_decline", "pt-euc_decline", {
                expires: options.cookie_expires,
                path: '/',
                domain: options.cookie_domain
            });
            return true;
        }
        
        $(function() {	

	            $('body').append('\
\
	<div id="pt-euc_wrapper" '+wrapper_style+'> \
\
	    <div id="pt-euc_box"> \
\
	        <div id="pt-euc_message"> \
	            '+options.message+' \
	        </div> \
\
	        <div id="pt-euc_footer"> \
	            <div id="pt-euc_links"> \
	                <a href="'+options.info_link+'" target="_blank">'+options.info_label+'</a> <a href="#" id="pt-euc_close">'+options.close_label+'</a> \
	            </div> \
\
	            <a href="#" id="pt-euc_toggle" class="'+( $.cookie_accepted() ? 'on' : '')+'"> \
	               '+( $.cookie_accepted() ? 'Turn Off' : 'Turn On')+' \
	            </a> \
\
	            <div class="pt-euc_clear"></div> \
\
	        </div> \
\
	    </div> \
\
	    <i id="pt-euc_arrow" style="left: 100%; margin-left: -31px; "></i> \
\
	</div> \
\
	<div id="pt-euc_sticky"> \
	    <a id="pt-euc_cookie"> \
	        <i> </i> \
	    </a> \
	</div> \
	');
			
			if ( $.cookie_accepted() )
			{
				/* Let's get rid of the unnecessary classes across the page (incase styles were applied to them) */
			
				$('.requires_cookies').each(function(i) {
					$(this).removeClass('.requires_cookies');
				});
			}
			else
			{
				/* Let's replace the content in the .requires_cookie elements with a message */
			
				$('.requires_cookies').each(function(i) {
					$(this).html('Sorry, you need to <a href="#" class="pt-euc_enable_cookies">Enable Cookies</a> for this part of the website. <small>&nbsp; <a href="'+options.info_link+'" target="_blank">'+options.info_label+'</a></small>');
				});
			}
	
			
			$('.pt-euc_enable_cookies').click(function(e){
				e.preventDefault();
				$.accept_cookies();
				
				/* We have to reload the page, to allow us to initalise again */
				location.reload();
			});
			
	
	        $('#pt-euc_toggle').click(function(e){
	            e.preventDefault();
	            toggle = $(this);
	            
	            if ( toggle.hasClass('on') ) {
	                
	                toggle.removeClass('on');
	                $.decline_cookies();
	                
	            } else {
	                toggle.addClass('on');
	               	$.accept_cookies();
	            }
	            $("#pt-euc_wrapper").fadeOut(1000, function () {
	
	                /* We have to reload the page, to allow us to initalise again */
	                location.reload();
	            });
	
	        }); 
	        
	        $('#pt-euc_cookie').click(function(e){
	         e.preventDefault();
	         
		         $('#pt-euc_wrapper').fadeToggle();
	         
	        }); 
	        
	        $('#pt-euc_close').click(function(e){
	        	
	        	e.preventDefault();
	        	
	        	if ( ( $.cookie("pt-euc_accept") == null ) && ( $.cookie("pt-euc_decline") == null ) )
	        	{
	        		
					$.cookie("pt-euc_"+options.default_action, "pt-euc_"+options.default_action, {
		                expires: options.cookie_expires,
		                domain: options.cookie_domain,
		                path: '/'
		            });
		                 	
	        	}
	        	
	        	$('#pt-euc_wrapper').fadeOut();
	        	
	        });      
	        
	        $('<link rel="stylesheet" href="'+options.css_path+'cookie.css" />').appendTo("head");    
        
        });

    };

})(jQuery);
