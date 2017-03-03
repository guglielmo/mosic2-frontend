var $buo_show=function(){var op=this.op=window._buorgres;var jsv=24;var tv=jsv;var ll=op.ll;var pageurl=op.pageurl||location.hostname||"x";var bb=$bu_getBrowser();var burl=(/file:/.test(location.href))?"":"//browser-update.org/";if(!op.url){if(op.l)
    op.url=burl+ll+"/update-browser.html#"+tv+":"+pageurl;else
    op.url=burl+"update-browser.html#"+tv+":"+pageurl;}
    var frac=1000;if(Math.random()*frac<1&&!this.op.test&&!this.op.betatest){var i=new Image();var txt=op["text_"+ll]||op.text||"";var extra=encodeURIComponent("frac="+frac+"&txt="+txt+"&apiver="+op.apiver);i.src=burl+"count.php?what=noti&from="+bb.n+"&fromv="+bb.v+"&ref="+ escape(pageurl)+"&jsv="+jsv+"&tv="+tv+"&extra="+extra;}
    function busprintf(){var args=arguments;var data=args[0];for(var k=1;k<args.length;++k){data=data.replace(/%s/,args[k]);}
        return data;}

    var t = {};
    t.it = '<b>Il suo browser web ({brow_name}) non è aggiornato e non dispone dei requisiti minimi per eseguire correttamente questa' +
        ' applicazione</b>. Aggiorni il suo browser per ottenere maggiore sicurezza, e la migliore esperienza possibile su questo sito.';
    t=op["text_"+ll]||op.text||t[ll]||t.en;var tar="";if(op.newwindow)
        tar=' target="_blank" rel="noopener"';var div=this.op.div=document.createElement("div");div.id="buorg";div.className="buorg";var style='<style>.buorg {background: #FDF2AB no-repeat 14px center url('+burl+'img/small/'+bb.n+'.png);}</style>';if(t.indexOf("{brow_name}")===-1){t=busprintf(t,bb.t,' id="buorgul" href="'+this.op.url+'"'+tar);style+="<style>.buorg {position:absolute;position:fixed;z-index:111111;    width:100%; top:0px; left:0px;    border-bottom:1px solid #A29330;    text-align:left; cursor:pointer;    font: 13px Arial,sans-serif;color:#000;}\
    .buorg div { padding:5px 36px 5px 40px; }\
    .buorg>div>a,.buorg>div>a:visited{color:#E25600; text-decoration: underline;}\
    #buorgclose{position:absolute;right:6px;top:0px;height:20px;width:12px;font:18px bold;padding:0;}\
    #buorga{display:block;}\
    @media only screen and (max-width: 700px){.buorg div { padding:5px 15px 5px 9px; }}</style>";div.innerHTML='<div>'+t+'<div id="buorgclose"><a id="buorga">&times;</a></div></div>'+style;}
    else{style+="<style>.buorg {background-position: 8px 17px; position:absolute;position:fixed;z-index:111111;    width:100%; top:0px; left:0px;    border-bottom:1px solid #A29330;    text-align:left; cursor:pointer;        background-color: #fff8ea;    font: 17px Calibri,Helvetica,Arial,sans-serif;    box-shadow: 0 0 5px rgba(0,0,0,0.2);}\
    .buorg div { padding: 11px 12px 11px 30px;  line-height: 1.7em; }\
    .buorg div a,.buorg div a:visited{   text-indent: 0; color: #fff;    text-decoration: none;    box-shadow: 0 0 2px rgba(0,0,0,0.4);    padding: 1px 10px;    border-radius: 4px;    font-weight: normal;    background: #5ab400;    white-space: nowrap;    margin: 0 2px; display: inline-block;}\
    #buorgig{ background-color: #edbc68;}\
    @media only screen and (max-width: 700px){.buorg div { padding:5px 12px 5px 9px; text-indent: 22px;line-height: 1.3em;}.buorg {background-position: 9px 8px;}}</style>";t=t.replace("{brow_name}",bb.t).replace("{up_but}",' id="buorgul" href="'+this.op.url+'"'+tar).replace("{ignore_but}",' id="buorgig" href=""');div.innerHTML='<div>'+t+'</div>'+style;}
    this.op.text=t;document.body.insertBefore(div,document.body.firstChild);var me=this;div.onclick=function(){if(me.op.newwindow)
        window.open(me.op.url,"_blank");else
        window.location.href=me.op.url;me.op.setCookie(me.op.reminderClosed);me.op.onclick(me.op);return false;};try{document.getElementById("buorgul").onclick=function(e){e=e||window.event;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;me.op.div.style.display="none";hm.style.marginTop=me.op.bodymt;me.op.onclick(me.op);return true;};}
    catch(e){}
    var hm=document.getElementsByTagName("html")[0]||document.body;this.op.bodymt=hm.style.marginTop;hm.style.marginTop=(div.clientHeight)+"px";(function(me){(document.getElementById("buorga")||document.getElementById("buorgig")).onclick=function(e){e=e||window.event;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;me.op.div.style.display="none";hm.style.marginTop=me.op.bodymt;me.op.onclose(me.op);me.op.setCookie(me.op.reminderClosed);return false;};})(me);if(this.op.noclose){var el=(document.getElementById("buorga")||document.getElementById("buorgig"));el.parentNode.removeChild(el);}
    this.op.onshow(this.op);};$buo_show();