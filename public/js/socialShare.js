// width et heigth are optionnal

const socialShare = function(selector, {link: link, title: title,width: width=640 ,heigth: heigth=320 }) {    
       
    const property      = {link, title, width, heigth};    

    const left          = window.screenLeft || window.screenX;
    const top           = window.screenTop || window.screenY;
    const windowWidth   = window.innerWidth || document.documentElement.clientWidth;
    const windowHeight  = window.innerHeight || document.documentElement.clientHeight;     
    
    const popupLeft     = (left + windowWidth)/2 - property.width/2;
    const popupTop      = (top + windowHeight)/2 - property.heigth/2;

    function twitter(){

        selector.addEventListener('click', function(){

            const name     = "yourname" // the name of the one who shares          
                        
            const dataUrl  = this.getAttribute('data-url');

            const shareUrl = property.link + encodeURIComponent(property.title) + "&via="+ name + "&url="+ encodeURIComponent(dataUrl);
    
            const popup    = window.open(shareUrl, title, `scrollbars=yes, width = ${property.width}, height =${property.heigth}, top=${popupTop}, left=${popupLeft}`);
        });
    }

    function otherSocialNetwork() {

        selector.addEventListener('click', function(){

            const dataUrl  = this.getAttribute('data-url');

            const shareUrl = property.link + dataUrl;
        
            const popup    = window.open(shareUrl, title, `scrollbars=yes, width = ${property.width}, height =${property.heigth}, top=${popupTop}, left=${popupLeft}`);
        });

    }

    const whichSocialNetwork = (/[twitter]/).test(property.link) ? twitter() : otherSocialNetwork();    

}
const twitter   = document.querySelector('.twitter');
// const google    = document.querySelector('.google');
const facebook  = document.querySelector('.facebook');
const linkedin  = document.querySelector('.linkedin');

socialShare(twitter, {link: 'https://twitter.com/intent/tweet?text=', title:"partager avec twitter"} );
// socialShare(google, {link: 'https://plus.google.com/share?url=', title:"partager avec google"});
socialShare(facebook, {link: 'https://www.facebook.com/sharer/sharer.php/u=', title:"partager avec facebook"});
socialShare(linkedin, {link: 'https://www.linkedin.com/shareArticle?url=', title:"partager avec linkedin"});