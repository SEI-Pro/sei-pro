function loadStyleDesign() {
    var body = document.body;
    if (localStorage.getItem('seiSlim')) {
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_html");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
            var script = {
                type: 'text/css', style: document.createElement('style'), 
                content:  '   p.Texto_Fundo_Cinza_Maiusculas_Negrito, \n'
                         +'   p.Texto_Fundo_Cinza_Negrito, \n'
                         +'   p .ancoraSei, \n'
                         +'   p.Item_Nivel1 { \n'
                         +'       background-color: #e5e5e566 !important;  \n'
                         +'   } \n'
                         +'   .dark-mode-color-black, \n'
                         +'   .dark-mode-color-black * { \n'
                         +'       color: #000 !important;  \n'
                         +'   } \n'
                         +'   .dark-mode-color-white, \n'
                         +'   .dark-mode-color-white * { \n'
                         +'       color: #fff !important;  \n'
                         +'   } \n'
                         +'   .pageBreakPro { background: #6f7071; height: 15px; } \n',
                append: function() {
                  this.style.type = this.type;
                  this.style.appendChild(document.createTextNode(this.content));
                  document.head.appendChild(this.style);
              }}; script.append();
              initRepareBgTableColor();
        }
    }
}
function initLinhaNumerada(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.parent.getLinhaNumerada !== 'undefined') { 
        parent.parent.getLinhaNumerada();
    } else {
        setTimeout(function(){ 
            initLinhaNumerada(TimeOut - 100); 
            console.log('Reload initLinhaNumerada'); 
        }, 500);
    }
}
function initRepareBgTableColor(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof parent.parent.getBrightnessColor !== 'undefined') { 
        repareBgTableColor();
    } else {
        setTimeout(function(){ 
            initRepareBgTableColor(TimeOut - 100); 
            console.log('Reload repareBgTableColor'); 
        }, 500);
    }
}
function repareBgTableColor() {
    $('body').find('span[style*="background-color"], tr[style*="background-color"],td[style*="background-color"]').each(function(){
        setBgTableColor(this);
    });
}
function setBgTableColor(this_) {
    var bgColor = $(this_).css('background-color');
    if (typeof bgColor !== 'undefined' && bgColor !== null) {
        var brightness = parent.parent.getBrightnessColor(parent.parent.rgbToHexString(bgColor));
        var textColour = (brightness > 125) ? 'black' : 'white';
        $(this_).addClass('dark-mode-color-'+textColour);
    }
}
loadStyleDesign();
initLinhaNumerada();