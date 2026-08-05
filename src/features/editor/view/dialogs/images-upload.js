/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function openDialogUploadImgBase64(oEditor) {
    state.oEditor.openDialog('base64imageDialog');
}
export function getDialogUploadImgBase64() {
    /*
    * Created by ALL-INKL.COM - Neue Medien Muennich - 04. Feb 2014
    * Licensed under the terms of GPL, LGPL and MPL licenses.
    */
    CKEDITOR.dialog.add("base64imageDialog", function(editor){
        var t = null,
            selectedImg = null,
            orgWidth = null, orgHeight = null,
            imgPreview = null, imgLoading = null, urlCB = null, urlI = null, fileCB = null, imgScal = 1, lock = true;
        /* Check File Reader Support */
        function fileSupport() {
            var r = false, n = null;
            try {
                if (FileReader) {
                    var n = document.createElement("input");
                    if (n && "files" in n) r = true;
                }
            } catch(e) { r = false; }
            n = null;
            return r;
        }
        var fsupport = fileSupport();
        /* Load preview image */
        function imagePreviewLoad(s) {
            /* no preview */
            if (typeof(s) != "string" || !s) {
                imgLoading.getElement().setHtml("");
                return;
            }
            /* Create image */
            var i = new Image();
            /* Display loading text in preview element */
            imgLoading.getElement().setHtml("Carregando...");
            /* When image is loaded */
            i.onload = function() {
                /* Remove preview */
                imgLoading.getElement().setHtml("");
                /* Set attributes */
                if (orgWidth == null || orgHeight == null) {
                    if (!q(this).attr('data-width')) t.setValueOf("tab-properties", "width", this.width);
                    if (!q(this).attr('data-height')) t.setValueOf("tab-properties", "height", this.height);
                    imgScal = 1;
                    if (this.height > 0 && this.width > 0) imgScal = this.width / this.height;
                    if (imgScal <= 0) imgScal = 1;
                } else {
                    orgWidth = null;
                    orgHeight = null;
                }
                this.id = editor.id+"previewimage_"+randomString(4);
                this.setAttribute("class","previewImage");
                this.setAttribute("alt", "");
                this.setAttribute("style", "cursor:move;max-width:400px;max-height:100px;float:left;margin: 5px;");

                if (!q(this).attr('data-width')) q(this).attr('data-width', this.width);
                if (!q(this).attr('data-height')) q(this).attr('data-height', this.height);

                /* Insert preview image */
                try {
                    var boxPreview = CKEDITOR.dialog.getCurrent().getContentElement("tab-source", "preview").getElement().$;
                    var p = imgPreview.getElement().$;
                    if (p) {
                        p.appendChild(this);
                        // if (qualidadeImagens > 0 && !$(this).attr('quality')) qualityImages(this, this, quality);
                        if (boxPreview) {
                            q(boxPreview).sortable({
                                items: 'img.previewImage',
                                cursor: 'grabbing',
                                start: function(event, ui){
                                    ui.placeholder.height(ui.item.height());
                                    ui.placeholder.width(ui.item.width());
                                },
                                forceHelperSize: true,
                                opacity: 0.5
                            });
                        }
                    }
                } catch(e) {}

            };
            /* Error Function */
            i.onerror = function(){ imgLoading.getElement().setHtml(""); };
            i.onabort = function(){ imgLoading.getElement().setHtml(""); };
            /* Load image */
            i.src = s;
            if (!isBase64(s)) {
                getBase64Image(q(i));
                //console.log($(i), s);
            }
        }
        function loopFileUpload(files, i) {
            var fr = new FileReader();
            fr.onload = (function(f) { return function(e) {
                imgLoading.getElement().setHtml("");
                imagePreviewLoad(e.target.result);
            }; })(files[i]);
            fr.onerror = function(){ imgLoading.getElement().setHtml(""); };
            fr.onabort = function(){ imgLoading.getElement().setHtml(""); };
            try {
                fr.readAsDataURL(files[i]);
            } catch(e) {}
        }
        /* Change input values and preview image */
        function imagePreview(src){
            /* Remove preview */
            imgLoading.getElement().setHtml("");
            imgPreview.getElement().setHtml("");
            if (src == "base64") {
                /* Disable Checkboxes */
                if (urlCB) urlCB.setValue(false, true);
                if (fileCB) fileCB.setValue(false, true);
            } else if (src == "url") {
                /* Enable Image URL Checkbox */
                if (urlCB) urlCB.setValue(true, true);
                if (fileCB) fileCB.setValue(false, true);
                /* Load preview image */
                if (urlI) imagePreviewLoad(urlI.getValue());
            } else if (fsupport) {
                /* Enable Image File Checkbox */
                if (urlCB) urlCB.setValue(false, true);
                if (fileCB) fileCB.setValue(true, true);
                /* Read file and load preview */
                var fileI = t.getContentElement("tab-source", "file");
                var n = null;
                try { n = fileI.getInputElement().$; } catch(e) { n = null; }
                if (n && "files" in n && n.files && n.files.length && n.files[0]) {
                    if ("type" in n.files[0] && !n.files[0].type.match("image.*")) return;
                    if (!FileReader) return;
                    imgLoading.getElement().setHtml("Carregando...");
                    for (var i in n.files) {
                        loopFileUpload(n.files, i);
                    }
                }
            }
        };
        /* Calculate image dimensions */
        function getImageDimensions() {
            var o = {
                "w" : t.getContentElement("tab-properties", "width").getValue(),
                "h" : t.getContentElement("tab-properties", "height").getValue(),
                "uw" : "px",
                "uh" : "px"
            };
            if (o.w.indexOf("%") >= 0) o.uw = "%";
            if (o.h.indexOf("%") >= 0) o.uh = "%";
            o.w = parseInt(o.w, 10);
            o.h = parseInt(o.h, 10);
            if (isNaN(o.w)) o.w = 0;
            if (isNaN(o.h)) o.h = 0;
            return o;
        }
        /* Set image dimensions */
        function imageDimensions(src) {
            var o = getImageDimensions();
            var u = "px";
            if (src == "width") {
                if (o.uw == "%") u = "%";
                o.h = Math.round(o.w / imgScal);
            } else {
                if (o.uh == "%") u = "%";
                o.w = Math.round(o.h * imgScal);
            }
            if (u == "%") {
                o.w += "%";
                o.h += "%";
            }
            t.getContentElement("tab-properties", "width").setValue(o.w),
            t.getContentElement("tab-properties", "height").setValue(o.h)
        }
        /* Set integer Value */
        function integerValue(elem) {
            var v = elem.getValue(), u = "";
            if (v.indexOf("%") >= 0) u = "%";
            v = parseInt(v, 10);
            if (isNaN(v)) v = 0;
            elem.setValue(v+u);
        }
        function addImgOnEditor(img) {
            /* Get image source */
            var src = q(img).attr('src');
            var data = q(img).data();
            var quality = t.getValueOf("tab-properties", "quality");
                quality = (quality != "") ? parseInt(quality)*0.01 : state.qualidadeImagens*0.01;
                quality = (quality > 100) ? 100 : quality;
                quality = (quality < 0) ? 0 : quality;
            // try { src = CKEDITOR.document.getById(editor.class+"previewimage").$.src; } catch(e) { src = ""; }
            if (typeof(src) != "string" || src == null || src === "") return;
            /* selected image or new image */
            if (selectedImg) var newImg = selectedImg; else var newImg = editor.document.createElement("img");
            newImg.setAttribute("src", src);
            src = null;
            /* Set attributes */
            newImg.setAttribute("alt", t.getValueOf("tab-properties", "alt").replace(/^\s+/, "").replace(/\s+$/, ""));
            var attr = {
                "width" : ["width", "width:#;", "integer", 1],
                "height" : ["height", "height:#;", "integer", 1],
                "maxwidth" : ["maxwidth", "max-width:#;object-fit: contain;", "integer", 1],
                "maxheight" : ["maxheight", "max-height:#;object-fit: contain;", "integer", 1],
                "vmargin" : ["vspace", "margin-top:#;margin-bottom:#;", "integer", 0],
                "hmargin" : ["hspace", "margin-left:#;margin-right:#;", "integer", 0],
                "align" : ["align", ""],
                "filter" : ["filter", ""],
                "border" : ["border", "border:# solid black;", "integer", 0]
            }, css = [], value, cssvalue, attrvalue, k;
            for(k in attr) {
                value = t.getValueOf("tab-properties", k);
                attrvalue = value;
                cssvalue = value;
                unit = "px";
                if (k == "align") {
                    switch(value) {
                        case "top":
                        case "bottom":
                            attr[k][1] = "vertical-align:#;";
                            break;
                        case "left":
                        case "right":
                            attr[k][1] = "float:#;";
                            break;
                        default:
                            value = null;
                            break;
                    }
                } else if (k == "filter") {
                    switch(value) {
                        case "grayscale":
                            attr[k][1] = "filter:grayscale(1);";
                            break;
                        case "blur":
                            attr[k][1] = "filter:blur(3px);";
                            break;
                        case "shadow":
                            attr[k][1] = "filter:drop-shadow(2px 4px 6px black);";
                            break;
                        case "invert":
                            attr[k][1] = "filter:invert(1);";
                            break;
                        case "sepia":
                            attr[k][1] = "filter:sepia(1);";
                            break;
                        default:
                            value = null;
                            break;
                    }
                }
                if (attr[k][2] == "integer") {
                    if (value.indexOf("%") >= 0) unit = "%";
                    value = parseInt(value, 10);
                    if (isNaN(value)) value = null; else if (value < attr[k][3]) value = null;
                    if (value != null) {
                        if (unit == "%") {
                            attrvalue = value+"%";
                            cssvalue = value+"%";
                        } else {
                            attrvalue = value;
                            cssvalue = value+"px";
                        }
                    }
                }
                if (value != null) {
                    if (k == 'width' && typeof data !== 'undefined' && data.width && !selectedImg) {
                        newImg.setAttribute('width', data.width);
                    } else if (k == 'height' && typeof data !== 'undefined' && data.height && !selectedImg) {
                        newImg.setAttribute('height', data.height);
                    } else {
                        newImg.setAttribute(attr[k][0], attrvalue);
                        css.push(attr[k][1].replace(/#/g, cssvalue));
                    }
                }
                if (attrvalue == 'none') {
                    newImg.removeAttribute(k);
                }
            }
            if (css.length) newImg.setAttribute("style", css.join(""));
            if (newImg.getAttribute('maxwidth')) {
                newImg.removeAttribute('height');
            }
            if (newImg.getAttribute('maxheight')) {
                newImg.removeAttribute('width');
            }
            /* Insert new image */
            if (!selectedImg) editor.insertElement(newImg);
            if (state.qualidadeImagens > 0) {
                newImg.setAttribute("quality",quality);
                api.qualityImages(newImg.$, newImg.$, quality);
            }
            /* Resize image */
            if (editor.plugins.imageresize) editor.plugins.imageresize.resize(editor, newImg, 800, 800);
        }


        if (fsupport) {
            /* Dialog with file and url image source */
            var sourceElements = [
                {
                    type: "vbox",
                    widths: ["70px"],
                    children: [
                        {
                            type: "checkbox",
                            id: "filecheckbox",
                            style: "margin-top:5px",
                            label: "Navegar neste computador:"
                        },
                        {
                            type: "file",
                            id: "file",
                            label: "",
                            onChange: function(){ imagePreview("file"); }
                        }
                    ]
                },{
                    type: "vbox",
                    widths: ["70px"],
                    children: [
                        {
                            type: "checkbox",
                            id: "urlcheckbox",
                            style: "margin-top:5px",
                            label: "URL da Imagem:"
                        },
                        {
                            type: "text",
                            id: "url",
                            label: "",
                            onChange: function(){ imagePreview("url"); }
                        }
                    ]
                },
                {
                    type: "html",
                    id: "loading",
                    html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
                },
                {
                    type: "html",
                    id: "preview",
                    html: new CKEDITOR.template("<div class=\"dropFilePro\" style=\"text-align:center;max-width: 700px;\"></div>").output()
                }
            ];
        } else {
            /* Dialog with url image source */
            var sourceElements = [
                {
                    type: "text",
                    id: "url",
                    label: "URL da Imagem:",
                    onChange: function(){ imagePreview("url"); }
                },
                {
                    type: "html",
                    id: "loading",
                    html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
                },
                {
                    type: "html",
                    id: "preview",
                    html: new CKEDITOR.template("<div class=\"dropFilePro\" style=\"text-align:center;max-width: 700px;\"></div>").output()
                }
            ];
        }
        /* Dialog */
        return {
            title: editor.lang.common.image,
            minWidth: 750,
            minHeight: 180,
            onLoad: function(){
                if (fsupport) {
                    /* Get checkboxes */
                    urlCB = this.getContentElement("tab-source", "urlcheckbox");
                    fileCB = this.getContentElement("tab-source", "filecheckbox");
                    /* Checkbox Events */
                    urlCB.getInputElement().on("click", function(){ imagePreview("url"); });
                    fileCB.getInputElement().on("click", function(){ imagePreview("file"); });

                }
                /* Get url input element */
                urlI = this.getContentElement("tab-source", "url");
                /* Get image preview element */
                imgLoading = this.getContentElement("tab-source", "loading");
                imgPreview = this.getContentElement("tab-source", "preview");
                /* Constrain proportions or not */
                this.getContentElement("tab-properties", "lock").getInputElement().on("click", function(){
                    if (this.getValue()) lock = true; else lock = false;
                    if (lock) imageDimensions("width");
                }, this.getContentElement("tab-properties", "lock"));
                /* Change Attributes Events  */
                this.getContentElement("tab-properties", "width").getInputElement().on("keyup", function(){ if (lock) imageDimensions("width"); });
                this.getContentElement("tab-properties", "height").getInputElement().on("keyup", function(){ if (lock) imageDimensions("height"); });
                this.getContentElement("tab-properties", "vmargin").getInputElement().on("keyup", function(){ integerValue(this); }, this.getContentElement("tab-properties", "vmargin"));
                this.getContentElement("tab-properties", "hmargin").getInputElement().on("keyup", function(){ integerValue(this); }, this.getContentElement("tab-properties", "hmargin"));
                this.getContentElement("tab-properties", "border").getInputElement().on("keyup", function(){ integerValue(this); }, this.getContentElement("tab-properties", "border"));
                this.getContentElement("tab-properties", "maxwidth").getInputElement().on("keyup", function(){ integerValue(this); }, this.getContentElement("tab-properties", "maxwidth"));
                this.getContentElement("tab-properties", "maxheight").getInputElement().on("keyup", function(){ integerValue(this); }, this.getContentElement("tab-properties", "maxheight"));
                this.getContentElement("tab-properties", "quality").getInputElement().setAttribute('type','number').setAttribute('max','100').setAttribute('min','1');
                checkLoadJqueryUI();
            },
            onShow: function(){

                fileElem = this.getContentElement("tab-source", "file").getElement().$;
                if (fileElem) {
                    q(fileElem).css('height','90px').find('iframe').css('height','90px').contents()
                        .find('head').append('<style type="text/css" data-style="seipro">input[type="file"]:before { content: "Arraste arquivos para c\u00E1 ou clique em "; }</style>')
                        .end()
                        .find('input[type="file"]')
                        .prop('multiple','multiple')
                        .css({
                            'width':'100%',
                            'display':'block',
                            'background':'#f2f2f2',
                            'padding':'30px 10px 30px 40px',
                            'border-radius':'10px',
                            'font-size':'13pt',
                            'color':'#999',
                            'filter': (state.isDarkMode ? 'invert(1) brightness(1.5)' : 'none'),
                            'border':'1px dashed #ccc'
                        });
                }
                /* Remove preview */
                imgLoading.getElement().setHtml("");
                imgPreview.getElement().setHtml("");
                t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;
                /* selected image or null */
                selectedImg = editor.getSelection().getSelectedElement();
                if (selectedImg && selectedImg.getName() == "img") {
                    // selectedImg = selectedImg.getSelectedElement();
                    // this.getContentElement("tab-properties", "quality").disable();
                    if (typeof(selectedImg.getAttribute("src")) == "string") {
                        var srcSelectedImg = selectedImg.getAttribute("src");
                        var base64strImg = srcSelectedImg.substring(srcSelectedImg.indexOf(',') + 1)
                        var decoded = atob(base64strImg);
                        console.log("FileSize: " + decoded.length);
                        this.getContentElement("tab-properties", "imglength").getElement().setHtml("Tamanho da imagem: <br>"+infraFormatarTamanhoBytes(decoded.length));
                    }
                }
                if (!selectedImg || selectedImg.getName() !== "img") {
                    selectedImg = null;
                    // this.getContentElement("tab-properties", "quality").enable();
                    this.getContentElement("tab-properties", "imglength").getElement().setHtml("");
                }
                /* Set input values */
                t.setValueOf("tab-properties", "lock", lock);
                t.setValueOf("tab-properties", "vmargin", "0");
                t.setValueOf("tab-properties", "hmargin", "0");
                t.setValueOf("tab-properties", "border", "0");
                t.setValueOf("tab-properties", "maxwidth", "0");
                t.setValueOf("tab-properties", "maxheight", "0");
                t.setValueOf("tab-properties", "quality", state.qualidadeImagens);
                t.setValueOf("tab-properties", "align", "none");
                t.setValueOf("tab-properties", "filter", "none");
                if (selectedImg) {
                    /* Set input values from selected image */
                    if (typeof(selectedImg.getAttribute("width")) == "string") orgWidth = selectedImg.getAttribute("width");
                    if (typeof(selectedImg.getAttribute("height")) == "string") orgHeight = selectedImg.getAttribute("height");
                    if ((orgWidth == null || orgHeight == null) && selectedImg.$) {
                        orgWidth = selectedImg.$.width;
                        orgHeight = selectedImg.$.height;
                    }
                    if (orgWidth != null && orgHeight != null) {
                        t.setValueOf("tab-properties", "width", orgWidth);
                        t.setValueOf("tab-properties", "height", orgHeight);
                        orgWidth = parseInt(orgWidth, 10);
                        orgHeight = parseInt(orgHeight, 10);
                        imgScal = 1;
                        if (!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
                        if (imgScal <= 0) imgScal = 1;
                    }
                    if (typeof(selectedImg.getAttribute("src")) == "string") {
                        if (selectedImg.getAttribute("src").indexOf("data:") === 0) {
                            imagePreview("base64");
                            imagePreviewLoad(selectedImg.getAttribute("src"));
                        } else {
                            t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
                        }
                    }
                    if (typeof(selectedImg.getAttribute("alt")) == "string") t.setValueOf("tab-properties", "alt", selectedImg.getAttribute("alt"));
                    if (typeof(selectedImg.getAttribute("hspace")) == "string") t.setValueOf("tab-properties", "hmargin", selectedImg.getAttribute("hspace"));
                    if (typeof(selectedImg.getAttribute("vspace")) == "string") t.setValueOf("tab-properties", "vmargin", selectedImg.getAttribute("vspace"));
                    if (typeof(selectedImg.getAttribute("border")) == "string") t.setValueOf("tab-properties", "border", selectedImg.getAttribute("border"));
                    if (typeof(selectedImg.getAttribute("maxwidth")) == "string") t.setValueOf("tab-properties", "maxwidth", selectedImg.getAttribute("maxwidth"));
                    if (typeof(selectedImg.getAttribute("maxheight")) == "string") t.setValueOf("tab-properties", "maxheight", selectedImg.getAttribute("maxheight"));
                    if (typeof(selectedImg.getAttribute("filter")) == "string") t.setValueOf("tab-properties", "filter", selectedImg.getAttribute("filter"));
                    if (typeof(selectedImg.getAttribute("quality")) == "string") {
                        var qualitySelectedImg = parseInt(selectedImg.getAttribute("quality")*100);
                            t.setValueOf("tab-properties", "quality", qualitySelectedImg);
                            t.getContentElement("tab-properties", "quality").getInputElement().setAttribute('type','number').setAttribute('max',qualitySelectedImg).setAttribute('min','1');
                    }
                    if (typeof(selectedImg.getAttribute("align")) == "string") {
                        switch(selectedImg.getAttribute("align")) {
                            case "top":
                            case "text-top":
                                t.setValueOf("tab-properties", "align", "top");
                                break;
                            case "baseline":
                            case "bottom":
                            case "text-bottom":
                                t.setValueOf("tab-properties", "align", "bottom");
                                break;
                            case "left":
                                t.setValueOf("tab-properties", "align", "left");
                                break;
                            case "right":
                                t.setValueOf("tab-properties", "align", "right");
                                break;
                        }
                    }
                    t.selectPage("tab-properties");
                }
            },
            onOk : function(){
                var imgs = CKEDITOR.document.getElementsByTag("img").$;
                if (typeof imgs !== 'undefined' && imgs.length) {
                    q.each(imgs, function(i, img){
                        var src = q(img).attr('src');
                        if (!isValidHttpUrl(src)) {
                            addImgOnEditor(img);
                        }
                    })
                }
            },
            /* Dialog form */
            contents: [
                {
                    id: "tab-source",
                    label: editor.lang.common.generalTab,
                    elements: sourceElements
                },
                {
                    id: "tab-properties",
                    label: editor.lang.common.advancedTab,
                    elements: [
                        {
                            type: "text",
                            id: "alt",
                            label: "Texto Alternativo"
                        },
                        {
                            type: 'hbox',
                            widths: ["30%", "30%", "40%"],
                            children: [
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "width",
                                    label: editor.lang.common.width
                                },
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "height",
                                    label: editor.lang.common.height
                                },
                                {
                                    type: "checkbox",
                                    id: "lock",
                                    label: "Travar Propor\u00E7\u00F5es",
                                    style: "margin-top:18px;"
                                }
                            ]
                        },
                        {
                            type: 'hbox',
                            widths: ["30%", "30%", "40%"],
                            style: "margin-top:10px;",
                            children: [
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "vmargin",
                                    label: "Margem Vertical"
                                },
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "hmargin",
                                    label: "Margem Horizontal"
                                },
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "border",
                                    label: "Borda"
                                }
                            ]
                        },
                        {
                            type: 'hbox',
                            widths: ["30%", "30%", "40%"],
                            children: [
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "maxwidth",
                                    label: "Largura M\u00E1xima"
                                },
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "maxheight",
                                    label: "Altura M\u00E1xima"
                                },{
                                    type: "select",
                                    id: "align",
                                    label: editor.lang.common.align,
                                    items: [
                                        [editor.lang.common.notSet, "none"],
                                        [editor.lang.common.alignTop, "top"],
                                        [editor.lang.common.alignBottom, "bottom"],
                                        [editor.lang.common.alignLeft, "left"],
                                        [editor.lang.common.alignRight, "right"]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'hbox',
                            widths: ["30%", "30%", "40%"],
                            children: [
                                {
                                    type: "text",
                                    width: "80px",
                                    id: "quality",
                                    label: "Qualidade da Imagem (1 = baixa / 100 = alta)"
                                },{
                                    type: "select",
                                    id: "filter",
                                    label: "Filtro",
                                    items: [
                                        [editor.lang.common.notSet, "none"],
                                        ["Escala de Cinza", "grayscale"],
                                        ["Borrado", "blur"],
                                        ["Caixa Sombreada", "shadow"],
                                        ["Cores Invertidas", "invert"],
                                        ["Envelhecido", "sepia"]
                                    ]
                                },{
                                    type: "html",
                                    id: "imglength",
                                    html: new CKEDITOR.template("<div style=\"text-align:left;\"></div>").output()
                                },
                            ]
                        }
                    ]
                }
            ]
        };
    });
}
api.openDialogUploadImgBase64 = openDialogUploadImgBase64;
api.getDialogUploadImgBase64 = getDialogUploadImgBase64;
