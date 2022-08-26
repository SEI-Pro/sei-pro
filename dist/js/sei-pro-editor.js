var idEditor,
    oEditor, 
    imgEditor, 
    txaEditor = ($('#frmEditor').length > 0) ? 'div[id^=cke_txaEditor_]' : 'div#cke_txaConteudo',
    iframeEditor,
    autoSaveEditor;

var autoSaveInterval = (checkConfigValue('salvamentoautomatico')) ? getConfigValue('salvamentoautomatico') : 5;
var isIntervalInProgress = false;
var isSeiSlim = (localStorage.getItem('seiSlim')) ? true : false;
var isDarkMode = (localStorage.getItem('darkModePro')) ? true : false;
var qualidadeImagens = (checkConfigValue('qualidadeimagens')) ? getConfigValue('qualidadeimagens') : 60;
    qualidadeImagens = (qualidadeImagens > 100) ? 100 : qualidadeImagens;
    qualidadeImagens = (qualidadeImagens < 0) ? 0 : qualidadeImagens;

function setParamEditor(this_) {
    idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    oEditor = CKEDITOR.instances[idEditor];
    iframeEditor = ($('#frmEditor').length > 0) ? $('iframe[title*="'+idEditor+'"]').contents() : $(txaEditor).find('iframe[title*="txaConteudo"]').contents();
    $('#idEditor').val(idEditor);
}
function htmlButton(status) {
   
    var classStatus = ( status == 'disable' ) ? 'cke_button_disabled' : '';
    var icon16baseImport = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVDjLjZNPaxNBGIdrLwURLznWgkcvIrQhRw9FGgy01IY0TVsQ0q6GFkT0kwjJId9AP4AHP4Q9FO2hJ7El2+yf7OzMbja7Sf0578QdNybFLjwszLu/Z2femZkDMEfI54FkRVL4Dw8l8zqXEawMBgM2HA6vR6MRZiHraDabH7KSrKBA4SAIEIahxvd9eJ6HbrerJKZpotVqaUkavkMC+iCKIsRxrN6EEAKMMViWpQT9fh/0k3a7PZZkBUPmqXAKCSjAOYdt21NLUj1JBYW7C6vi6BC8vKWKQXUXQcNA5Nh6KY7jqJl0Op1JwY/Hi7mLp/lT/uoA/OX2WLC3C9FoQBwfILKulIRmQv1wXfevwHmyuMPXS5Fv1MHrFSTmhSomnUvw/Spo3C+vg3/+pJZDPSGRFvilNV+8PUZvoziKvn+d3LZvJ/BelMDevIZXK2EQCiUhtMDM53bY5rOIGXtwjU3EVz/HM5Az8eplqPFKEfzLR91cOg8TPTgr3MudFx+d9owK7KMNVfQOtyQ1OO9qiHsWkiRRUHhKQLuwfH9+1XpfhVVfU0V3//k4zFwdzjIlSA/Sv8jTOZObBL9uugczuNaCP5K8bFBIhduE5bdC3d6MYIkkt7jOKXT1l34DkIu9e0agZjoAAAAASUVORK5CYII=';
    var icon16baseTable = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ6SURBVDjLpZNZSNRRGMV//2XGsjFrMg2z0so2K21xIFpepYUiAsGIICLffI8eWiBBeg3qQV+KwBYKLB8qpHUmrahcKLc0QsxldNSxdPz/79LD1ChBUXTh8sG93POdc75zDa01/7NsgGvPR09rzQmpVZZSCqlAKIWUCqk0QqoZWyKFRir1uvxIbsAGUFqXHQqkpP1L57M3Pm5MMJBKpQHUdF9BKIGQAlcJXOlOVykSdye3leO6MmkGQNyHw+uO/1X3bzGBK+S0B1IqAKqDg3986HeCZPffwvJtoNT7lOZLvUdtAPEDAKBkRzo3QwMUb89InN1uGGD3spdE214xe8MRUnM2MfppNW0Pqy7YAK5UKK2xLbhdP4hlmdxpGMQwwQT8ziNiI534c7cT6WrFazikzF2Eb8HS1IQEDdiWwcHAQmpehTkQSAcgNvSMiYFW5uUUMdV3HW+ywefGNqITJsbUUL75k4FWYJtQ+yaMZcXrk1ANk/33mbdiD7EvlRieETy+FJLkMFcjRRSW3emIAwiF1hqPBfu2LGSWbbA1uZ41SfWkrtxPrPcypsfFiWYzFGzGKTjFV28WEJeIUHETLdOgrmkI1VdHpCdEet5enP4qLK9mKrqMgedv6cyrAP+qxOTiUxAi7oEJi8frELoFoTLpa7nI/HQvscgSRt+0kV1SSW7qYtp7xrBMphm4Mi5h/VIfTcEq1u0oJaknSEdNiMYHET7UvcMpPEN31Ed7zxgASmk1I0g6dK66s8CRak5mVxjnfS05+TsZCw/T9baTx1nnGb47DrQksjE6HrsHYPz6nYt3+Sc3L8+wA2tz0J6pF5OD4WP7Kpq7f5fO79DfSxjdtCtDAAAAAElFTkSuQmCC';
    var icon16baseLegis = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALZSURBVBgZBcFLiFVlAADg7zzuPLzjzDjOMINMitIie5gF+UAkIZSgRQuXLZIWrY021dYIggJdJURElJsoqlWRYA9GshGFCNQeOjoTk6bjeOd5zzn/f07flzRNA459ObcHJ3cM9+1fq2prVa2qa+uh7mAZ9xCxiAV8iu9zgDqEvU9ODOx//dkxALBa1kNrZT202I2TZcVyEd28t+Lb66uHcTwHqEMYH+xJwNyDqJUk8oQsp7eV2tqbytJUK+OpyX5bhtojH07Pv58CxKoabOeEmuUy0al4UNDp0umysM5/KxG8eWbW/u1tj4+2xnKAWFUjG3tSqwWr3ShNEzmyjDQjk8gSaiRxyYUbiy7PduZzgFiW40P9mc56sFY00rSRpaQxkaVkGlmGJnNnqXDq7N9LOJYDhLLcNj7Y0uk2AjRkMZE2iGQaeZOqG2IrCmXY/s1rB+6nALEstk0M9VotG0lKliRSpEjw+YUjPjq3RxkKoSjEsoiQwvMnvusXQ09vK1VGUg1qjVrUqDWKUJoc3emVj3dbWeuEUJZLkEMoyrF2u0+aUEPD19OHNXVQ1kEZgy2bHrZzYq/l7qr766/m3VC0ub+SQyyLDXm7R56SpYlYJ0JdOvzYy2JTi3VUa8x35jwxecBKue7S7E+dXW+nI/nB42dGcWLPI1vdXmrcvBO1++iGUmxqtxb+UtVBqCtVrCwVy3Y/dNBKtZb+OjO1kMeyfA4vXLo6Y3E9t1I0qtjo6goxGB/cKtRRbGr/dmaNDEy4PHfe+etTd8vgSB6r6ukXD+3qf+ulfQDg6OnCJ7+8p6xL3VDaMfqofTuOuHhryrk/fl4tokPz7zRX8lhVM7fvdXx29qrhgX7Dg32G271OHv3dxg09entSvXnqmXcHJGm/6Ru/ad89dmrm9AdXIK9D+GLq4rXJqYvXtmEzNmMTNmGor6fV6utr6YxWfvjzR0P/vDGTh7GvAP4H2uh1wse2x/0AAAAASUVORK5CYII=';
    var icon16baseCapLetter = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAK/SURBVDjLY/j//z8DJRiFozbrLk/aqkc76/a8eDft2Ou/Ew69+lm/8/n7pMUPTsuXXlAgaAAIK/fe9Kg7/ubmsaff/h99/O2/48y7q+Tyz2vKZJ5hJGiAUucNRv0JNycuuvLho/WU24tytz67aNl5fZFM8mlhoryg0HAlcePNz7+06670y2aftaja8fy224SbW6SzL1lrNt+aY95776BJ593dJq13dpu13jqoWXptGUJz1WXVkp0vrs48/e6NTNoZM+n4kzpTDr5+7T/l9gHpzAvOyhU3J/vMe/w5e+OL/5lrXvzXKb2xTjz2QhncAKOWqzM3X//0Z97Jdx8mHHj1YsbB128P3Pz0P3bW3TNiXgfk9BturQ+Y9+ifU+/du4nLnvyXiD7fLBZ+lo0BGEAswACKXXLm3We/aXf2SoYejZQIPBws7ncwb+qeF29TZt+9LJlwNiNmydP/tm13LwNtdY+Y+/i/TNT5XnAYAANIL3vN40uTDrx6JRF0xBDmIlHPvepJM+5czJh174Hb5Pvv3SbceykWdd4aaGtQ5MyH/1UTLywDG9Cx8/n3aQdf/W/e+uxL8ozb20CCIu57jIN7bpxcdujN/+hJ9/4nLnnyXyzibC1YLuS0d/jU+/+1ky9swZoOkDHQuTHR8x//T1705H/MnIf/ffvu/Q+ffO9/ytyH/7XiLmwR9DoijFtz9Hkz6/qbl716736Tizo/XSTgZIGw34kc9ajz65JnPvivF3/+oIDbYQ2cBmhmX1qTMO/Rf7Hgk83C/ie4YOKCnkeCXSpvfNCLPn+A3+WgEoZGYCAZi4aeKXZvu/PBo+3OV6CtwUI+x1nBmj2OKAJtbXCrvPbVNufSYz6nA/EYBrh33v3k23f3v2/Pnf8+HXf+G6VdPAa0lRMkZ5Zy8aJXzY1/QPzfq/rGf/fyaz8ZKM3OABiskbcwY1E6AAAAAElFTkSuQmCC';
    var icon16baseCitaDocumento = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALQSURBVBgZBcFfaJVlHADg532/bzvNo9MtY1oXRlRWsCREIlFXoaBmUEIkaH9uCsokEIK6qbtg4UVBIN0kFETQnVQ3FmXOxMwg1BApA9GdTdFJbLqzc87763lSRNjy/i+vDgw2dudkLe5AAgmRiKJbyj83r8eP6b+Zd44d3LEAkCLC9g+PH/ty39qHc07LgkoAEAHh2mzHV7/fNHWpfeuvs+eHJw7uaEMNuUqr++tq2bmrqpwSiSj0ouh2w+1Oz5MPLPH4g7WT5dqiKA/NjL313dDRT59pZ0gpLY6Iqr/K+jJ1ospUiZTIEoqVg/12rFvp3vsbA/Vg8xBkCBJk5EROSU5JTklOSa6S1o3bVi3ueGQ4ee2JO1V91QtQA0RQVyRJpKT0gpzUFf2R/X09LJSuUhZsvK8h1bkLNUQQqFMWQiDlJCEKUWX6ySUppRIyKYMaAgUpkSSBQBT6KkDKUi+JHAoigBpKlwgKEiIC5IyS1FUQiSAkvUKvADWUEiKCYL5927k/jpu8eMby4SFTV69b9/ROA0uGHDt8yMhdQ36dmTE0O1iPjb3brKFX6AWdhY4jh7/WiFkv79ltbm7O5cuX/Tbxrap/wM7nnlXXlVarpe/06frI+cEPaijdUCK8980xq69d9NKeXd7+6HOzF064e+UKo6OjWlf+deDAKZOtKevXrze2aaNLly69nqHb7en1qKfOGh5sgqde2W9+oWPXrl02bNhg27Zttm7d6la7440394GlS5c2aui2S+mWEnnpinS5dRL8dGhc9HrGx8c1m00wNzcnlfDJxwdiy+bN6cqVK/M1dOZ7083+avn+7WuaX3x2NE/8fNSLY4+yadT09LQLFy5oNBpWrVplZGREztnEiVO9ycnJqRQR1u39YW+3E88n8VhemF68/Mb3ffeMLEuNRp+EM3OrO920KNYs+rM/KdFuL5RWa3rm1uzMlv8B/jBGW3bkYMYAAAAASUVORK5CYII=';
    var icon16baseNotaRodape = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGdSURBVDjLlZNLSwJhFIa1Rb8iIWhRQUlluuoftDEtC5TKSgINily1CmoT0kJBqwlSaBGBLVxItGgZQQQVFe3bKN7wOjqO2tucwRGvqAMPMzDf+8w5ZzgyADLhGhJQCWi6MCwwQBkJWVWg4jguVSqVKuVyGe0Q3sPtdruaJZJAQ+FcLgeWZWuk02kkk0lEIhFREg6H4fF4GiR0yUlABwqFAorFongnstksUqkUotGoKMjn86CPMAwjSloEFJYgAQUymQxisVhLS9WZyBsEQhu1A/RMfUutxONxsZJQKNRZ0Ey9hCqheSQSid4F9RJqh2ZCor4EBM/z4lxIQvQtoCp2HtexfW+CObAM062uu4BCElSBJWjEzc8Vrr8Y6L3zvQsoTKz6F+H7PAPz7oLRp8eodmSjp7/geDqG2b8Me9CK8zcnXK8O7AWsmDtUF9UHUw/1gr+2O8BzsPm3YLvbhPPlBI7nI6xc6jC9P/Gr3B0flHZhVpgyKwQ6LpPFtwaTdwmGCy0MpwsVWsD6ZVKQpNs6z9iV35PWsY/q6iso+w9crJoc0rRwaAAAAABJRU5ErkJggg==';
    var icon16baseSumario = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAI6SURBVDjLpVNNaFNBEP5e8hJiSjVVTComsdYUMbRVUhSVgFawgqgo6FFBaMEeehQ8WAQFj57FCh4KVixCERXipQhCa6kaEz00uSQIghibNn++t7tv4+6mTU2bi3Rh+WZn95v5ZndWq1ar2MzQ1zuGHs85xwaPEIF9qz5uWbBW5vjIiY/Sd+n+qz5GKbT1CgRxnwCPmPPBHW5wLolcBTEJxfT7+RtccI5Fwg9RtdYU3Jwddgp4DVwfrXJrBpoNt87trwfmnCP2KYvU9z13ZObTB/04e7izoYRvFrP8qwspV45kMqlsxhj6u7uxd7u+q7V1KwK+NsTj8VoJIvsXn7O9Vx7K5rMgJkVpqQzTICjmSwrl+unQJDKZDMLhMLxerwqqC/IHr8PX29HSCcYZ/C1BhRVigHKKP1SgxTAx8QwyWaFQgGmaSl0qlYIuZFOmMRCLKCITh6lA0zIFkcJkZs1HmCL9e+mhUAj6g+ij6HDs2udypXLIZd+C7M8sfuVzDdJlSYyyBrK00+n02jNefX55gRgkyAo9I05ycmx5aRlTty/AMAxVKyEEuVwOiUQCkUgEgUBA+eqvIMg9IuNLe/H4V2arEeRwuVz1jG63Gx6PR01d1+FwODY20vm7U0ftNm1m8fciKCWidrqCNfti9IAKNv5mVvjpxlbWgB9yo2P3zqa9/+LdnLqPMwP9zf+ClC4zZgrFpgrafV7VWLG300qB9j+/sevKvSflcumUbOVtnraF9OTogLbZ7/wXRdt3lZxkvhIAAAAASUVORK5CYII=';
    var icon16baseDadosProcesso = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIvSURBVDjLjZPLaxNRFIeriP+AO7Gg7nRXqo1ogoKCK0Fbig8QuxKhPop04SYLNYqlKpEmQlDBRRcFFWlBqqJYLVpbq6ktaRo0aWmamUxmJpN5ZvKoP++9mmlqWuzAt7jc+X2Hcy6nDkAdhXxbCI2Epv+wlbDeyVUJGm3bzpVKpcVyuYyVIPcIBAL3qiXVgiYaNgwDpmk6qKoKRVEgCAKT8DyPYDDoSCrhdYHrO9qzkdOQvp+E+O04hC+tED63gBs+QiDnhQgTWJYFWiQUCv2RUEH/g4YNXwdcT/VEJ6xkF8zEDRixq1CnriD94SikH08gikJNS2wmVLDwybONH3GbNt8DY+YMrDk/tGkvhOFmKPE+pxVJkpDJZMBx3JJAHN+/MTPq8amxdtj8fWjhwzB+diH5ag9y8V6QubDhUYmmaWwesiwvCYRRtyv9ca9oc37kk3egTbbBiPowP+iGOHGT0A1h7BrS43ehiXHous5EjoCEx3IzF6FMnYMcPgs95iOCW1DDXqTfnEBqsBnRR9shTvYibyhsiBRHwL13dabe7r797uHOx3Kkm1T2IDfhhTRyAfMDh5Aauox8Ns5aKRQKDNrSsiHSZ6SHoq1i9nkDuNfHkHi2D9loHwtSisUig4ZXFaSG2pB8cZBUPY+ila0JV1Mj8F/a3DHbfwDq3Mtlb12R/EuNoKN10ylLmv612h6swKIj+CvZRQZk0ou1hMm/OtveKkE9laxhnSvQ1a//DV9axd5NSHlCAAAAAElFTkSuQmCC';
    var icon16baseTinyUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLY/j//z8DJZhhGBlgZ2fHnZWVVdra2vpu3rx5/2tqah7m5OSYA7EEkH0XJAaSA6kBqUUxwMjIiM3Hx6dr4sSJ/1+8ePH/7t27/w8ePPi/sbHxXnV19aGbN2/+AIkdOXLkP0gNSC1ID9wAQ0NDv+Li4g9Xr159FxERsc3b2/tPamrq/0mTJv2vrKz8D2KDxEByK1aseAhSC9KD7IKupqam75MnT0739/fnsre3/7x3797/586d+3/o0KH/a9eu/Z8xx+Jf6nzD/yA1ILUgPXADdHV1M9PT099PmzatJCgoaKejo+MvNze3/4GBgWAMYifMMPrfuDnqf/gMjf8gtSA9cAM0gcDX1/d6b2/v+1WrVr1dt27d//yltv9zF1n8T19g8j9pruH/mvWh/1ednvi/ZLX/f9c+iX+a2hpacAPU1NSYgc428PLyup+SkvIlOzv7e/Zi8/8bzk37v/bsFLDGFacn/J+wp+T/wuNd/zOWuv03bWf/rdvMyIgzfpOB/gVp7tuV/79zR/b/1m1p/xs2J/5v2pr+f8ah5v8xC2z+q9Yz/MRpQPRszf8rT034v/RE7/+Fx7r+zzvaATQk6//0Q03/05Z6/FesZbguXcnAidOAwOmKfz0nSv917hf9a93N/zduvtX/aQcb/ictdvsvX8twUbKSgZ2kpKzdzPg6fqHzf/lqhjNAzWwk5wWgk1/LVTP/F61kYEEWBwAP7or0z//OfQAAAABJRU5ErkJggg==';
	var icon16baseQrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAAWVlZv8SjvQAAAAJ0Uk5TAP9bkSK1AAAANUlEQVR4nGNgYGCo3cfgqsQQuorBZRGIzcjAELGJQV+MgdGFoWYPg6sXQ+gaBlchhpovQLUABRUK5/bjcC8AAAAASUVORK5CYII=';
	var icon16basePageBreak = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTkxQjM5N0RFNjI4MTFFQUFBNzU5OEQxRjkxRTg4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTkxQjM5N0VFNjI4MTFFQUFBNzU5OEQxRjkxRTg4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OTFCMzk3QkU2MjgxMUVBQUE3NTk4RDFGOTFFODhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OTFCMzk3Q0U2MjgxMUVBQUE3NTk4RDFGOTFFODhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsiipPkAAAH9SURBVHjajFPPa5NBEH37I4aECFZCtVBiJVJQD5UWG/DirYccvGvtUVAo1ZsieLCnglAiiJfS/6CXNDn02mMP9dCk4KEomkKh1JDYGPJ7ndl8+/ElhuLCY3dnZ9/MvNkVABKEawSBf8cp4acxpocLxv1Op9MkmG6366PVaplsNvuRzqcIkkgwCjzm3YV6vW5qtZqpVquGCZvNpsnn85bkvwj4ApMwgcuEicgnxVl4ZYoggXZ1SCnR6/XsHAqFUCqVUC6XEY1G+fiO52ZDCiEGtJkfrr3RaJhCoWDa7faALqO0GSBwQrJTsVi0a1cWa1OpVHxbLpezJDLYDkrNn7kUHp92N6GUsnt3rrVGOp1eoeW4r8GjtSUcn59R/RoPkvfwIrVk7d9/HeP9zjreLbyCVBKUjdUqFov1g3kl7K1tZfCjc4LbN29h/7CAo5MSNJHdpX2YIo6Fr+DtwkuQryWIRCKcWcon+HJ0gPXtz7h6I47kZAJSSGipoEQ//YNvX/H7Tw0bjz/YyNwpJuASTnnBxssPp2bj0xPPdCw8G1Ya4pLCTHIaIa1wPRJH5ulqv5feAwpuxBBYwRQrvph5bpY33/hdcuA9Z689EjOiG9aWGJvE6pPXvp1dXTf8DEa8b6eNCX4yt+aZHtk5+cyJoeDBLPiljV/wi7us318BBgDZbKOY1qZo6AAAAABJRU5ErkJggg==';
	var icon16baseSessionBreak = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJBQTFRFAAAAGhoaGBgYHx8fJCQkKCgoLCwsMTExNjY2PDw8QEBAICAgHh4eJiYmKioqLy8vMzMzOTk5Pz8/RERESEhIiLPtgq/r////hrLrgK7raKDjRHza////lrztl73tibToVJDdOGrTVZHecqfoa6LnVZHeMmTNyOD/YpzlYZvl////////////////////////YBj23gAAADB0Uk5TAP/4+Pj4+Pj4//jp1NTU1NTU1NzU1OX54NTVKQj////LKf/b1NYp/+jUxx61DpkEbZ1l9QAAAGlJREFUeJxjYCAOMDIxs7CysXNwckEFuHl4+fgFBIWERRgYRNFViIFExOGAgUFCUkqaQQYOGBhk5eQVFJWUlBggmIFBWUVVjUFdXR2KGRg0NLW0QVqgmIFBU0cX1RY9fTR3YHcpsjsIAgDdmQt3Mog0NQAAAABJRU5ErkJggg==';
    var icon16baseLatex = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACzSURBVCjPY/jPgB8yEKmg0aHxf93/6jPlR4vP5P/I+p9yFMOEuvP7/pedKerJ7cmYnNwTOx9DQaVB9/8J/3McILyw/VjcUFA//3/a/QQBPI5MOT/7f2QBHgWxCRHvg2bhVBAjEHY/8DaecAhd73/GswfCNvmPoSA4we+8x2kQywLoTP33aAqCDHzeu79xrLepN+83uq/3Xwvdm94Jrvsd9lvtN91vuF93v+Z+tX5S44ICBQA4egHkwuNCKQAAAABJRU5ErkJggg==';
    var icon16baseQuickTable = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJySURBVBgZpcFNbNN1HMDhT//9d926NWRb65BtB8MWAZGwZIGRcNAZD2qA6E6cOKDhAjFmBzwYYzQeOXHHiwfFAOHAZScUEmeUAPFlWzMDyOtm27XdoF1/3xdZ0iYcvBCeJ+HuvIiYlm+vVD535yN1GzIz1EDMUDXUHFFD1BA1RBUVR81+jWkx9xNTe7I5nsMX3y/uimnpjW7mGn+fYa1RxtQwMUwFF2VdI37s2kvVU4gJosKn+74mBE3HPFW6MZncnHybdGaAzKadeBA8CNqsU1+Zp2f0KK8PvguJiLbHDSGIEvOUqw0PRZdJdR1Aqr8RdY6hWqJRKfBnOMTS7T1wu8izDo730RQlLl57o8PVPuzuHQWSWP0RxOuU78zQ9+rHTL5ymA3nZpeYmhigrVhrEESJTXXMxY6ls6O41CH5MoSASJK/CvNY4SsiWSfv3Vy6+h6SGiAVw/bBDM2gxC52urN/PFcvzWNidGRGwGLyQ2/RUyqgoUlt6Qb3XjrJO3tHiFIZNiw+qCFixCZ69vH9n3/6vX5oevdwmpXCRXLDbyKNCs0nRR7KNmrbP6Oa2MKFa6vEiVUM2LGlE8fA3XF3vjx7y8srZV88N+YPZt73ue/2eWXhB2+bub7stSfB2+b/qfiRU7Me0yJmrF3/hHRnH8uNPKXRU9yrZ+FmkSgBweDK3AptW/MdqBoxLZvtF0LtDsv9x5nYP8XlP4pM7szRdn72Xz6YyNO2cLdKMoKYlqr0kh0/TbZnhIflOlsHurj1aA1VQ815bbCDhbtVnmXmlnB3Nkx/M3dVgu5uqnUHUYIoKkZQQ1T4P5XVxsWEu/Mi/gPrlHrAGd9XNQAAAABJRU5ErkJggg==';
    var icon16baseFonteSizeUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAaRQTFRFAAAAJWQhJWQhKmkkJmUiJmUiSoxFTY9IM3UuPoI4KVcpJmYjS41GfL92fsB5V5lRPoI4VIIsKGgjLG0nUJJLgMF6gsJ9bK1lRYw9SZJDQIfYQ4vYSY7aQ4nZQITYQYTYOnPTMmLMKGgjMXQsNnoxhcN+h8WBVZpOSZZEPoPXbKfikbzpj7rni7fncaTiQn7WL1zLPYI2icaCjMeFTJVFO33WVpbdc6njc6jhcaThPnfTMF/LQ4o8jsmHkcqKU55KPHnUcKbiR4jaQ37Wgq7kOm3PSpJCk8uLlcyOWaZQOHHRY5veXpbcNWnPNWnPfKniOmzRNWrQQoDXap/fNGbNL13JM2HMeabhRHrVJ0rCNmrPaJ3fUovaMV/LLlnHN2fNeqbhU4bYJUa/MmPMXpPbeafiSoPYOmrPOWjORXrVgajjVobZI0G+MF3LP3TTN2bMN2PMd6DfWonaIj67L1zKMF/LdaThWIzaLFLGJEW/J0jDa5bcYI/bIT+9Hji2OGjOXY/aYJDbUIPXK1DEI0K9Ij+8K03DQnHQUX7WTXzVMVXGHTm2xQFYYgAAAIx0Uk5TAAHJwwHR///OAQfb/////9gHu/f/////9rdAhZSPkJqKDQEB/////zhT3v////u2Cv////8cuvL195gI/////3f3raD/mf////8i4t9UgP+lA6r3ZgqI/9IGXPbRTiqg//INFer/07K12P/5GwGbmbH//yIKRP/sPRN///9UAq7+/+2NECqi6v//vTG9O0R8AAAAu0lEQVR4nGNgwASMTMwofBZWNnYOTgSfi5uHl49fQBAuICQsIiomLiEpJS0jKyevoMigpKyiqqauwaCppa2jq6dvAFRjaGRswsBgamZuYWllDdJkY2tnz8Dg4Ojk7OIKNsXN3cOTwcvbx9fPPwBudGBQcEhoWHhEJEwgKjomNi4+ITEJyk9OSU1Lz8jMys6B8HPz/POBVEFhUTGYX1JaVl7BwFBZVV1TWwcSqG9obGpuaW1r7+js6sbwOwC2BCZS1lMuNQAAAABJRU5ErkJggg==';
    var icon16baseFonteSizeDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAaRQTFRFAAAAWaZQlcyOk8uLSpJCU55KkcqKjsmHQ4o8TJVFjMeFicaCPYI2SZZEVZpOh8WBhcN+NnoxMXQsKGgjQIfYQ4vYSY7aQ4nZQITYQYTYOnPTMmLMSZJDRYw9bK1lgsJ9gMF6UJJLLG0nKGgjPoPVbKfikbzpj7rni7fncaTiQn7WL1zLVIIsPoI4V5lRfsB5fL92S41GJmYjKVcpO33WVpbdc6njc6jhcaThPnfTMF/LPoI4M3UuTY9ISoxFJmUiJmUiPHnUcKbiR4jaQ37Wgq7kOm3PKmkkJWQhJWQhOHHRY5veXpbcNWnPNWnPfKniOmzRNWrQQoDXap/fNGbNL13JM2HMeabhRHrVJ0rCNmrPaJ3fUovaMV/LLlnHN2fNeqbhU4bYJUa/MmPMXpPbeafiSoPYOmrPOWjORXrVgajjVobZI0G+MF3LP3TTN2bMN2PMd6DfWonaIj67L1zKMF/LdaThWIzaLFLGJEW/J0jDa5bcYI/bIT+9Hji2OGjOXY/aYJDbUIPXK1DEI0K9Ij+8K03DQnHQUX7WTXzVMVXGHTm2bwG3mAAAAIx0Uk5TAP///////////////zj/////AQFAhZSPkJqKDbf2//////e7VN7////7tgoH2P/////bBxy68vX3mAgBzv//0QF3962g/5nDyQEi4t9UgP+lA6r3ZgqI/9IGXPbRTiqg//INFer/07K12P/5GwGbmbH//yIKRP/sPRN///9UAq7+/+2NECqi6v//vTFnsFgDAAAAtklEQVR4nGNgwASMTMwsKAKsbOwcKAKcXNw8yHxePn4BQSFhEVExcQlJKWkGGVk5eQVFJWUVVTV1DU0tbQYdXT19A0MjYxNTM3MLSyugFmsbWzt7BwZHJ2cXVzeIKe4engxe3j6+fv4BcJMDg4JDQsPCIyJhAlHRMbFx8QmJSVB+ckpqWnpGZlZ2DoSfm+efD6QKCouKwfyS0rLyCgaGyqrqmto6kEB9Q2NTc0trW3tHZ1c3ht8Bl6QmUrIsKYAAAAAASUVORK5CYII=';
    var icon16baseCopyStyle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5QUE3RkUxQ0QwMTFFQjg3OUI4MEI5REMzQzc4NjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5QUE3RkQxQ0QwMTFFQjg3OUI4MEI5REMzQzc4NjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBhNGQwZjAyLTE3NmEtOWY0Zi1iMDdjLWM5YzlmZGU1YjAyNSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBhNGQwZjAyLTE3NmEtOWY0Zi1iMDdjLWM5YzlmZGU1YjAyNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvwNkokAAAKdSURBVHjahJPNSxRhHMe/zzPzzIu7627m22LbO/lSoGJBhwg6eOgPiA51KE9BZKfAIbyVzrEo6dahg4cIooggiFgihA4lWIikWeiarmvsms7usvPWb8ZcCM1+8J1hYD7f3/N7ediP9HkEYRe/ofbAJcwmL6Pn/SJQcRFhEizZBxosgGMjfmrXD5bFzdkYK2Ky0Cdjh7ACyCOtqmRARg4/11IRd7I6AzJ5oLTygu9kAJ8gj36Wgg92tLUsHjOVwcoSvJQjQ6bL2zEbj4CBEr4rPAmfpQM4E8CZZYSuSb1/i4ELgiv+VaL7wVgidLOluv0KF1PLf2CFsKJ/AY1itFqC79koIYJUVAwMpmrvo+Qcges1grOmBpWL75uZFSUDWTpOyCgcoHoCLtfCKXwe4J4/PNhZD5sSm18JiivIBfBCAItfkFg3HXKFyqP++NXhQNZaDD+fHnY/3UbOcTDc3YhbrbuBL0vAPMGqoLL5GjxvhQTohM6VAoPQw6Dqh6RYCtL0S4i397BMJlfaEzjWEgl6QjUGKREF81XSxljLNjh3xQh8PuRJNpT1GKLiBPy55/BejWDCquDJ2Vac6UrRUlSCnSAXxUY4HJLQwK3ITEzydahru6BYNXCFA13tQmRiDO2vH2KRTvKg9xB6O/cEGW/AdTx4LjYl9V2bfyrbcS2RbTvlaiXIlgphRcDiMWhT06hfqGC1ow1dzXHj0WTmLuwSZaf2+3aocAqFeNpgLkfTzOkBUEZXL0JQObLWAfljGof3Jo2x7h4TLOgXiUnVvalOIV/3xsg3jZtciUKUEpALGtVIjYrWGKK8ZoZ3Ypv46y5k9z0z1vHB5HO0gBqncbsGbaPpyso/r8uWVXamxo3yO96sXzxZhOWa+E/8FmAACfoIcOrzUHkAAAAASUVORK5CYII=';
    var icon16baseAlignCenter = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB8SURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYwMORk/54C0w2FOcemgmSIMyH1P7LNCHiLBDcEZ/+agqwXaFbOIxLc4P0f1e7fUPiZGDcw/AdD02z9/5r/Vf7L/Zf8L/Kf/z/3f/ZsiAwjxbEJAKUIVgAswNGVAAAAAElFTkSuQmCC';
    var icon16baseAlignRight = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSZAQNL/31CdMHiGaBNS/yPbjIC3SHSD+3+EXoh5z4k2wfs/qt2/ofAziW7Q+v8brhsSrn+IMYFgZAEAE0hMH/VkcbsAAAAASUVORK5CYII=';
    var icon16baseAlignLeft = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYU/Ifphej8xbCLEaaAOBNS/yPbjIC3iHZD5P9faHqvk+gGbzQTYD76TLQbbP//hOqE6f5AvBsIRhYAysRMHy5Vf6kAAAAASUVORK5CYII=';
    var icon16baseAlignJustify = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYU/IfpheiEwTNEm5D6H9lmBLxFtAmR/3+h6YWY95xoE7z/o+uHwM9Em2D7/yeSzSAICdc/xJhAMLIA+V1VH3Z4v2kAAAAASUVORK5CYII=';
    var icon16baseDocPublico = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANPSURBVBgZBcHdT1tlAMDh3zltORT6Ob4mtWDGMpgiU8LcEooJyiaEGbNkCkaNCVfeGP4Dr7zBG42J3hiVZInTeTMvFAPBYRhmGDBjEYaAMhhtVzraUjin5+M95/V5FCklAAAA4wtjfcCHwHmgAfADh8Ci9OSXn/d9+ysAAIAipQRgfGHMD0wC115PDmjxYANloxbDBuGaCHLMZqeEK9wZIdy3vh76/hhAkVIyvjAWAG731D/XeznZT9nUsLDZKitUSY0Dw0MKmyAGWWuepczSfeGIl79789ahCgBMdted6U0191BwbRxVQQiViqjCoIqCpbFvBtk7DNASeomek+1dtuXcAPAVL+2mgE/eOXPF97erk6VCxRMcmyEKVoCyCZvpIw51HS1+gBLd5GJ9B7Nrf566vji54rsw9uKnrzVf6FR8QbKqANnIU26I5ZyPiqmylj7Gqy6itf6DFdkk7xXxF10665Lq8sP1E37gfDKS4J6RIV+t8qyvDQ/Bzr6NaVaInpSUT0yz5ZXAksSExmbeYuCZbhxLPO8H6mr8tewYGfYtg3DNKUp2mGLRI9pg0hg3yLsvULZW0OQRR08OKJRqCAXDOLaI+aWUiiLBtspIkvgDLlN3HZRgiOyWQJURmhsqhI/6KKcdTJZw7G2QEiGE4neFVyjb5USdL0a4+hw7aQ9lZ502nvB0Yx3rd7LcpwNHFZzzVuloaSOTq2Zx/gGeJct+4Yi/HhZ2E6drksyk59H/OKY7mGBk5D10Xadtbw///CK6A++PXqO6KkA2m2V5eZloNm75ukbOHqzub789fDql3p6ZJb4f4sobV/nos6+4deM629v/0daSwDrM89vsLDd/vEnRyNLfd4nibimgfjP8w7RtOb9Mr/1O+CBINBwFIHZxCMO0GB0dJZVKMTQ0xODgIKZVwdduAhCLxlQ/gGM5785t3rtTT6SLfA4A4+5PKNJjYmKC2tpaAHRdR3qwMvXIGP6AmnQ6bSpSSgAGv3glbKTNnyP/xlOv9g4oiUSSgOojl8uxsbGBpmm0trbS1NSEI5zS3qM95ubmHitSSgAA2tvbfY399eOhx5GPmxubq7UqTVFQeKCsllyfu90pus4qKFiW5WYymbyu61f/B/q4pKqmYKY6AAAAAElFTkSuQmCC';
    var icon16baseWatermark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJCSURBVDjLjZPNTxNBGIerBy/eOAgmYoz/gCYoJ/XgxZsxnrygFw8eJJGDiQc0MZEElFBL2igkoBBEFLUWaYNQiB+gKd1WbVKUCgVp2O3H2N3tfvYDf+5s7KbGNjLJc5r5PTPvm3ltNpttn0GTQfN/OGCwE4CtErqadF0XisXiVqlUQjWMfTidTkc1CV3NNCzLMhRFsRBFETzPI5VKmRKO4+ByuUyJt6dub3D0qG+ut8FuCugBTdOQz+ehqBoERYMkSRAEAel02hSoqgp6ycO+mwPR2asRMTGCWcdBxRLQcELUEE6qWGRlsKKCXC6HTCZjlaKKCfxg7NDIBD6PH8fL63sclsAoA1GiY35TxfuEjDAnW6UQQsBuRLH6sRN53guOaYHnRn3/+LX6XZaAEud1TK9LeL2WQ4hTzOZRCeG+Ih7ogp59hdSXC3jSvp8ZutJQZzWxLFjJavAs83B/yyIp5c1XiSSGtUC3GSZLF/Hm3gmcOrT7rJHb8Y/AHxcwFsnAvUTwkyQRDU9hefq88ewXEFcuG007jPTaJ/z5F38LYkTFcDiJwUUWUwEGfu8YfO77mBk4g5jvJIKPjmGVmTAvqioIbebQ92EDdl8Q3UPP4Z9fAJsIg1l4Cs/d04jO9Zs9qSnISLoRDqFjeBK93ghuPQ7iXMdbtPVMIsWuo1AomNQUUNpuP0Br1wgudT5DS/soWu/M4B3z3WxmmVqCX7XmoApbNFM5C0eMX6jQje2EjbMSHcBKQSOVbGOcy9DRbywLfgOaoblOxI0zHQAAAABJRU5ErkJggg==';
    var icon16baseMarkSigilo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALvSURBVDjLZZJdSFNhGMf/5+zo2pyb5cdyxXRNW2WkhhJGXlReFEZEBV0UVARBIAiCXnojdFE3QUQR3k6iC6GIoK+LMDNBaVpOW04by/yYzuk8O9v57DnHJqteeM57zvue5/c+///zMpqmITv6+vpsqqp2KorSRLGDAhRxiiFZlu+2t7dv4J/BZAF+v7+OkvtdLpfHbreDZVnQN9LpNGKxGGZpEOh8V1dX4D8AJdto87PX660SRRHRaBQ8z+ung+M4OJ1O4+dgMDhNa4e6u7uFLIDTH7R4q7y8vEqSJIRCoRkq9wSt/dIBgiC4EonER4/H46qtFKqqmXBq+vlt8MvvwaTnrhoASmiyWq0Ih8MgyJm2trZITpWRnp6eFmbtbbChuhiWkitweOqRmPVh6nXvnSygVNecTCb199l/jbpc56+3ey7BXtSAeHgS+YyIQvtO2IrdDiYycF0bCvuwuGYxNJ+tGYFJk6ApMjRZJpPWUVTVDMeeU8jMP4GwwmDpWwpSWlxJCxtHOZCJFy8cBwMWjMlC82lAZcidbUjFhpFJBODwtiI99whsvow8WwXM/BhSfH5LY8ebEKefBGiQl5+CM5eAYWwEyMPCHClhVJQdPEfJD8HmyRDXPVgZHEWaX8LhjkmjnaxeJlS6C4qIxMQoEsERLEQmsRrPoKymFeJCL0z5GjLrFYgNfILz5DWoUmrLHwJI0GVoioQi314siSziCQskzY35L/dBVwl8fBeWB4ex3cuAK7BDk8QcAPVe0xSqQMLq1wDGxn/gwLGbMEc/IPRsEIFXcUy9fAfWtAaWU6laFXrOXwBotEgSiqor8X1mEeLEC3hqm1FQQN0Zn4LviJtOL6auiIbcXABnlENUVdY9mMBEaB73Hj9A475KWEvNaNrvIx9+QuKTKHRT+STKkJ0L0CWYd9+ApcIEf4vZaCHZTmCSJgpQhCQpzFChyqZfuvFbADGDmf5Ooyx9Q6dvhrw10w3bvFiKsvmug/6M39LTvtXHnYlaAAAAAElFTkSuQmCC';
    var icon16baseBoxSigilo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALPSURBVDjLbVLdS1NhGP+d7bS5tcZYkzmzWmqKSSISpElEUEEkXfRxGRFBEA2MSC93o3TT6Ka/wECJQG+7CfrSLFLzIkd+TDsOjFg559nH2XvOe07Pe9Qy64XnfDzv8/ye3+/3vpJlWdhaQ0NDPtM0ezjnHRRBClCsUowbhvGwu7s7jx1L2gIYHBxspeaR6urqQ36/Hw6HA/QPTdOQyWSwRIuALvX29k7/A0DNPtr8VFdXV88YQzqdRqFQENMhyzLC4bBdnEwmFyjXEo/HS1sADvGg5O1IJFKv6zrm5uYWVVWN0rdLhPienZ1dEcDErp6kxLYzkMWDkh1erxepVArU1BWLxZRtNUpfX98ZRVGS0WjUrv0fQKXQTNPE99JOo0ROsBM1xLbyLw+Utzes8VQjvuc8tuaLzRNwWjosbsAyNkLXOQam22xTwxVZXNg3gcZbU9IGAzLxyuXTkMgOyemh93nApD25grbphLgObqiU6kG2mEV/VwILT9/9kSAmiULjxzPI7hAkyUcAuwBPgNImUMyBr89DY+uoCTXh2vAdxJmxDYAowhSTGNZmJknnbgSOnMDd548pz8AsDkb6I8EGNFUdh6oVcK/0HsVEUHpzf9UiAB1ChkVUA40NcLhC5IwJg5rPNl8HJxbc5DCJ5UoujaM1ncizEiaXX7OWfodLtgjdoilCa/bzNJxuPwItndAMZjcrP+ehmwYB6tCpZr2sonX/SeT1ovxhaVSzAYRWiyQEDkfh9O6l68UIQINB/oT9B6iZ22DfcssI+qowlR7DWGr0C1nRRgCMtJowDeHBDAHsASp8KBHAwHgCzCzbbGpDzWivPYePyihSsy+gcbSuPLDKNoCQ4K65Cc9BJySX2z7C4XY6CZoM0stLKk49uQrJ4UEm+xWJghPHHvHyximwMhZHemB7YV8cfTOM32+6Ycg7Vbxce4WRAt0YAby5fgEeKcjVvgWNOgAAAABJRU5ErkJggg==';
    var icon16baseNatJus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALDSURBVDjLpZNLTBNRFIb/6RMqtEDBFopFXiFGIERYmKgJUXBFQly4gI1LXbghcYPiI/JYmbhxLQvC3hjjQkSL4SnvYCRUCNJCSwSq0OnMdObeud6ZBIzB6MJJTiZz7/m/c89/5gqMMfzPY/tXwkYkUmkRhOuU0nJCyKvs7OyXPp+PHu4LfzvBSjh83+PxPM5wOs1vSZKQTCbjsizX1NXV7ZmLBuBPMbOw0LsVjzNVVZmiKIwLGQewRCLB5ufnv49NTGQYeZY/VQ6Nj/d5vd67BV4vOAC8IjjEqA673Y4stzuHi28buccAoVCoJ+D3dwZ8PqTTaRPAewf3wHwfHBwgx+OBRkjnMcDq4GB3FaX3TrvdZkVDfCg0QtM0c52birSm5f0G2O7q6vY7HF0FNhtofz/02VlTbIgM8ZORdvS+v4bME04kRRGpVCp8BFhtb7+ZUVralcF7JpOTIJEIhIEBYGjoV2Wiojj/DDpeNOHT8hJSothkjnEsGHT6W1qUYGsrtOlpkFgMOh/Xw+Y1MKpCZRQqhxTlVaK2+CI+fn2Hxc0pppC0+8OdhGhLWq0lRQ4HGDeHRKPQueOUB9FVNFffAGU6qE6hgyG2H0VN8QWIqizMRkb2a3ssebYfsqzK8Tj0RAKU93YIMI5siDf2vkDTuYm6Bo1qOEgnUXfqEkRNskytj+5ZdkRxI7y4uJRcXmb2wkLQVMoMhSgglMDnDsLvLkGhpwx2ayYKsgOYi45hbG10R1LRYP7Kz3Jz8+srKuYqq6r8mYzZpc1N3GqLQuFjVHkrMlFZef5Z4XzZVcxExjEcfrOtElyJ9bHPR3fhaVZW7kmX6/m5QKDRIwhuhRsZkyQ9Kkmtbbu7r6t7LKmG4GVXKDy8peqmeOXYZXrkcAgeq7U+02JppIytqbr+tkNRksZe2QMhRXWrS9Zp2bc+tn6o+QkxLL87j8znVAAAAABJRU5ErkJggg==';
    var icon16baseAutoSave = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJFSURBVDjLpZPNS1RhFMZ/5733zkzjR/ZBCUpoJdUiBCkll4m0CUKJIGpVSLjyL2gntDFop6shAolWbcSNIW0ircHBUHCloo3VjNY0jjP3831bWA5ai8Bnfc7vPOfhHDHGcBjZAENji7N1cSj7IcdqY2zkKoiC2qSFNsKPYoXpTPbBynj/4j8BlbLL9c4L3OqoZWLmM4/vXdpX9OJtHq0lBXQdBIgxhvtPZmZ7ui+yspZrjwKfWExxtMbh66YLAgj4geZnyd2YzmT7Vsb75/c5UEqwDLgVl55r57hxuYY3c18Y6mtDgO1KSBBETMwV0VpeA2f3ARKOwvUCcgWX9bzH0NhqvC4Okx9zBzNpPdGQ4OHIrJnOZLtWxvs/2AChNnhRiFIKy8j/ZjILiALYLgc4YnO8zsJSIWUv4Pt2CMBU+tteoxtC0YN8wUdEV1eItMHCIdSagru5l0kQaZ4OdqC1wQAWhqQNnudR3PGrANu2aGmE9FJATSxJwinhegHDr1ZRAmGk0ZHGAMYYMJB0dh0ogOVs6VNqcoGtosYv1+9lYikHERvBQsQCozBGCMIQ3w+rDtKjvQMAd4bfL59vFqYzQasjNoM36wi1vzvHgBFNwo4x8nKNreJOFfBHy9nSXGpyoSPSYOGgqZCae8TJ5BkERb68zsDVZygSlD3/b0B6tPf2byempRFO127T095JQ6wJFBTcJk7VhCRjYItUT/mgrgxOvWtrPtLdEG8gYdcT6gDRGjERWsosrS2TKwbMP78rcth3/gX/0SEvLZFG1QAAAABJRU5ErkJggg==';
    var icon16baseSEILegis = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAZJQTFRFAAAA////////////////////8/jozuKi+fvz////+Pz+p9vzdMfrbMPrhs7uueL1+v3+5vDQlb838vfm9fv+Na3jAJfb4/T7////teH0esns3PH6wOX2d8js6/f8////v+X2SbXm4vP7/////////////v//X77pB5rcYb/p2fD6////////wOb3FJ/eEJ7dCJvcptvy////////I6bgc8br/f7/teH1J6fhDJzd8fr9+/3/AZjbktLw////////zuv42O/6////Oa7jBprccsbr1+/5gczuF6Df+fz+////1+/5KajhHaPfweb2////////9vv+l9XwKKjhMqzi6fb8////+fv06vPX3+7W/P35/////////////f7/h8/uitDv////9Pv+PrDkV7vo/v//zOr4P7Hkh87ur970b8TrltTw////////t+L11e75yur4Q7Pl8fn9////////3fH6CpvdGKHf8fn9////2/D6rd70lNPwm9bxx+j3/v//////////0u35l9Xx3vL7////T5fsgAAAAIZ0Uk5TACFMVDwP8P/PGLn//////Jv7/9u9///YDv7/5vn/1gn8/+F9YEiu////6Vg1+P////9Tp///yvv//8nC//9vLPLjl/////D//7sf7P//+D0kv////9sG0v//so+Le7///zm+//+d9P//////MQv/6fT/yAEC5///x5Hk////9p8RS/D/5jRwoQdUAAAA20lEQVR4nGNgYGBgZGJmYQXSbOzs7BwMDJxc3Dy8fPwCDAyCQkJCwgwMIqJiICAOE5CQFBOTkpaRlYMJyCuIiSkqKauowrWoqYuJaWhqacMEdHT1xPTFxAwMjaACxiZipmbmFmKWVlABaxsxWzt7BzExR6iAk7OYi6ubu5iHJ1TAy9sH5AxfP3+YLQGBQcFiYiGhYQzhEZERUQwM0TGxcfFiYgmJDEnJYimpDAxp6RmZWWJi2Tm5eUCt+QwMBWCvFBYVl5SWiZVXMDBUVlXX1NbVNzAwNDY1t7QCAG4cKfQLuoXsAAAAAElFTkSuQmCC';
    var icon16baseBatchImgQuality = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAInSURBVDjLhZPda9NQHIbzVwlWryzthpWuIpWOieKYZXO2q1vC0KFr9aZM3Yr40QunspU2TVYmYhVRvNErwQtR3E0JTq3G2o80mc0Ql9dzTr/SYdnFA8k5yft78nLCjcxJNwKzsuoOiZoj2GKsi3NS1I7y4hIA7n9wgQvyz4KiWLphwNgyoRMq+jZ+MUyo1ToOR6Ra3wA6ua4b8F/2gL830WF8YRGB2VX4hBwOBEWrnxl3kGzQyXzyLJbfLuL+uwQevr+Jk7EsiBn2MmMBdbJ58UEEKx9vYfVDE89MBtTsTVjA53iiy/XbeD4XRaluwhWSNRZQIYmeay6cSsYxfCmFwfMpEGW4wjk4gxm4J7IECd6IhOW7z/AlkYRaawXQbyuTtCOJAQzPp/bU9gtrLOBHrUECJI3bP5bWypoJx7l9cE+tMO0TsTuIpl90uCq+xJnoEtP2hUV8Cp7G90orwMECGthQd5gynRxLPUWuoOOR8huPN//gyde/iMuvmLZvKgtlfBTFdsBgSNwslavQiOIACaCF0ofzRQv5bzsd6BrV9obSyI8EUCw34JwkAcd4aWFoWn5N00ihFi30+HwaM5LCmM4UGH5SLtX28uvMtlg2mwH2U9UuNHBlDUKu2ANdo9pDwjqqpNQSOwdyrSegXeih0Rh7wQ5da2lbdDI5RBqxT/Qa2ArdUK1ddLV7/gX7jb1QzdhGjVAl10262n0D7IXSSbtpa9vf+QeB6/JTIb6VuwAAAABJRU5ErkJggg==';

    var htmlButtonTable =   '   <div class="divQuickTable" style="display:none;"></div>'+
                            '   <a class="getQuickTableButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Tabela R\u00E1pida" hidefocus="true">'+
                            '      <span class="cke_button_icon cke_button__quicktable_icon" style="background: url(\''+icon16baseQuickTable+'\');">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Tabela R\u00E1pida</span>'+
                            '   </a>'+
                            '   <a class="getTablestylesButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Adicionar estilo \u00E0 tabela" hidefocus="true">'+
                            '      <span class="cke_button_icon cke_button__tablestyles_icon" style="background: url(\''+icon16baseTable+'\');">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Adicionar estilo a tabela</span>'+
                            '   </a>';

    var htmlButtonAfterImage =  '   <a class="getBatchImgQualityButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Reduzir qualidade das imagens" hidefocus="true">'+
                                '      <span class="cke_button_icon cke_button__batch_quality_pro_icon" style="background: url(\''+icon16baseBatchImgQuality+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Reduzir qualidade das imagens</span>'+
                                '   </a>';

    var htmlButtonBeforeCut =   '   <a class="getCopyStyleButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Copiar formata\u00E7\u00E3o" hidefocus="true">'+
                                '      <span class="cke_button_icon cke_button__copy_style_pro_icon" style="background: url(\''+icon16baseCopyStyle+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Copiar formata\u00E7\u00E3o</span>'+
                                '   </a>';
    
    var htmlButtonBeforeList =  '   <div class="divAlignText" style="display:none;">'+
                                '       <a class="getAlignLeftButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto \u00E0 esquerda" hidefocus="true">'+
                                '           <span class="cke_button_icon cke_button__align_left_pro_icon" style="background: url(\''+icon16baseAlignLeft+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto \u00E0 esquerda</span>'+
                                '       </a>'+
                                '       <a class="getAlignCenterButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto ao centro" hidefocus="true">'+
                                '           <span class="cke_button_icon cke_button__align_center_pro_icon" style="background: url(\''+icon16baseAlignCenter+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto ao centro</span>'+
                                '       </a>'+
                                '       <a class="getAlignRightButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto \u00E0 direita" hidefocus="true">'+
                                '           <span class="cke_button_icon cke_button__align_rigth_pro_icon" style="background: url(\''+icon16baseAlignRight+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto \u00E0 direita</span>'+
                                '       </a>'+
                                '       <a class="getAlignJustifyButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto justificadamente" hidefocus="true">'+
                                '           <span class="cke_button_icon cke_button__align_justify_pro_icon" style="background: url(\''+icon16baseAlignJustify+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto justificadamente</span>'+
                                '       </a>'+
                                '   </div>'+
                                '   <a class="getAlignButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto" hidefocus="true">'+
                                '      <span class="cke_button_icon cke_button__align_pro_icon" style="background: url(\''+icon16baseAlignCenter+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Alinhar texto</span>'+
                                '   </a>';
    
    var htmlButtonAfterLetters =    '   <a class="getCapLetterButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)" hidefocus="true">'+
                                    '      <span class="cke_button_icon cke_button__capletter_pro_icon" style="background: url(\''+icon16baseCapLetter+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)</span>'+
                                    '   </a>'+
                                    '   <a class="getFontSizeUpButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Aumentar tamanho da fonte" hidefocus="true">'+
                                    '      <span class="cke_button_icon cke_button__fontsize_up_pro_icon" style="background: url(\''+icon16baseFonteSizeUp+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Aumentar tamanho da fonte</span>'+
                                    '   </a>'+
                                    '   <a class="getFontSizeDownButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Diminuir tamanho da fonte" hidefocus="true">'+
                                    '      <span class="cke_button_icon cke_button__fontsize_down_pro_icon" style="background: url(\''+icon16baseFonteSizeDown+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Diminuir tamanho da fonte</span>'+
                                    '   <a class="getMarkSigiloButton cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Adicionar / Remover marca de sigilo no texto" hidefocus="true">'+
                                    '      <span class="cke_button_icon cke_button__mark_sigilo_pro_icon" style="background: url(\''+icon16baseMarkSigilo+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Adicionar / Remover marca de sigilo no texto</span>'+
                                    '   </a>';
    
    var htmlButtonAfterSave =   '   <a class="getAutoSaveButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Salvamento autom\u00E1tico ('+autoSaveInterval+' '+(autoSaveInterval == 1 ? 'minuto' : 'minutos')+')" hidefocus="true">'+
                                '      <span class="cke_button_icon cke_button__autosave_pro_icon" style="background: url(\''+icon16baseAutoSave+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Salvamento autom\u00E1tico ('+autoSaveInterval+' '+autoSaveInterval+' '+(autoSaveInterval == 1 ? 'minuto' : 'minutos')+')</span>'+
                                '   </a>';
    
    var htmlButton =    '<span class="cke_iconPro cke_toolgroup '+classStatus+'" role="presentation">'+
                        '   <a class="importDocButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir conte&uacute;do externo" hidefocus="true">'+
                        '       <span class="cke_button_icon cke_button__externalfile_icon" style="background: url(\''+icon16baseImport+'\');">&nbsp;</span>'+
                        '       <span class="cke_button_label" aria-hidden="false">Inserir conte&uacute;do externo</span>'+
                        '   </a>'+
                        '   <a class="getLinkLegisButtom cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar link de legisla\u00E7\u00E3o" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__linklegis_icon" style="background: url(\''+icon16baseLegis+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Adicionar link de legisla\u00E7\u00E3o</span>'+
                        '   </a>'+
                        '   <a '+($('#frmEditor').length==0 ? 'style="display:none"' : '')+' class="getCitacaoDocumentoButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir refer\u00EAncia de documento do processo" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__citacaodoc_icon" style="background: url(\''+icon16baseCitaDocumento+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir refer\u00EAncia de documento do processo</span>'+
                        '   </a>'+
                        '   <a class="getNotaRodapeButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir nota de rodap\u00E9" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__notarodape_icon" style="background: url(\''+icon16baseNotaRodape+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir nota de rodap\u00E9</span>'+
                        '   </a>'+
                        '   <a class="getSumarioButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir sum\u00E1rio" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__sumario_icon" style="background: url(\''+icon16baseSumario+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir sum\u00E1rio</span>'+
                        '   </a>'+
                        '   <a '+($('#frmEditor').length==0 ? 'style="display:none"' : '')+' class="getDadosProcessoButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir dados do processo" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__dadosprocesso_icon" style="background: url(\''+icon16baseDadosProcesso+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir dados do processo</span>'+
                        '   </a>'+
                        '   <a class="getTinyUrlButtom cke_button cke_buttonPro cke_button_off" href="#" title="Gerar link curto do TinyURL" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__tinyurl_icon" style="background: url(\''+icon16baseTinyUrl+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Gerar link curto do TinyURL</span>'+
                        '   </a>'+
                        '   <a class="getQrCodeButtom cke_button cke_buttonPro cke_button_off" href="#" title="Gerar C\u00F3digo QR" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__qrcode_icon" style="background: url(\''+icon16baseQrCode+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Gerar C\u00F3digo QR</span>'+
                        '   </a>'+
                        '   <a class="getPageBreakButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir Quebra de P\u00E1gina" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__pagebreak_icon" style="background: url(\''+icon16basePageBreak+'\') '+(isSeiSlim ? '' : '!important')+';">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir Quebra de P\u00E1gina</span>'+
                        '   </a>'+
                        '   <a class="getSessionBreakButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir Quebra de Sess\u00E3o" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__sessionbreak_icon" style="background: url(\''+icon16baseSessionBreak+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir Quebra de Sess\u00E3o</span>'+
                        '   </a>'+
                        '   <a class="getLatexButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir Equa\u00E7\u00E3o" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__latex_icon" style="background: url(\''+icon16baseLatex+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir Equa\u00E7\u00E3o</span>'+
                        '   </a>'+
                        '   <a class="getProcessoPublicoButton cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar Link de Documento P\u00FAblico" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__processopublico_icon" style="background: url(\''+icon16baseDocPublico+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Adicionar Link de Documento P\u00FAblico</span>'+
                        '   </a>'+
                        '   <a class="getMinutaWatermarkButton cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar Marca D\'\u00E1gua de MINUTA/MODELO" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__watermark_icon" style="background: url(\''+icon16baseWatermark+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Adicionar Marca D\'\u00E1gua de MINUTA/MODELO</span>'+
                        '   </a>'+
                        '   <a class="getBoxSigiloButton cke_button cke_buttonPro cke_button_off" href="#" title="Gerenciar marcas de sigilo do documento" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__boxsigilo_icon" style="background: url(\''+icon16baseBoxSigilo+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Gerenciar marcas de sigilo do documento</span>'+
                        '   </a>'+(verifyConfigValue('natjus') ? 
                        '   <a class="getLinkNatJusButtom cke_button cke_buttonPro cke_button_off" href="#" title="Pesquisa NatJus" hidefocus="true">'+
                        '      <span class="cke_button_icon cke_button__natjus_icon" style="background: url(\''+icon16baseNatJus+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Pesquisa NatJus</span>'+
                        '   </a>' : '')+
                        '</span>';

    var htmlButtonLegis =   '<span id="cke_legis" class="cke_toolgroup" role="presentation">'+
                            '   <a class="getLegisButtom cke_button cke_button_off" href="#" title="Enumerar norma" hidefocus="true">'+
                            '      <span class="cke_button_icon" style="background: url(\''+icon16baseSEILegis+'\');">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Enumerar norma</span>'+
                            '   </a>'+
                            '   <a class="helpLegisButtom cke_button cke_button_off" href="'+URLPAGES_SPRO+'/pages/LEGISTICA.html" target="_blank" title="Ajuda" hidefocus="true">'+
                            '      <span class="cke_button_icon" style="background-image: url(https://sei.antaq.gov.br/sei/editor/ck/skins/moonocolor/icons.png);background-position: 0 -168px;background-size:auto;">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Ajuda</span>'+
                            '   </a>'+
                            '</span>';

    return {
        default: htmlButton, 
        tables: htmlButtonTable, 
        beforeCut: htmlButtonBeforeCut, 
        afterletters: htmlButtonAfterLetters, 
        beforeList: htmlButtonBeforeList, 
        afterSave: htmlButtonAfterSave, 
        newBlock: htmlButtonLegis,
        afterImage: htmlButtonAfterImage
    };
}
function addButton(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){ 
        if ( $(txaEditor).length && !$('.cke_buttonPro').length ) {
                if ( !$('#idEditor').length ) { $('#divComandos').append('<input style="display:none" type="hidden" id="idEditor">'); }
                $(txaEditor).each(function(index){ 
                    var idEditor = $(this).attr('id').replace('cke_', '');
                    if ( $('iframe[title*="'+idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                        $(this).find('span.cke_toolbox').append(htmlButton('').default);
                        $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('').tables);
                        $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('').afterletters);
                        $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('').beforeCut);
                        $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('').beforeList);
                        $(this).find('span.cke_toolgroup .cke_button__base64image').after(htmlButton('').afterImage);
                        // $(this).find('span.cke_toolgroup .cke_button__save').after(htmlButton('').afterSave);
                        $(this).find('span.cke_toolbox').append(htmlButton('').newBlock);
                        insertFontIcon('head',$('iframe[title*="'+idEditor+'"]').contents());
                    } else {
                        $(this).find('span.cke_toolbox').append(htmlButton('disable').default);
                        $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('disable').tables);
                        $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('disable').afterletters);
                        $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('disable').beforeCut);
                        $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('disable').beforeList);
                        $(this).find('span.cke_toolgroup .cke_button__base64image').after(htmlButton('disable').afterImage);
                        // $(this).find('span.cke_toolgroup .cke_button__save').after(htmlButton('disable').afterSave);
                        $(this).find('span.cke_toolbox').append(htmlButton('disable').newBlock);
                    }
                });
                $('.getTablestylesButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { getSyleSelectedTable(this) } });
                $('.getQuickTableButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { getQuickTable(this) } });
                $('.importDocButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { importDocPro(this) } });
                $('.getLinkLegisButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getLegisSEI(this) } });
                $('.getLinkNatJusButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getNatJusSEI(this) } });
                $('.getCapLetterButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { convertFirstLetter(this) } });
                $('.getFontSizeUpButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'up') } });
                $('.getFontSizeDownButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'down') } });
                $('.getCopyStyleButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setCopyStyle(this) } });
                $('.getAlignButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { openAlignText(this) } });
                $('.getAlignLeftButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'left') } });
                $('.getAlignCenterButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'center') } });
                $('.getAlignRightButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'right') } });
                $('.getAlignJustifyButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'justify') } });
                $('.getCitacaoDocumentoButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getCitacaoDocumento(this) } });
                $('.getNotaRodapeButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getNotaRodape(this) } });
                $('.getSumarioButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getSumarioDocumento(this) } });
                $('.getDadosProcessoButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getDadosEditor(this) } });
                $('.getTinyUrlButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getTinyUrl(this) } });
                $('.getQrCodeButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getQrCode(this) } });
                $('.getPageBreakButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getPageBreak(this) } });
                $('.getSessionBreakButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getSessionBreak(this) } });
                $('.getLatexButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogLatex(this) } });
                $('.getBatchImgQualityButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogBatchImgQuality(this) } });
                $('.getProcessoPublicoButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogProcessoPublicoPro(this) } });
                $('.getMinutaWatermarkButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getMinutaWatermark(this) } });
                $('.getMarkSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getMarkSigilo(this) } });
                $('.getBoxSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxSigilo(this) } });
                // $('.getAutoSaveButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getAutoSave(this) } });
                $('.getLegisButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { initLegis(this) } });
                // $('.getUploadImgBase64Buttom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogUploadImgBase64(this) } });
                $('.cke_combo_button').on('click',function() { setDarkModeCkePanel(); });
                initFunctions();
                addStyleIframes(); 
        } else {
            addButton(TimeOut - 100);
            console.log('addButton Reload',TimeOut);
        }
    }, 500);
}
function addStyleIframes(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){
        $('div[id*="cke_txaEditor_"] a.cke_button').each(function(){
            var title = $(this).attr('title');
                title = (typeof title !== 'undefined') ? title.replace(/["']/g, "") : '';
            if (typeof title !== 'undefined' && title != '') {  
                $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()').removeAttr('title');
            }
        });
        var editorTitle = ($('#frmEditor').length > 0) ? 'iframe[title*="txaEditor_"]' : 'iframe[title*="txaConteudo"]';
        if ( $(editorTitle).eq(0).contents().find('head').find('style[data-style="seipro"]').length == 0 ) {
            $(editorTitle).each(function(){
                var iframe = $(this).contents();
                if ( iframe.find('head').find('style[data-style="seipro"]').length == 0 ) {
                    iframe.find('head').append('<style type="text/css" data-style="seipro"> \n'
                                               +(localStorage.getItem('darkModePro') ? '   * { color: #fbfbfe; } \n' : '')
                                               +'   p .ancoraSei { background: #e4e4e4; } \n'
                                               +'   html.dark-mode body[contenteditable="false"], \n'
                                               +'   html.dark-mode p.Texto_Fundo_Cinza_Maiusculas_Negrito, \n'
                                               +'   html.dark-mode p.Texto_Fundo_Cinza_Negrito, \n'
                                               +'   html.dark-mode p .ancoraSei, \n'
                                               +'   html.dark-mode p.Item_Nivel1 { \n'
                                               +'       background-color: #e5e5e566 !important;  \n'
                                               +'   } \n'
                                               +'   html.dark-mode .dark-mode-color-black, \n'
                                               +'   html.dark-mode .dark-mode-color-black * { \n'
                                               +'       color: #000 !important;  \n'
                                               +'   } \n'
                                               +'   html.dark-mode .dark-mode-color-white, \n'
                                               +'   html.dark-mode .dark-mode-color-white * { \n'
                                               +'       color: #fff !important;  \n'
                                               +'   } \n'
                                               +"   p .legis { background: #f1f1f1; } "
                                               +"   p .error { background-color: #ffd2d2; } "
                                               +"   p .alert { cursor: pointer; background: #fffbc9; border-left: 3px solid #ffe52a; padding-left: 4px; } "
                                               +"   span.tooltips { position: absolute; text-align: left; background: #fffbc9; text-indent: 0; border-left: 3px solid #ffe52a; margin: -46px 0px 0px -7px; width: 500px; font-size: 10pt; padding: 5px; color: #636363; height: 36px; }"
                                               +"   span.tooltips .ignoretext { background: #ecdc89; padding: 3px 5px; margin: 3px; font-size: 8pt; text-transform: uppercase; border-radius: 5px; float: right; }"
                                               +'   span.sigiloSEI { background-color: #ececec; border-bottom: 2px solid #d79d23; } \n'
                                               +'   span.sigiloSEI::before { content: "\\f023"; font-family: "Font Awesome 5 '+(isSeiSlim ? 'Pro' : 'Free')+'"; color: #d79d23; margin: 0 5px; font-size: 80%; font-weight: 600; } \n'
                                               +'   html.dark-mode .pageBreakPro, html.dark-mode .sessionBreakPro { background: #6f7071; height: 15px; } \n'
                                               +'   .pageBreakPro, .sessionBreakPro { background: #f1f1f1; height: 15px; } \n'
                                               +'   .pageBreakPro::before, .sessionBreakPro::before { border-bottom: 2px dashed #bfbfbf; display: block; content: \'\'; height: 7px; } \n'
                                               +'   .pageBreakPro::after, .sessionBreakPro::after { content: \'\u21B3 Quebra de p\u00E1gina\'; font-family: Calibri; text-align: center; display: block; margin-top: -10px; color: #585858; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; font-size: 10pt; font-style: italic; } \n'
                                               +'   .sessionBreakPro::after { content: \'\u21B3 Quebra de sess\u00E3o\' !important; } \n'
                                               +'   .linkDisplayPro { user-select: none; position: absolute; display: inline-block; padding: 8px; box-shadow: 0 1px 3px 1px rgba(60,64,67,.35); background: #fff; border-color: #dadce0; border-radius: 8px; margin-top: 16px; text-align: left; text-indent: initial; font-size: 12pt; text-transform: initial; font-weight: initial; letter-spacing: initial; text-decoration: initial; white-space: nowrap; } \n'
                                               +'   .linkDisplayPro a { padding: 0 8px; cursor: pointer; text-decoration: underline; color:#1155cc; } \n'
                                               +'   html.dark-mode .linkDisplayPro { background-color:#3D3D3D !important; } \n'
                                               +'   html.dark-mode .linkDisplayPro a { color:#fbfbfe !important; } \n'
                                               +'   html.dark-mode .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEzLjY0MDMyODc0MzE5OTIzNCIgaGVpZ2h0PSIxNi4xMjAwMDAwMDAwMDAwMDUiIHZpZXdCb3g9IjMxNC42Njk2NzEyNTY4MDA3NyAzMTEuOTQgMTMuNjQwMzI4NzQzMTk5MjM0IDE2LjEyMDAwMDAwMDAwMDAwNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNC42LjA8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDYgMCAwIDAuMDYgMzI0LjU3IDMyMCkiIGlkPSJ3MGQwNHhBNjhSaG1qYldBZWQyTmgiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBldmVub2RkOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC0xNTEsIC0xMjYpIiBkPSJNIDE3MCAxNCBMIDIwMC4wMDc1MzcgMTQgQyAyMDIuNzY5MDU3IDE0IDIwNSAxMS43NjM2NDkzIDIwNSA5LjAwNDk3MDkyIEwgMjA1IDQuOTk1MDI5MDggQyAyMDUgMi4yMzM4MjIxMiAyMDIuNzY0Nzk4IDAgMjAwLjAwNzUzNyAwIEwgMTAxLjk5MjQ2MyAwIEMgOTkuMjMwOTQzMSAwIDk3IDIuMjM2MzUwNjkgOTcgNC45OTUwMjkwOCBMIDk3IDkuMDA0OTcwOTIgQyA5NyAxMS43NjYxNzc5IDk5LjIzNTIwMTcgMTQgMTAxLjk5MjQ2MyAxNCBMIDEzMyAxNCBMIDEzMyAyMzggTCAxMDEuOTkyNDYzIDIzOCBDIDk5LjIzMDk0MzEgMjM4IDk3IDI0MC4yMzYzNTEgOTcgMjQyLjk5NTAyOSBMIDk3IDI0Ny4wMDQ5NzEgQyA5NyAyNDkuNzY2MTc4IDk5LjIzNTIwMTcgMjUyIDEwMS45OTI0NjMgMjUyIEwgMjAwLjAwNzUzNyAyNTIgQyAyMDIuNzY5MDU3IDI1MiAyMDUgMjQ5Ljc2MzY0OSAyMDUgMjQ3LjAwNDk3MSBMIDIwNSAyNDIuOTk1MDI5IEMgMjA1IDI0MC4yMzM4MjIgMjAyLjc2NDc5OCAyMzggMjAwLjAwNzUzNyAyMzggTCAxNzAgMjM4IEwgMTcwIDE0IFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjA2IDAgMCAwLjA2IDMxOCAzMTkuNDgpIiBpZD0iNjlfbUZlWUc0MzlsTGM2X3FqUHlhIiAgPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigyNTUsMjU1LDI1NSk7IGZpbGwtcnVsZTogZXZlbm9kZDsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtNDcuNTcsIC0xMTcuNzgpIiBkPSJNIDY1IDIyMi4yODA4MjkgQyA2MC42MTMxMTc2IDIyMi4yODA4MjkgNTYuMzc0MjE2MiAyMjIuMjgwODI4IDUyLjk5OTk5OTUgMjIyLjI4MDgyOCBMIDUzIDE3MCBMIDQyIDE3MCBMIDQyIDIyMi41NjA1OTMgQyAzOC42MTMwMjQ2IDIyMi41NjA1OTMgMzQuMzc2MzMwOCAyMjIuNTYwNTkzIDMwLjAwMDAwMDUgMjIyLjU2MDU5NCBMIDMwIDE3MCBMIDE5IDE3MCBMIDE5IDIyMi41NjA1OTUgQyAxNi4zMjQ4NjUgMjIyLjU2MDU5NSAxMy44NDYzMzY5IDIyMi41NjA1OTUgMTEuNzYxMjcyNSAyMjIuNTYwNTk2IEMgLTAuMzY5NTg2NDM4IDIyMi41NjA1OTkgMS4yODM4MTc0NiAyMTEuNTA5MzEzIDEuMjgzODE3NDYgMjExLjUwOTMxMyBDIDEuMjgzODE3NDYgMjExLjUwOTMxMyAwLjM4OTY4OTk0NCAxNzcuNzU2IDAuMzk2NTcxMjc3IDE1OCBMIDk0Ljc0MDgyMzIgMTU4IEMgOTQuNzM5MjczNiAxNzcuNzkzMDg5IDkzLjg1MzUzOTYgMjExLjIyOTU0OCA5My44NTM1Mzk2IDIxMS4yMjk1NDggQyA5My44NTM1Mzk2IDIxMS4yMjk1NDggOTUuNTA2OTQzNSAyMjIuMjgwODM0IDgzLjM3NjA4NDUgMjIyLjI4MDgzMSBDIDgxLjI1NTM3ODIgMjIyLjI4MDgzIDc4LjcyNzY0MTUgMjIyLjI4MDgzIDc2LjAwMDAwMDIgMjIyLjI4MDgzIEwgNzYgMTcwIEwgNjUgMTcwIEwgNjUgMjIyLjI4MDgyOSBaIE0gMC41NzQ1MzQwMzYgMTQ3IEMgMC41Nzk3NjgzODcgMTQ2Ljg5NjE0OSAwLjU4NTEzMTYzOCAxNDYuNzk0NzU1IDAuNTkwNjI1NTE0IDE0Ni42OTU4NjYgQyAxLjI4MzgxNzQ4IDEzNC4yMTg0MDkgLTAuNzk3MTEyMjg2IDEyMi40MzQxNDYgMTYuODc5MjgxNiAxMTYuMTk1NDIyIEMgMzQuNTU1Njc1NSAxMDkuOTU2Njk4IDI4LjY2NjI1MzYgMTA3LjUzMDUyMiAzMC4zOTc4NzkyIDk1Ljc0NjI1NzYgQyAzMi4xMjk1MDQ4IDgzLjk2MTk5MyAyNS44OTIxMjk4IDc4LjA2OTg2MyAyNS44OTIxMzE1IDQ0Ljc5NjY0OTYgQyAyNS44OTIxMzMgMTcuOTYwNzIwNiAzOC41MTY5NDY3IDEzLjkyMjAxNzMgNDUuNTIyMDkzOSAxMy4zNjM3NjE3IEMgNDUuNjA4OTgxNCAxMy4xMzQwNzI3IDQ1LjcwMDI1MDYgMTMuMDE2NDM5MSA0NS43OTYwNjMxIDEzLjAxNjQzOTEgQyA0OS44MzcyMDU2IDEzLjAxNjQzODkgNjkuMjQ1MjIzNyAxMS4yNDM2NzEzIDY5LjI0NTIyNTUgNDQuNTE2ODg0NyBDIDY5LjI0NTIyNzMgNzcuNzkwMDk4MiA2My4wMDc4NTIzIDgzLjY4MjIyODEgNjQuNzM5NDc3OCA5NS40NjY0OTI4IEMgNjYuNDcxMTAzNCAxMDcuMjUwNzU3IDYwLjU4MTY4MTUgMTA5LjY3NjkzMyA3OC4yNTgwNzU0IDExNS45MTU2NTcgQyA5NS45MzQ0NjkzIDEyMi4xNTQzODEgOTMuODUzNTM5NSAxMzMuOTM4NjQ0IDk0LjU0NjczMTUgMTQ2LjQxNjEwMSBDIDk0LjU1NzA1ODYgMTQ2LjYwMTk4OSA5NC41NjY5MjQyIDE0Ni43OTY3MjQgOTQuNTc2MzM5NyAxNDcgTCAwLjU3NDUzNDAzNiAxNDcgWiBNIDQ3LjUgNDEgQyA1Mi4xOTQ0MjA0IDQxIDU2IDM3LjE5NDQyMDQgNTYgMzIuNSBDIDU2IDI3LjgwNTU3OTYgNTIuMTk0NDIwNCAyNCA0Ny41IDI0IEMgNDIuODA1NTc5NiAyNCAzOSAyNy44MDU1Nzk2IDM5IDMyLjUgQyAzOSAzNy4xOTQ0MjA0IDQyLjgwNTU3OTYgNDEgNDcuNSA0MSBaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+") 12 1, auto !important; } \n'
                                               +'   .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDIwNSAyNTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZXNjPjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDkuMDAwMDAwLCAtMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9ImN1cnNvciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3MCwxNCBMMjAwLjAwNzUzNywxNCBDMjAyLjc2OTA1NywxNCAyMDUsMTEuNzYzNjQ5MyAyMDUsOS4wMDQ5NzA5MiBMMjA1LDQuOTk1MDI5MDggQzIwNSwyLjIzMzgyMjEyIDIwMi43NjQ3OTgsMCAyMDAuMDA3NTM3LDAgTDEwMS45OTI0NjMsMCBDOTkuMjMwOTQzMSwwIDk3LDIuMjM2MzUwNjkgOTcsNC45OTUwMjkwOCBMOTcsOS4wMDQ5NzA5MiBDOTcsMTEuNzY2MTc3OSA5OS4yMzUyMDE3LDE0IDEwMS45OTI0NjMsMTQgTDEzMywxNCBMMTMzLDIzOCBMMTAxLjk5MjQ2MywyMzggQzk5LjIzMDk0MzEsMjM4IDk3LDI0MC4yMzYzNTEgOTcsMjQyLjk5NTAyOSBMOTcsMjQ3LjAwNDk3MSBDOTcsMjQ5Ljc2NjE3OCA5OS4yMzUyMDE3LDI1MiAxMDEuOTkyNDYzLDI1MiBMMjAwLjAwNzUzNywyNTIgQzIwMi43NjkwNTcsMjUyIDIwNSwyNDkuNzYzNjQ5IDIwNSwyNDcuMDA0OTcxIEwyMDUsMjQyLjk5NTAyOSBDMjA1LDI0MC4yMzM4MjIgMjAyLjc2NDc5OCwyMzggMjAwLjAwNzUzNywyMzggTDE3MCwyMzggTDE3MCwxNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NSwyMjIuMjgwODI5IEM2MC42MTMxMTc2LDIyMi4yODA4MjkgNTYuMzc0MjE2MiwyMjIuMjgwODI4IDUyLjk5OTk5OTUsMjIyLjI4MDgyOCBMNTMsMTcwIEw0MiwxNzAgTDQyLDIyMi41NjA1OTMgQzM4LjYxMzAyNDYsMjIyLjU2MDU5MyAzNC4zNzYzMzA4LDIyMi41NjA1OTMgMzAuMDAwMDAwNSwyMjIuNTYwNTk0IEwzMCwxNzAgTDE5LDE3MCBMMTksMjIyLjU2MDU5NSBDMTYuMzI0ODY1LDIyMi41NjA1OTUgMTMuODQ2MzM2OSwyMjIuNTYwNTk1IDExLjc2MTI3MjUsMjIyLjU2MDU5NiBDLTAuMzY5NTg2NDM4LDIyMi41NjA1OTkgMS4yODM4MTc0NiwyMTEuNTA5MzEzIDEuMjgzODE3NDYsMjExLjUwOTMxMyBDMS4yODM4MTc0NiwyMTEuNTA5MzEzIDAuMzg5Njg5OTQ0LDE3Ny43NTYgMC4zOTY1NzEyNzcsMTU4IEw5NC43NDA4MjMyLDE1OCBDOTQuNzM5MjczNiwxNzcuNzkzMDg5IDkzLjg1MzUzOTYsMjExLjIyOTU0OCA5My44NTM1Mzk2LDIxMS4yMjk1NDggQzkzLjg1MzUzOTYsMjExLjIyOTU0OCA5NS41MDY5NDM1LDIyMi4yODA4MzQgODMuMzc2MDg0NSwyMjIuMjgwODMxIEM4MS4yNTUzNzgyLDIyMi4yODA4MyA3OC43Mjc2NDE1LDIyMi4yODA4MyA3Ni4wMDAwMDAyLDIyMi4yODA4MyBMNzYsMTcwIEw2NSwxNzAgTDY1LDIyMi4yODA4MjkgWiBNMC41NzQ1MzQwMzYsMTQ3IEMwLjU3OTc2ODM4NywxNDYuODk2MTQ5IDAuNTg1MTMxNjM4LDE0Ni43OTQ3NTUgMC41OTA2MjU1MTQsMTQ2LjY5NTg2NiBDMS4yODM4MTc0OCwxMzQuMjE4NDA5IC0wLjc5NzExMjI4NiwxMjIuNDM0MTQ2IDE2Ljg3OTI4MTYsMTE2LjE5NTQyMiBDMzQuNTU1Njc1NSwxMDkuOTU2Njk4IDI4LjY2NjI1MzYsMTA3LjUzMDUyMiAzMC4zOTc4NzkyLDk1Ljc0NjI1NzYgQzMyLjEyOTUwNDgsODMuOTYxOTkzIDI1Ljg5MjEyOTgsNzguMDY5ODYzIDI1Ljg5MjEzMTUsNDQuNzk2NjQ5NiBDMjUuODkyMTMzLDE3Ljk2MDcyMDYgMzguNTE2OTQ2NywxMy45MjIwMTczIDQ1LjUyMjA5MzksMTMuMzYzNzYxNyBDNDUuNjA4OTgxNCwxMy4xMzQwNzI3IDQ1LjcwMDI1MDYsMTMuMDE2NDM5MSA0NS43OTYwNjMxLDEzLjAxNjQzOTEgQzQ5LjgzNzIwNTYsMTMuMDE2NDM4OSA2OS4yNDUyMjM3LDExLjI0MzY3MTMgNjkuMjQ1MjI1NSw0NC41MTY4ODQ3IEM2OS4yNDUyMjczLDc3Ljc5MDA5ODIgNjMuMDA3ODUyMyw4My42ODIyMjgxIDY0LjczOTQ3NzgsOTUuNDY2NDkyOCBDNjYuNDcxMTAzNCwxMDcuMjUwNzU3IDYwLjU4MTY4MTUsMTA5LjY3NjkzMyA3OC4yNTgwNzU0LDExNS45MTU2NTcgQzk1LjkzNDQ2OTMsMTIyLjE1NDM4MSA5My44NTM1Mzk1LDEzMy45Mzg2NDQgOTQuNTQ2NzMxNSwxNDYuNDE2MTAxIEM5NC41NTcwNTg2LDE0Ni42MDE5ODkgOTQuNTY2OTI0MiwxNDYuNzk2NzI0IDk0LjU3NjMzOTcsMTQ3IEwwLjU3NDUzNDAzNiwxNDcgWiBNNDcuNSw0MSBDNTIuMTk0NDIwNCw0MSA1NiwzNy4xOTQ0MjA0IDU2LDMyLjUgQzU2LDI3LjgwNTU3OTYgNTIuMTk0NDIwNCwyNCA0Ny41LDI0IEM0Mi44MDU1Nzk2LDI0IDM5LDI3LjgwNTU3OTYgMzksMzIuNSBDMzksMzcuMTk0NDIwNCA0Mi44MDU1Nzk2LDQxIDQ3LjUsNDEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=") 12 1, auto !important; } \n'
                                               +'</style>\n');
                    if (localStorage.getItem('darkModePro')) iframe.find('html').addClass('dark-mode');
                    repareBgTableColor(iframe);
                }
                setOnBodyActs(iframe);
            });
            setCKEDITOR_instances();
            $('head').append("<style type='text/css' data-style='seipro'> "
                            +"  .divAlignText { display:none; background-image: -webkit-linear-gradient(top,#fff,#e4e4e4); position: absolute; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .divQuickTable { display:none; position: absolute; background: #f1f1f1; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .divQuickTable td { height: 15px; width: 15px; border: 1px solid #ccc; background: #fff; }"
                            +"  .divQuickTable .quickTableInfo { text-align: center; padding: 5px; color: #777; }"
                            +"  .divQuickTable .td_hover { background: #72bae2; }"
                            +"</style>");
            
        } else {
            addStyleIframes(TimeOut - 100);
            console.log('addStyleIframes Reload',TimeOut);
        }
    }, 500);
}
function setOnBodyActs(iframe) {
    iframe.find('body').on('mousedown', function(e) { 
        if ( typeof e.target.href !== 'undefined' && e.target.href.indexOf('http')  !== -1 && checkConfigValue('editarlinks')) { 
            showLinkTips(e.target, iframe);
        } else {
            hideLinkTips(iframe);
        }
        hideQuickTable();
    }).on('mouseup', function(e) { 
        applyCopyStyle();
        activeIconsSelectedText();
        closeAlignText();
    }).on('blur', function(e) { 
        hideLinkTips(iframe);
        hideQuickTable();
        removeCopyStyle();
        closeAlignText();
    });
}
function setDarkModeCkePanel() {
    var iframeCkePanel = $('iframe.cke_panel_frame').contents();
    if (localStorage.getItem('darkModePro') && iframeCkePanel.find('style[data-style="seipro"]').length == 0) {
    iframeCkePanel.find('head').append('<style type="text/css" data-style="seipro">\n'+
        '  body { background-color: #202123 !important; }\n'+
        '  .cke_panel_block * { background: #202123; border: none !important; color: #fff; box-shadow: none !important; text-shadow: none !important;}\n'+
        '  .cke_panel_block a[onclick*="Fundo"] p { background-color: #6f7071; }\n'+
        '  .cke_panel_block a:hover, .cke_panel_block a:hover p { background-color: #017fff !important; }\n'+
        '  .cke_panel_block .cke_selected *  { background: transparent; color: #202123 !important; }\n'+
        '</style>');
    }
}
function repareBgTableColor(iframe) {
    iframe.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function(){
        setBgTableColor(this);
    });
}
function setBgTableColor(this_) {
    var bgColor = $(this_).css('background-color');
    if (typeof bgColor !== 'undefined' && bgColor !== null) {
        var brightness = getBrightnessColor(rgbToHexString(bgColor));
        var textColour = (brightness > 125) ? 'black' : 'white';
        $(this_).addClass('dark-mode-color-'+textColour);
    }
}
function setCKEDITOR_instances() {
    for(var id in CKEDITOR.instances) {
        CKEDITOR.instances[id].setKeystroke(CKEDITOR.ALT + 48 /*0*/, false); // desabilita o popup de acessibilidade, que impede acessar o caractere º no mac (option+0)
        CKEDITOR.instances[id].on('focus', function(e) {
            // Fill some global var here
            idEditor = e.editor.name;
            oEditor = CKEDITOR.instances[idEditor];
            iframeEditor = ($('#frmEditor').length > 0) ? $('iframe[title*="'+idEditor+'"]').contents() : $(txaEditor);
            $('#idEditor').val(idEditor);
            if ( iframeEditor.find('body').attr('contenteditable') == 'true' || $('#frmEditor').length == 0) {
                $('#cke_'+idEditor).find('.cke_iconPro').removeClass('cke_button_disabled');
            }
            if (checkConfigValue('editarimagens')) editImgPro(oEditor);
            loadResizeImg();
            insertFontIcon('head',$('iframe[title*="'+idEditor+'"]').contents());
            if (checkConfigValue('teclasatalho')) stylesEditorKeystroke();
        });
    }
}
// Adiciona salvamento automatico
function checkAutoSave() {
    if (getOptionsPro('autoSaveEditor')) {
        // $('.getAutoSaveButtom').trigger('click');
    }
}
function getAutoSave(this_) {
    /*
    setParamEditor(this_);

    if ($('#cke_'+idEditor).find('.getAutoSaveButtom').hasClass('cke_button_on')) {
        $('#cke_'+idEditor).find('.getAutoSaveButtom').addClass('cke_button_off').removeClass('cke_button_on');
        clearInterval(autoSaveEditor);
        removeOptionsPro('autoSaveEditor');
    } else {
        clearInterval(autoSaveEditor);
        autoSaveEditor = setInterval(function () {
            if (isIntervalInProgress) return false;
                isIntervalInProgress = true;
            if (!$('#cke_'+idEditor).find('.cke_button.cke_button__save').hasClass('cke_button_disabled')) {
                console.log('setAutoSave');
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    var $form = oEditor.element.$.form;
                    if ($form) $form.submit();
                }
            }
            isIntervalInProgress = false;
        },autoSaveInterval * 1000 * 60);
        $('#cke_'+idEditor).find('.getAutoSaveButtom').addClass('cke_button_on').removeClass('cke_button_off');
        setOptionsPro('autoSaveEditor', true);
    }
    */
}
// Adiciona quebra de pagina
function getPageBreak(this_) {
    setParamEditor(this_);
    
    var htmlBreakPage = '<div class="pageBreakPro" style="page-break-after: always"></div>';
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        if ($('#frmEditor').length > 0) {
            iframeEditor.find(pElement).before(htmlBreakPage);
        } else {
            pElement.before(htmlBreakPage);
        }
        oEditor.fire('saveSnapshot');
    }
}
// Adiciona quebra de pagina
function getSessionBreak(this_) {
    setParamEditor(this_);
    
    var htmlSessionPage = '<div class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></div>';
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        if ($('#frmEditor').length > 0) {
            iframeEditor.find(pElement).before(htmlSessionPage);
        } else {
            pElement.before(htmlSessionPage);
        }
        oEditor.fire('saveSnapshot');
    }
}

// Altera o alinhamento do texto
function setAlignText(this_, mode) {
    setParamEditor(this_);
    var select = oEditor.getSelection().getStartElement();
    var element = $(select.$);
    var p = element.closest('p').attr('class');
    var newClass = '';
    if ( p == 'Texto_Alinhado_Esquerda' || p == 'Texto_Centralizado' || p == 'Texto_Alinhado_Direita' || p == 'Texto_Justificado' ) {
        if ( mode == 'left' ) { newClass = 'Texto_Alinhado_Esquerda' }
        if ( mode == 'center' ) { newClass = 'Texto_Centralizado' }
        if ( mode == 'right' ) { newClass = 'Texto_Alinhado_Direita' }
        if ( mode == 'justify' ) { newClass = 'Texto_Justificado' }
    } else if ( p == 'Tabela_Texto_Alinhado_Esquerda' || p == 'Tabela_Texto_Centralizado' || p == 'Tabela_Texto_Alinhado_Direita' || p == 'Tabela_Texto_Justificado' ) {
        if ( mode == 'left' ) { newClass = 'Tabela_Texto_Alinhado_Esquerda' }
        if ( mode == 'center' ) { newClass = 'Tabela_Texto_Centralizado' }
        if ( mode == 'right' ) { newClass = 'Tabela_Texto_Alinhado_Direita' }
        if ( mode == 'justify' ) { newClass = 'Tabela_Texto_Justificado' }
    } else if ( p == 'Texto_Alinhado_Esquerda_Maiusc' || p == 'Texto_Centralizado_Maiusculas' || p == 'Texto_Alinhado_Direita_Maiusc' || p == 'Texto_Justificado_Maiusculas' ) {
        if ( mode == 'left' ) { newClass = 'Texto_Alinhado_Esquerda_Maiusc' }
        if ( mode == 'center' ) { newClass = 'Texto_Centralizado_Maiusculas' }
        if ( mode == 'right' ) { newClass = 'Texto_Alinhado_Direita_Maiusc' }
        if ( mode == 'justify' ) { newClass = 'Texto_Justificado_Maiusculas' }
    }
    oEditor.focus();
    oEditor.fire('saveSnapshot');
    if ( newClass != '' ) { 
        element.closest('p').removeAttr('style').attr('class', newClass); 
    } else {
        element.closest('p').removeAttr('style').css('text-align', mode);
    }
    oEditor.fire('saveSnapshot');
}
function openAlignText(this_) {
    if ($(this_).hasClass('cke_button_on')) {
        $(this_).addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.divAlignText').hide();
    } else {
        $(this_).addClass('cke_button_on').removeClass('cke_button_off').closest('.cke_top').find('.divAlignText').show();
    }
}
function closeAlignText() {  
    //var idEditor = $('#idEditor').val();
    $('#cke_'+idEditor).find('.getAlignButtom').addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.divAlignText').hide();
}

// Modifica o tamanho da fonte
function changeFontSize(this_, mode) {
    setParamEditor(this_);
    var select = oEditor.getSelection().getStartElement();
    var fontSize = parseFloat($(select.$).css('font-size'));
    var newFontSize = (mode=='up') ? fontSize+2 : fontSize-2;

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'style': 'font-size: '+newFontSize+'px'
        }
    });
    if (newFontSize > 7 && newFontSize < 70 && hasSelection(oEditor)) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.applyStyle(style);
        oEditor.fire('saveSnapshot');
    }
}
// Adiciona/Remove marca de sigilo
function getMarkSigilo(this_) {
    setParamEditor(this_);
    var select = oEditor.getSelection().getStartElement();
    var checkClass = $(select.$).closest('span').hasClass('sigiloSEI');

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'class': 'sigiloSEI'
        }
    });
    if (hasSelection(oEditor) && !checkClass) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.applyStyle(style);
        oEditor.fire('saveSnapshot');
    } else if (checkClass) {
        var element = $(select.$).closest('.sigiloSEI');
            element.after(element.html()).remove();
        console.log(element.html());
    }
}
function getTarjaSigilo(this_) {
    setParamEditor(this_);

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'class': 'sigiloSEI'
        }
    });
    if (hasSelection(oEditor)) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.applyStyle(style);
        actionsMarkSigilo(undefined, 'apply');
        oEditor.fire('saveSnapshot');
    }
}
function getBoxSigilo(this_) {
    setParamEditor(this_);
    oEditor.openDialog('SigiloSEI');
}
function actionsMarkSigilo(this_, mode, text = false, increment = false) {
    var _this = $(this_);
    var _parent = _this.closest('.cke_dialog_page_contents');
    var result = '';
    if (mode == 'replace') {
        var textFind = (text) ? text : _parent.find('#cke_inputSigilo2_textInput').val().trim();
        if (textFind != '') {
            var i_increment = (increment) ? parseInt($('#tabSigilo2_result .count').length ? $('#tabSigilo2_result .count').text() : 0) : 0; console.log(i_increment);
            var i = 0;
            var displayResult = '';
            var tagSigilo = iframeEditor.find('p:contains("'+textFind+'") span.sigiloSEI');
            if (tagSigilo.length > 0) { tagSigilo.after(tagSigilo.html()).remove() }
            var matches = iframeEditor.find('p').map(function(){ return $(this).text() }).get().join(' ').match(new RegExp('\\b'+textFind+'\\b', 'igm'));
                i = matches ? matches.length : 0;
            if (i > 0) {
                oEditor.focus();
                oEditor.fire('saveSnapshot');
                iframeEditor.find('p').wrapInTag({'class': 'sigiloSEI', 'words' : [textFind]});

                oEditor.fire('saveSnapshot');
                matches = iframeEditor.find('p').map(function(){ return $(this).text() }).get().join(' ').match(new RegExp('\\b'+textFind+'\\b', 'igm'));
                i = matches ? matches.length : 0;
                i = i+i_increment;
                displayResult = '  <i class="fas fa-check-circle verdeColor"></i> <span class="count">'+i+'</span> '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'adicionada' : 'adicionadas')+' com sucesso!';
            } else {
                displayResult = '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhum texto encontrado!';
            }
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         displayResult+
                         '</label>';
        } else {
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Digite um texto para adicionar a marca de sigilo'+
                     '</label>';
        }
        _parent.find('#tabSigilo2_result').show().html(result);
        $('#tabSigilo3_result').hide().html('');
        htmlTabSigiloResult();
    } else if (mode == 'remove') {
       var i = 0;
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        iframeEditor.find('span.sigiloSEI').each(function(){
            $(this).after($(this).html()).remove();
            i++;
        });
        iframeEditor.find('span.sigiloSEI_tarja').each(function(){
            if (typeof $(this).data('text') !== 'undefined' && $(this).data('text') != '') {
                $(this).after($(this).data('text')).remove();
                i++;
            }
        });
        oEditor.fire('saveSnapshot');
        var displayResult = (i==0) 
                    ? '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca encontrada!'
                    : '  <i class="fas fa-check-circle verdeColor"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'removida' : 'removidas')+' com sucesso!';
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     displayResult+
                     '</label>';
            _parent.find('#tabSigilo3_result').show().html(result);
            $('#tabSigilo2_result').hide().html('');
            htmlTabSigiloResult();
    } else if (mode == 'apply') {
        var i = 0;
        var redactor = '\u2588';
            oEditor.focus();
            oEditor.fire('saveSnapshot');
            iframeEditor.find('span.sigiloSEI').each(function(){
                var rand = randomNumber(8, 15);
                $(this).data('text', $(this).html()).text(redactor.repeat(rand)).attr('class', 'sigiloSEI_tarja');
                i++;
            }); 
            oEditor.fire('saveSnapshot');
            if (i > 0) {
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         '  <i class="fas fa-check-circle verdeColor"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'tarjada' : 'tarjadas')+' com sucesso!<br>'+
                         '  <i class="fas fa-exclamation-triangle laranjaColor"></i>  '+(i==1 ? 'Esta marca tarjada poder\u00E1 ser revertida' : 'Estas marcas tarjadas poder\u00E3o ser revertidas')+' na aba "Remover marcas"<br> somente enquanto aberto este editor de documentos.'+
                         '</label>';
                _parent.find('#tabSigilo1_result').show().html(result);
            } else {
                htmlTabSigiloResult();
            }
            $('#tabSigilo2_result').hide().html('');
            $('#tabSigilo3_result').hide().html('');
            rodapeSigiloMark();
    } else if (mode == 'email_cpf') {
        oEditor.focus();
        $('#tabSigilo2_result').html('');
        var arrayEmails = extractEmails(iframeEditor.text());
            arrayEmails = (arrayEmails.length > 0) ? uniqPro(arrayEmails) : [];
        var arrayCPFs = extractCPFs(iframeEditor.text());
            arrayCPFs = (arrayCPFs.length > 0) ? uniqPro(arrayCPFs) : [];
        var arrayDadosSensiveis = $.merge(arrayCPFs, arrayEmails);
            if (arrayDadosSensiveis.length > 0) {
                $.each(arrayDadosSensiveis, function(i,v){
                    actionsMarkSigilo(this_, 'replace', v, true);
                });
            }
    }
}
function rodapeSigiloMark() {
    var lastFrame = false;
    var countMarks = 0;
    $('iframe.cke_wysiwyg_frame').each(function(index){
        var iframe = $(this).contents();
        if ( iframe.find('body').attr('contenteditable') == 'true' ) {
            lastFrame = iframe;
            countMarks = countMarks+iframe.find('.sigiloSEI_tarja').length;
        }
    });
    lastFrame.find('body .sigiloSEI_sigilo_mark').remove();
    if (countMarks > 0) {
        lastFrame.find('body').append('<p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_'+countMarks+'_marcas_sigilo</p>');
    }
}
function htmlTabSigiloResult() {
    var result = '';
    var tagSigilo = iframeEditor.find('p span.sigiloSEI');
    var i = tagSigilo.length;
    var iconMarkSigilo = $('#cke_'+idEditor).find('.getMarkSigiloButton .cke_button_icon').attr('style');
    if (i == 0) { 
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                  '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba <br>'+
                  ' "Localizar texto" ou adicione manualmente com o bot\u00E3o <span style="width: 16px; height: 16px; display: inline-block; '+iconMarkSigilo+'">&nbsp;</span>';
                  '</label>';
        $('#tabSigilo1_result').show().html(result);
    } else {
        result =  '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                  '  <i class="fas fa-info-circle" style="color: #007fff;"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' de sigilo '+(i==1 ? 'encontrada' : 'encontradas')+' no documento! <br>'+
                  '</label>';
    }
    $('#tabSigilo1_result').show().html(result);
}
function getDialogSigilo() {
    CKEDITOR.dialog.add( 'SigiloSEI', function ( editor )
      {
         return {
            title : 'Gerenciar marcas de sigilo do documento',
            minWidth : 700,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.okButton ],
            onShow : function() {
                setTimeout(function(){ 
                    $('.tabSigilo_result').html('').hide();
                    htmlTabSigiloResult();
                    var textSelected = editor.getSelection().getSelectedText();
                    $('#cke_inputSigilo2_textInput').val(textSelected);
                }, 500);
            },
            contents :
            [
               {
                  id : 'tab2',
                  label : '1. Localizar texto e dados pessoais',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar texto e adicionar marca <br>de sigilo em todo o documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <span class="cke_dialog_ui_labeled_content" id="cke_inputSigilo2_uiElement">'+
                              '                 <div class="cke_dialog_ui_input_text" role="presentation" style="width:200px">'+
                              '                     <input class="cke_dialog_ui_input_text" id="cke_inputSigilo2_textInput" type="text" aria-labelledby="cke_inputSigilo2_label">'+
                              '                 </div>'+
                              '             </span>'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" onclick="actionsMarkSigilo(this, \'replace\')" title="Adicionar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">'+
                              '                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Adicionar</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:20px 0 0">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar dados pessoais como <br>e-mails e CPFs em todo o documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:20px 0 0">'+
                              '             <a style="user-select: none;" onclick="actionsMarkSigilo(this, \'email_cpf\')" title="Localizar dados pessoais" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">'+
                              '                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Localizar dados pessoais</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabSigilo2_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
             		}
                  ]
               }, {
                id : 'tab1',
                label : '2. Tarjar marcas de sigilo',
                elements :
                [
                  {
                      type: 'html',
                      html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                            ' <tbody>'+
                            '     <tr class="cke_dialog_ui_hbox">'+
                            '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                            '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo1_label" for="cke_inputSigilo1_textInput">Aplicar tarja de sigilo <br> no documento</label>'+
                            '         </td>'+
                            '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                            '             <a style="user-select: none;" onclick="actionsMarkSigilo(this, \'apply\')" title="Aplicar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">'+
                            '                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Aplicar</span>'+
                            '             </a>'+
                            '         </td>'+
                            '     </tr>'+
                            ' </tbody>'+
                            '</table>'+
                            '<div id="tabSigilo1_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
                   }
                ]
             }, {
                  id : 'tab3',
                  label : 'Remover marcas',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label" for="cke_inputSigilo_textInput">Remover todas as marcas <br>de sigilo no documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" onclick="actionsMarkSigilo(this, \'remove\')" title="Remover" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo3_label" id="buttonSigilo3_uiElement">'+
                              '                 <span id="buttonSigilo3_label" class="cke_dialog_ui_button">Remover</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabSigilo3_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'+
                              '<div id="tabSigilo3_info" style="margin-top: 15px;">'+
                              '     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                              '       <i class="fas fa-exclamation-triangle laranjaColor"></i> Marcas de sigilo j\u00E1 tarjadas n\u00E3o poder\u00E3o ser revertidas ap\u00F3s salvar e abandonar <br>este editor de documentos.'+
                              '     </label>'+
                              '</div>'
             		}
                  ]
               }, {
                  id : 'tab4',
                  label : 'Guia r\u00E1pido',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:100%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label" for="cke_inputSigilo_textInput">Acesse o guia r\u00E1pido sobre como <a target="_blank" href="https://sei-pro.github.io/sei-pro/pages/SIGILODOC.html" class="linkDialog">Adicionar marca de sigilo e tarjas pretas de confidencialidade <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i></a></label>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'
             		}
                  ]
               }
            ]
         };
      } );
}
function setChosenInCke() {
    if (verifyConfigValue('substituiselecao')) {
        $('div.cke_dialog_ui_input_select').css({'position':'absolute', 'max-width': '500px', 'min-width': '200px'});
        $('span.cke_dialog_ui_labeled_content').css({'height':'27px', 'display': 'flex'});
        $('select.cke_dialog_ui_input_select').each(function(){
            initChosenReplace('box_init',this);
        });
        setTimeout(function(){ 
            $('.cke_dialog_ui_labeled_content .chosen-container-single').css({'max-width': '500px', 'min-width': '200px'});
        }, 800);
    }
}
function hasSelection(editor) {
    var sel = editor.getSelection();
    var ranges = sel.getRanges();
    for (var i = 0, len = ranges.length; i < len; ++i) {
        if (!ranges[i].collapsed) {
            return true;
        }
    }
    return false;
}

// Aplica estilo a selecao
function getElementStyleSelected(element) {
    var fontSize = (parseFloat(element.css('font-size')) == 16 && (element.closest('sub').length || element.closest('sup').length)) ? false : parseFloat(element.css('font-size'));
    var color = (element.css('color') == 'rgb(0, 0, 0)') ? false : element.css('color');
    var backgroundColor = (element.css('background-color') == 'rgba(0, 0, 0, 0)') ? false : element.css('background-color');
    var bold = (element.closest('strong').length) ? true : false;
    var underline = (element.closest('u').length) ? true : false;
    var italic = (element.closest('em').length) ? true : false;
    var strike = (element.closest('s').length) ? true : false;
    var subscript = (element.closest('sub').length) ? true : false;
    var superscript = (element.closest('sup').length) ? true : false;
    return {fontSize: fontSize, color: color, backgroundColor: backgroundColor, bold: bold, underline: underline, italic: italic, strike: strike, subscript: subscript, superscript: superscript}
}
function setCopyStyle(this_) {
    setParamEditor(this_);
    actionCopyStyle(oEditor);
}
function actionCopyStyle(editor) {
    var select = editor.getSelection().getStartElement();
    var element = $(select.$);
    var style = getElementStyleSelected(element);
    if ($('#cke_'+idEditor).find('.getCopyStyleButtom').hasClass('cke_button_on')) {
        removeCopyStyle();
    } else {
        sessionStorage.setItem('copyStylePro', JSON.stringify(style));
        element.closest('body').addClass('cke_copyformatting_active');
        $('#cke_'+idEditor).find('.getCopyStyleButtom').addClass('cke_button_on').removeClass('cke_button_off');
    }
}
function getCopyStyle() {
    return JSON.parse(sessionStorage.getItem('copyStylePro'));
}
function applyCopyStyle() {
    var select = oEditor.getSelection().getStartElement();
    var element = $(select.$);
    var p = element.closest('p').attr('class');
    var style = getCopyStyle();
    if (hasSelection(oEditor) || element.closest('body').hasClass('cke_copyformatting_active')) {
        $('#cke_'+idEditor).find('.getCopyStyleButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getCopyStyleButtom').addClass('cke_button_disabled');
    }
    if (typeof style !== 'undefined' && hasSelection(oEditor) && element.closest('body').hasClass('cke_copyformatting_active')) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.fire('lockSnapshot');
        oEditor.execCommand('removeFormat');
        if (typeof style !== 'undefined' && style.backgroundColor && style.backgroundColor != '') { 
            var styleBackgroundColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'background-color: '+style.backgroundColor
                }
            });
            oEditor.applyStyle(styleBackgroundColor); 
        }
        if (typeof style !== 'undefined' && style.fontSize > 0 ) { 
            var styleFontSize = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'font-size: '+style.fontSize+'px'
                }
            });
            oEditor.applyStyle(styleFontSize); 
        }
        if (typeof style !== 'undefined' && style.bold) { oEditor.execCommand('bold'); }
        if (typeof style !== 'undefined' && style.underline) { oEditor.execCommand('underline'); }
        if (typeof style !== 'undefined' && style.italic) { oEditor.execCommand('italic'); }
        if (typeof style !== 'undefined' && style.strike) { oEditor.execCommand('strike'); }
        if (typeof style !== 'undefined' && style.subscript) { oEditor.execCommand('subscript'); }
        if (typeof style !== 'undefined' && style.superscript) { oEditor.execCommand('superscript'); }
        if (typeof style !== 'undefined' && style.color && style.color != '') { 
            var styleColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'color: '+style.color
                }
            });
            oEditor.applyStyle(styleColor); 
        }
        if (!window.event.altKey) { removeCopyStyle(); }
        element.closest('p').attr('class', p);
        oEditor.fire('unlockSnapshot');
        oEditor.fire('saveSnapshot');
    }
}
function removeCopyStyle() {
    var select = oEditor.getSelection().getStartElement();
    var element = $(select.$);
    element.closest('body').removeClass('cke_copyformatting_active');
    sessionStorage.removeItem('copyStylePro');
    $('#cke_'+idEditor).find('.getCopyStyleButtom').addClass('cke_button_off').removeClass('cke_button_on');
}
function menuCopyStyle( editor ) {
    if ( editor.contextMenu && typeof editor.getMenuItem('copystyle') === 'undefined' ) {
        editor.addMenuGroup( 'copystyleGroup', -10 * 3 );
        editor.addMenuItem( 'copystyle', {
            label: 'Copiar formata\u00E7\u00E3o',
            icon: URL_SPRO+'icons/copiarformatacao.png',
            command: 'copystyle',
            group: 'copystyleGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'p', true ) && hasSelection(editor) ) {
                return { copystyle: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.addCommand( 'copystyle', {
            exec: function( editor ) {
                actionCopyStyle(editor);
            }
        });
    }
}
function stylesEditorKeystroke() {
    if (getOptionsPro('stylesEditor')) {
        $.each(getOptionsPro('stylesEditor'), function(i, v){
            oEditor.addCommand(v, {
                exec: function( editor ) {
                    var select = editor.getSelection().getStartElement();
                    var element = $(select.$);
                    if (element.is('p')) {
                        element.attr('class',v);
                    } 
                }
            });
            if (i < 36) {
                var key = (i <= 9) ? 48+i : 55+i;
                    if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                        oEditor.setKeystroke(CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    }
            }
        });
        if (getOptionsPro('stylesEditor')) {
            $('a.cke_combo_button[href*="Estilos de Format"]').on('click',function(){
                var ckePanel = $('iframe[class="cke_panel_frame"]').contents();
                var style = '<style type="text/css" data-style="seipro-styleeditor">'+
                            '   .cke_panel_listItem a p {'+
                            '       overflow: hidden;'+
                            '   }'+
                            '   .cke_panel_listItem a {'+
                            '       padding-right: 160px;'+
                            '       position: relative;'+
                            '   }'+
                            '   sup {'+
                            '       position: absolute;'+
                            '       right: 10px;'+
                            '       font-family: monospace;'+
                            '       background: #ccc;'+
                            '       padding: 3px 5px;'+
                            '       border-radius: 5px;'+
                            '       opacity: 0.5;'+
                            '       top: calc(50% - 10px);'+
                            '   }'+
                            '</style>';
                if (ckePanel.find('style[data-style="seipro-styleeditor"]').length == 0) {
                    ckePanel.find('head').append(style);
                }
                    ckePanel.find('sup').remove();
                    var isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1 ? true : false;
                    $.each(getOptionsPro('stylesEditor'), function(i, v){
                        if (i < 36) {
                            var key = (i <= 9) ? 48+i : 55+i;
                            var combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                                combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                                combinacaoteclas = isMac ? 'CMD + SHIFT' : 'CTRL + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                                combinacaoteclas = isMac ? 'CMD + OPTION' : 'CTRL + ALT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                                combinacaoteclas = isMac ? 'OPTION + SHIFT' : 'ALT + SHIFT';
                            }
                            ckePanel.find('li.cke_panel_listItem a[title="'+v+'"]').prepend('<sup>'+combinacaoteclas+' + <strong>'+String.fromCharCode(key)+'</strong></sup>');
                        }
                    });
            });
        }
    }
}
function editImgPro( editor ) {
    if ( editor.contextMenu && !delayCrash && typeof editor.getMenuItem('ImageEditorPro') === 'undefined') {

        delayCrash = true;
        setTimeout(function(){ delayCrash = false }, 300);

        editor.removeMenuItem('image');

        editor.addMenuGroup( 'base64imageGroup', 30);
        editor.addMenuItem( 'base64imageItem', {
            label: 'Formatar Imagem',
            icon: URL_SPRO+'icons/formatarimagem.png',
            command: 'base64imageDialog',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { base64imageItem: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'base64imageDialog', {
            exec: function( editor ) {
                openDialogUploadImgBase64(editor);
            }
        });

        editor.addMenuItem( 'ImageEditorPro', {
            label: 'Editar Imagem',
            icon: URL_SPRO+'icons/editarimagem.png',
            command: 'ImageEditorPro',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { ImageEditorPro: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'ImageEditorPro', {
            exec: function( editor ) {
                openImageEditorPro(editor);
            }
        });

        editor.on("doubleclick", function(evt){
            if(evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === "img") {
                evt.data.dialog = 'base64imageDialog';
                editor.getSelection().selectElement(evt.data.element);
            }
        });
    }
}

// Adiciona tabela rapida
function hideQuickTable() {
    $('.divQuickTable').each(function(){
        $(this).html('').hide();
    })
    $('.getQuickTableButtom').addClass('cke_button_off').removeClass('cke_button_on');
}
function quickTableOver(this_) {
    var rowThis = parseInt($(this_).attr('data-row'));
    var colThis = parseInt($(this_).attr('data-col'));
    var table = $(this_).closest('table');
        table.find('td').removeClass('td_hover');
    
    if ( rowThis >= 3 && parseInt(table.find('tr:last td:first').attr('data-row')) > rowThis+1 ) {
        table.find('tr:last').remove();
        table.attr('data-row', (parseInt(table.attr('data-row'))-1));
    }
    if ( colThis >= 3 && parseInt(table.find('tr:last td:last').attr('data-col')) > colThis+1 ) {
        table.find('tr :last-child').remove();
        table.attr('data-col', (parseInt(table.attr('data-col'))-1));
    }
    table.find('td').each(function(){
        var rowTd = parseInt($(this).attr('data-row'));
        var colTd = parseInt($(this).attr('data-col'));
        if ( rowTd <= rowThis && colTd <= colThis ) {
            $(this).addClass('td_hover');
        }
    });
    $(this_).closest('.divQuickTable').find('.quickTableInfo').html('Tabela '+(rowThis+1)+'x'+(colThis+1));
    
    if ( rowThis == parseInt(table.attr('data-row')) && rowThis < 49 ) { 
        var tableAppend = $(this_).closest('table');
        var rowLast = tableAppend.find('tr:last');
        var rowNew = rowLast.clone().appendTo(tableAppend);
            rowNew.find('td').each(function(index){
                $(this).attr('data-row', (rowThis+1)).attr('data-col', index).removeClass('td_hover');
            });
            tableAppend.attr('data-row', (rowThis+1));
    }
    if ( colThis == parseInt(table.attr('data-col')) && colThis < 49 ) {
        var tableAppend = $(this_).closest('table');
            tableAppend.find('tr :last-child').each(function(){
                var colNew = $(this).clone().attr('data-col', (colThis+1)).removeClass('td_hover');
                var colNew_ = $(this).parent().append(colNew);
            });
            tableAppend.attr('data-col', (colThis+1));
    }
}
function getQuickTable(this_) {
    var rowDefault = 5;
    var colDefault = 5;
    var divQuickTable = $(this_).closest('.cke_toolgroup').find('.divQuickTable');

    if ( $(this_).hasClass('cke_button_off') ) {
    var htmlTable = '<div class="quickTableInfo">Inserir Tabela</div>';
        htmlTable += '<table data-row="'+(rowDefault-1)+'" data-col="'+(colDefault-1)+'">';
        for (var i = 0; i < rowDefault; i++) {
            htmlTable += '<tr>';
            for (var j = 0; j < colDefault; j++) {
                htmlTable += '<td onmouseout="quickTableOver(this);" onmouseover="quickTableOver(this);" data-row="'+i+'" data-col="'+j+'" onclick="quickTableClick(this)"></td>';
            }
            htmlTable += '</tr>';
        }
        htmlTable += '</table>';
        divQuickTable.html(htmlTable).show();
        $(this_).removeClass('cke_button_off').addClass('cke_button_on');
    } else {
        hideQuickTable();
        $(this_).addClass('cke_button_off').removeClass('cke_button_on');
    }
}

function quickTableClick(this_) {
    setParamEditor(this_);
    var row = $(this_).attr('data-row');
    var col = $(this_).attr('data-col');
    var idFirstTD = 'quickTablePos_'+randomString(8);
    var htmlTable = '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';
        htmlTable += '  <tbody>';
        for (var i = 0; i <= row; i++) {
            htmlTable += '      <tr>';
            for (var j = 0; j <= col; j++) {
                var firstTD = ( i == 0 && j == 0 ) ? 'id="'+idFirstTD+'" ' : '';
                htmlTable += '          <td><p class="Tabela_Texto_Alinhado_Esquerda" '+firstTD+'><br></p></td>';
            }
            htmlTable += '      </tr>';
        }
        htmlTable += '  </tbody>';
        htmlTable += '</table>';
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        iframeEditor.find(pElement).after(htmlTable);
        hideQuickTable();
        $('#cke_'+idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
        
        // Move o cursor para a primeira celula da tabela
        var sel = oEditor.getSelection();
        var element_ = sel.getStartElement();
        var element = oEditor.document.getById(idFirstTD);
        var ranges = oEditor.getSelection().getRanges();
            ranges[0].setStart(element.getFirst(), 0);
            ranges[0].setEnd(element.getFirst(), 0);
            sel.selectRanges([ranges[0]]);
            iframeEditor.find('#'+idFirstTD).attr('id', '');
            oEditor.fire('saveSnapshot');
    }
}

//// Insere estilo clean a tabela selecionada do documento
function detectSyleSelectedTable() {
    var select = oEditor.getSelection().getStartElement();
    var tableElement = $(select.$).closest('table');
    return tableElement;
}
function activeIconsSelectedText() {
    if ( detectSyleSelectedTable().length > 0 ) {
        $('#cke_'+idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getTablestylesButtom').addClass('cke_button_disabled');
    }
    if (hasSelection(oEditor)) {
        $('#cke_'+idEditor).find('.getFontSizeUpButtom').removeClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getFontSizeDownButtom').removeClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getCapLetterButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getFontSizeUpButtom').addClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getFontSizeDownButtom').addClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getCapLetterButtom').addClass('cke_button_disabled');
    }
}
function getSyleSelectedTable(this_) {
    setParamEditor(this_);
    if ( detectSyleSelectedTable().length > 0 ) {
            oEditor.openDialog('TabelaSEI');
    } else {
        alert('Clique na tabela que deseja aplicar o estilo!');
    }
}
function changeColorTable(this_) {
	var id = $(this_).attr('data-colorid');
		$('#addEstiloTabela').attr('class', id);
}
function getDialogSyleTable() {
	var color = getColorID();
	var lenColor = Object.keys(getColorID()).length;
	var lenStyleTable = Object.keys(getStyleTable(getColorID().color1)).length;
    var htmlEstilo =   '<div style="padding-bottom: 10px;">Selecione a varia\u00E7\u00E3o de cores da tabela:</div>';
        htmlEstilo +=  '<div id="selectColorTabela" class="listaCoresTabela">';
         for (var i = 0; i < lenColor; i++) {
            var id = (i+1);
			var checked = ( i == 0 ) ? 'checked' : '';
            htmlEstilo +=  	'<span><label for="colorStyle'+id+'">'+
							'<a class="iconSelectColorTable" style="background-color: '+color['color'+id].light+'"></a>'+
							'<a class="iconSelectColorTable" style="background-color: '+color['color'+id].dark+'"></a>'+
							'</label><br><input type="radio" onchange="changeColorTable(this)" name="colorStyle" data-colorid="color'+id+'" id="colorStyle'+id+'" value="colorStyle'+id+'" '+checked+'></span>';
         }
        htmlEstilo +=  '</div>';
		htmlEstilo +=  '<div style="padding-bottom: 10px;">Selecione o estilo da tabela:</div>'+
                        '<div id="addEstiloTabela" class="color1">'+
                        '   <div class="listaEstiloTabela">';
         for (var i = 0; i < lenStyleTable; i++) {
            var id = (i+1);
			var checked = ( i == 0 ) ? 'checked' : '';
                htmlEstilo +=  ( i % 7 === 0 && i != 0 && i != (lenStyleTable-1) ) ? '</div><div class="listaEstiloTabela">' : '';
                htmlEstilo +=  '<span><label for="tableStyle'+id+'"><a class="iconSelectStyleTable" style="background-position-y: -'+(id*43)+'px"></a></label><br><input type="radio" name="tableStyle" id="tableStyle'+id+'" value="tableStyle'+id+'" '+checked+'></span>';
         }
         htmlEstilo +=  '</div></div>';
         htmlEstilo +=  '<div style="padding: 10px 0;">Selecione a largura da tabela: '+
                        '   <input type="number" id="addEstiloTableWidth" style="background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;" max="100" step="5" min="5"> %'+
                        '</div>';
         htmlEstilo +=  '<div style="padding: 10px 0;">'+
                        '   <input type="checkbox" id="addEstiloTableHeader" checked> <label for="addEstiloTableHeader">Determinar a primeira linha como cabe\u00E7alho da tabela</label>'+
                        '</div>';
    
    CKEDITOR.dialog.add( 'TabelaSEI', function ( editor )
      {
         return {
            title : 'Inserir estilo \u00E0 tabela',
            minWidth : 700,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var valueT = $('#addEstiloTabela').find('input[name="tableStyle"]:checked').val();
                var valueC = $('#selectColorTabela').find('input[name="colorStyle"]:checked').attr('data-colorid');
                var valueW = $('#addEstiloTableWidth').val();
                if ( valueT != '' && valueC != '' && valueW != '' ) { 
                    setSyleTable([valueT, valueC, valueW]);
                    event.data.hide = true;
                }
            },
            onShow : function() {
                var elementTable = detectSyleSelectedTable(); 
                // var percent = elementTable[0].style.width;
                var percent = Math.round(100 * parseFloat(elementTable.css('width')) / parseFloat(elementTable.parent().css('width')));
                var percentInput = (typeof percent != 'undefined') ? parseInt(percent) : 80;
                    percentInput = (percentInput > 100) ? 100 : percentInput;
                    percentInput = (percentInput < 5 ) ? 5 : percentInput;
                console.log(elementTable[0].style.width, percentInput);
                $('#addEstiloTableWidth').val(percentInput);
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Estilo da tabela',
                  elements :
                  [
                    {
             			type: 'html',
             			html: htmlEstilo
             		}
                  ]
               }
            ]
         };
      } );
}
function getSyleTable(this_) {
    setParamEditor(this_);
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        setSyleTable();
        oEditor.fire('saveSnapshot');
}
function setSyleTable(value) {

	var tableID = value[0];
	var colorID = value[1];
	var widthID = value[2];
	var color = getColorID()[colorID];
	var arrayStyle = getStyleTable(color, widthID)[tableID];
	
    var elementTable = detectSyleSelectedTable();
    elementTable.attr('style', arrayStyle.table);
    elementTable.find('tr').each(function(index_tr){ 
        var styleTr = ( index_tr == 0 ) ? arrayStyle.tr_head : arrayStyle.tr;
			styleTr = ( index_tr != 0 && $.isArray(arrayStyle.tr) && ( index_tr % 2 === 0 ) ) ? arrayStyle.tr[1] : styleTr;
			styleTr = ( index_tr != 0 && $.isArray(arrayStyle.tr) && ( index_tr % 2 !== 0 ) ) ? arrayStyle.tr[0] : styleTr;
		var styleTd = ( index_tr == 0 ) ? arrayStyle.td_head : arrayStyle.td;
        var classTdP = ( index_tr == 0 ) ? arrayStyle.td_head_p : arrayStyle.td_p;
			$(this).attr('style', styleTr);
			$(this).find('td').each(function(index_td){ 
				styleTd = ( index_td == 0 && index_tr != 0 ) ? arrayStyle.td_first : arrayStyle.td;
				styleTd = ( index_tr == 0 ) ? arrayStyle.td_head : styleTd;
				$(this).attr('style', styleTd);
				if ( $(this).find('p').length > 0 ) {
					$(this).find('p').attr('class', classTdP);
				} else {
					$(this).html('<p class="'+classTdP+'">'+$(this).html()+'</p>');
				}
			});
    });
    elementTable.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function(){
        setBgTableColor(this);
    });
    if ($('#addEstiloTableHeader').is(':checked')) {
        $('<thead></thead>').prependTo(elementTable).append(elementTable.find('tr:first'));
    }

}

//// INSERE LINK DE NORMAS
function sendLegisSEI(nomeLegis) {
	var url = "https://seipro.app/legis/";
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: { norma: [nomeLegis] },
		success: function(legisData){
            if (  legisData[0].status == 0 ) {
                alert('Nenhuma legisla\u00E7\u00E3o encontrada');
            } else {
                var nomeLegis = ( legisData.length > 0 && legisData[0].NomeNorma ) ? '&nbsp;('+legisData[0].NomeNorma+')' : '';
                var htmlLegis = ( legisData.length > 0 ) ? '<a class="ancoraSei legisSeiPro" data-norma="'+legisData[0].SiglaNorma+'" data-normafull="'+legisData[0].DescNormaFull+'" data-index="0" href="'+legisData[0].Link+'" target="_blank">'+legisData[0].DescNormaFull+nomeLegis.trim()+'</a>' : '';
                oEditor.focus();
                oEditor.fire('saveSnapshot');
                oEditor.insertHtml(htmlLegis);
                uniqLinkLegisSEI(idEditor);
                oEditor.fire('saveSnapshot');
            }
		}
	});
}
function insertLegisSEI(this_) {
    var htmlLegis = $('<div>').append($(this_).closest('p').find('.legisSeiPro').clone().removeAttr('style').removeClass('linkDialog')).html();
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.insertHtml(htmlLegis);
        uniqLinkLegisSEI();
        oEditor.fire('saveSnapshot');
        CKEDITOR.dialog.getCurrent().hide();
}
function uniqLinkLegisSEI() {
    var arrayRef = [];
        iframeEditor.find('.legisSeiPro').each(function(){ 
             var refNorma = $(this).attr('data-norma');
             if ( iframeEditor.find('a[data-norma="'+refNorma+'"]').length > 1 ) {
                var text = $(this).attr('data-normafull');
                var newText = text.split(',');
                var textDate = newText[1].trim().split(' ')[5];
                    newText = ( typeof textDate !== 'undefined' && arrayRef.includes(refNorma) ) ? newText[0].trim()+', de '+textDate : text;
                    $(this).text(newText);
             }
             arrayRef.push(refNorma);
        });
}
function getLegisSEI(this_) {
    setParamEditor(this_);
    oEditor.openDialog('LegisSEI');
}
function getSearchLegisMore(this_) {
    var parent = $(this_).closest('tr');
    if (!parent.find('.searchLegis_ementa').is(':hidden')) {
        parent.find('.searchLegis_ementa').hide();
        parent.find('.searchLegis_ementafull').show();
    } else {
        parent.find('.searchLegis_ementa').show();
        parent.find('.searchLegis_ementafull').hide();
    }
}
function getNatJusSEI(this_) {
    setParamEditor(this_);
    oEditor.openDialog('NatJusSEI');
}
function getSearchNatJus(this_) {
	var url = "https://seipro.app/enatjus/";
    var dialog_page = $(this_).closest('.cke_dialog_page_contents');
    var dialog = CKEDITOR.dialog.getCurrent();
    var inputTermo = dialog.getContentElement('tab1', 'buscaTexto').getValue();
    var buscaTexto = encodeURI(inputTermo.trim());
    $('#searchNatJus_load').show();
    if ($('#searchNatJus_result').is(':visible')) {
        dialog.move(dialog.getPosition().x, (dialog.getPosition().y+125));
        $('#searchNatJus_result').html('').hide();
    }
	$.ajax({
		type: "POST",
		url: url,
		// dataType: "json",
		data: { buscaTexto: buscaTexto },
		success: function(jusData){
            var style = '<style id="styleNatJus" type="text/css">'+
                        '   div#searchNatJus_result .result b a {'+
                        '       font-size: 14px !important;'+
                        '       color: #337ab7;'+
                        '       font-weight: bold;'+
                        '       padding: 5px 0;'+
                        '       display: inline-block;'+
                        '       cursor: pointer;'+
                        '   }'+
                        '   div#searchNatJus_result a {'+
                        '       cursor: pointer;'+
                        '       text-decoration: underline;'+
                        '       white-space: break-spaces;'+
                        '   }'+
                        '   div#searchNatJus_result .result div {'+
                        '       font-size: 9pt !important;'+
                        '       color: #393;'+
                        '       white-space: break-spaces;'+
                        '   }'+
                        '   div#searchNatJus_result .descricao {'+
                        '       padding-bottom: 15px;'+
                        '       border-bottom: 1px solid #ccc;'+
                        '   }'+
                        '   div#searchNatJus_result .descricao,'+
                        '   div#searchNatJus_result .descricao u,'+
                        '   div#searchNatJus_result .descricao b {'+
                        '       font-size: 10pt;'+
                        '       margin: 6px 0 15px 0;'+
                        '       white-space: break-spaces;'+
                        '       max-width: 520px;'+
                        '   }'+
                        '   div#searchNatJus_result .descricao u {'+
                        '       text-decoration: underline;'+
                        '   }'+
                        '   div#searchNatJus_result .descricao b {'+
                        '       font-weight: bold;'+
                        '   }'+
                        '</style>';

            // console.log(jusData);
            $('#searchNatJus_load').hide();
            $('#styleNatJus').remove();
            $('#searchNatJus_result').html(jusData).show().before(style);
            $('#searchNatJus_result p.descricao').each(function(){
                $(this).after('<div class="descricao">'+$(this).html()+'</div>').remove();
            });
            $('#searchNatJus_result a').each(function(){
                $(this).attr('href','https://www.cnj.jus.br/e-natjus/'+$(this).attr('href'));
            });
            $('#searchNatJus_result div.result').prepend('<span onclick="insertNatJusSEI(this)" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;">'+
                                                         '  <i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i>'+
                                                         '  Adicionar'+
                                                         '</span>');
            dialog.move(dialog.getPosition().x, (dialog.getPosition().y-125));
        }
	});
}
function insertNatJusSEI(this_) {
    var htmlNatJus = $('<div>').append($(this_).closest('.result').find('b a').clone()).html();
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.insertHtml(htmlNatJus);
        oEditor.fire('saveSnapshot');
        CKEDITOR.dialog.getCurrent().hide();
}
function getSearchLegis(this_) {
    var dialog_page = $(this_).closest('.cke_dialog_page_contents');
    var dialog = CKEDITOR.dialog.getCurrent();
    var inputTipo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoNorma')._.inputId;
        inputTipo = $('#'+inputTipo).find('option:selected').text();
    var inputTermo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'termoNorma').getValue();
    var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'numeroNorma').getValue();
    var inputAno = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'anoNorma').getValue();
	var url = "https://seipro.app/legis/search.php";
    var tipo = encodeURI(removeAcentos(inputTipo.toUpperCase().trim()));
    var termo = encodeURI(inputTermo.trim());
    var numero = ( inputNumero.indexOf('/') !== -1) ? inputNumero.split('/')[0] : inputNumero;
        numero = numero.replace(/[^0-9\-]+/g, '');
        numero = encodeURI(numero.trim());
    var ano = inputAno.replace(/[^0-9\-]+/g, '');
        ano = encodeURI(inputAno.trim());
    var periodo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'periodoNorma').getValue();

    
    $('#searchLegis_load').show();
    if ($('#searchLegis_result').is(':visible')) {
        dialog.move(dialog.getPosition().x, (dialog.getPosition().y+125));
        $('#searchLegis_result').html('').hide();
    }
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: { 
            tipo: tipo,
            numero: numero,
            ano: ano,
            periodo: periodo,
            termo: termo
        },
		success: function(legisData){
            if (  legisData.status == 0 ) {
                $('#searchLegis_load').hide();
                alert('Erro interno do servidor :( Tente novamente mais tarde');
            } else {
                var htmlResult =      '<table>'+
                                      ' <tbody>';

                    $.each(legisData.docs, function (i, val) {
                        var ementa = val.dsc_ementa.replace(/(\r\n|\n|\r)/gm, "");
                            ementa = (ementa.indexOf(' ') !== -1 && ementa.split(' ')[0] === ementa.split(' ')[0].toUpperCase()) ? ementa.charAt(0).toUpperCase() + ementa.toLocaleLowerCase().slice(1) : ementa;
                        var ementa_limited = ( ementa.length > 170 ) ? ementa.replace(/^(.{170}[^\s]*).*/, "$1")+'...' : ementa;
                        var datanorma = ( val.dsc_tipo_epigrafe == 'Decreto' ) ? 'Dec' : val.dsc_tipo_epigrafe;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Medida Provis\u00F3ria' ) ? 'Mp' : datanorma;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Lei Complementar' ) ? 'LC' : datanorma;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Decreto-Lei' ) ? 'DecLei' : datanorma;
                            datanorma = ( datanorma.indexOf(' ') !== -1) ? datanorma.split(' ').join('') : datanorma;
                            datanorma = datanorma+val.num_ato;
                        var nomenorma = (val.dsc_identificacao.indexOf(' de ') !== -1) ? val.dsc_identificacao.replace(' de ', ', de ') : val.dsc_identificacao;

                        var ementa_limited_link = ( ementa.length > 170 ) ? '<a class="linkDialog" onclick="getSearchLegisMore(this)">mais</a>' : '';
                        var style_normaRevogada = ( val.dsc_situacao_macro == "Revogado" ) ? 'text-decoration: line-through; color: #adadad;' : 'color: #444;';
                        var text_normaRevogada = ( val.dsc_situacao_macro == "Revogado" ) ? '<span style="background: #e0e0e0; padding: 1px 5px; color: #444; border-radius: 5px; margin-left: 10px;">Revogada</span>' : '';
                        var btnInsertLegis = '<span onclick="insertLegisSEI(this)" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;"><i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i> Adicionar</span>'
                        htmlResult += '     <tr style="border-bottom: 2px solid #efefef;">'+
                                      '         <td>'+
                                      '             <p style="padding: 10px 0 2px 0;">'+
                                      '                 <a class="linkDialog ancoraSei legisSeiPro" style="font-size: 13px;" data-norma="'+datanorma+'" data-normafull="'+nomenorma+'" data-index="0" href="'+val.url+'" target="_blank">'+nomenorma+' <i class="fas fa-external-link-alt linkDialog" style="font-size: 80%;"></i></a> '+text_normaRevogada+btnInsertLegis+
                                      '             </p>'+
                                      '             <p class="searchLegis_ementa" style="padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; '+style_normaRevogada+'">'+ementa_limited+' '+ementa_limited_link+'</p>'+
                                      '             <p class="searchLegis_ementafull" style="display:none; padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; '+style_normaRevogada+'">'+ementa+' <a class="linkDialog" onclick="getSearchLegisMore(this)">menos</a></p>'+
                                      '         </td>'+
                                      '     </tr>';
                    });
                    if (legisData.numFound > 50) {
                        htmlResult += '     <tr>'+
                                      '         <td>'+
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Atingido o limite de 50 resultados. Restrinja sua pesquisa.</p>'+
                                      '         </td>'+
                                      '     </tr>';
                    } else if (legisData.numFound == 0) {
                        htmlResult += '     <tr>'+
                                      '         <td>'+
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Nenhum resultado encontrado :(</p>'+
                                      '         </td>'+
                                      '     </tr>';
                    }
                    htmlResult +=     ' </tbody>'+
                                      '</table>';
                $('#searchLegis_load').hide();
                $('#searchLegis_result').html(htmlResult).show(); 
                    dialog.move(dialog.getPosition().x, (dialog.getPosition().y-125));
            }
		}
	});
}
function getDialogLegisSEI() {
      CKEDITOR.dialog.add( 'LegisSEI', function ( editor )
      {
         return {
            title : 'Adicionar Link de Legisla\u00E7\u00E3o',
            minWidth : 520,
            minHeight : 150,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var tipoNorma = this.getContentElement( 'tab1', 'tipoNorma' ).getValue();
                var numeroNorma = this.getContentElement( 'tab1', 'numeroNorma' ).getValue();
                var orgaoInfraNorma = this.getContentElement( 'tab2', 'orgaoInfraNorma' ).getValue();
                var tipoInfraNorma = this.getContentElement( 'tab2', 'tipoInfraNorma' ).getValue();
                var numeroInfraNorma = this.getContentElement( 'tab2', 'numeroInfraNorma' ).getValue();
                var nomeNorma = this.getContentElement( 'tab3', 'nomeNorma' ).getValue();
                
                if ( tipoNorma != '' && numeroNorma != '' ) {
                    var nrNorma = ( numeroNorma.indexOf('/') !== -1) ? numeroNorma.split('/')[0] : numeroNorma;
                        nrNorma = nrNorma.replace(/[^0-9\-]+/g, '');
                    sendLegisSEI(tipoNorma+nrNorma);
                    event.data.hide = true;
                } else if ( tipoInfraNorma != '' && numeroInfraNorma != '' ) {
                    var nrNorma = ( numeroInfraNorma.indexOf('/') !== -1) ? numeroInfraNorma.split('/')[0] : numeroInfraNorma;
                        nrNorma = nrNorma.replace(/[^0-9\-]+/g, '');
                    sendLegisSEI(orgaoInfraNorma+tipoInfraNorma+nrNorma);
                    event.data.hide = true;
                } else if ( nomeNorma != '' ) {
                    sendLegisSEI(nomeNorma);
                    event.data.hide = true;
                } else {
                    event.data.hide = true;
                }
            },
            onShow : function() {
                $('.cke_dialog_page_contents').find('select').css('width','100%');
                $('#searchLegis_load').hide();
                if ($('#searchLegis_result').is(':visible')) {
                    this.move(this.getPosition().x, (this.getPosition().y+125));
                    $('#searchLegis_result').html('').hide();
                }
                var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'numeroNorma')._.inputId;
                var inputAno = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'anoNorma')._.inputId;
                    $('#'+inputNumero).attr('type', 'number');
                    $('#'+inputAno).attr('type', 'number');
                    setChosenInCke();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Legisla\u00E7\u00E3o Federal',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'tipoNorma',
             			label: 'Tipo de Legisla\u00E7\u00E3o',
                        labelLayout: 'horizontal',
            			width: '200px',
             			items: [ [''], [ 'Lei', 'Lei' ], [ 'Lei Complementar', 'LC' ], [ 'Decreto', 'Dec' ], [ 'Decreto-Lei', 'DecLei' ], [ 'Medida Provis\u00F3ria', 'Mp' ] ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'N\u00FAmero da Legisla\u00E7\u00E3o',
                        id: 'numeroNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
             			type: 'select',
             			id: 'periodoNorma',
             			label: 'Per\u00EDodo da Publica\u00E7\u00E3o',
                        labelLayout: 'horizontal',
            			width: '200px',
             			items: [ [''], [ 'No ano', 'ano' ], [ 'At\u00E9 o ano de...', 'ate' ], [ 'Ap\u00F3s o ano de...', 'apos' ] ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'Ano da Publica\u00E7\u00E3o',
                        id: 'anoNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'text',
                        label: 'Conte\u00FAdo da Legisla\u00E7\u00E3o (palavras-chave)',
                        id: 'termoNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" onclick="getSearchLegis(this)" title="Pesquisar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="searchLegis_label" id="searchLegis_uiElement">'+
                              '                 <span id="searchLegis_label" class="cke_dialog_ui_button">Pesquisar</span>'+
                              '             </a>'+
                              '             <i id="searchLegis_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="searchLegis_result" style="display:none; height: 250px; overflow-y: scroll; margin-top: 15px;"></div>'
 					}
                  ]
               },{
                  id : 'tab2',
                  label : 'Norma Infralegal',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'orgaoInfraNorma',
             			label: 'Autoridade Signat\u00E1ria',
                        labelLayout: 'horizontal',
                        width: '200px',
             			items: [ [''], [ 'ANTAQ', 'Antaq' ], [ 'Cade', 'Cade' ], [ 'PRF', 'PRF' ] , [ 'TSE', 'Tse' ]  , [ 'TRE RR', 'Trerr' ] ],
             			'default': ''
             		},{
             			type: 'select',
             			id: 'tipoInfraNorma',
             			label: 'Tipo de Legisla\u00E7\u00E3o',
                        labelLayout: 'horizontal',
                        width: '200px',
             			items: [ [''], [ 'Resolu\u00E7\u00E3o Normativa', 'rn' ], [ 'Resolu\u00E7\u00E3o', 'res' ], [ 'Resolu\u00E7\u00E3o Conjunta', 'resconj' ], [ 'S\u00FAmula Administrativa', 'sum' ], [ 'Portaria', 'port' ], [ 'Portaria Conjunta', 'portconj' ], [ 'Portaria Interministerial', 'portinter' ], [ 'Instru\u00E7\u00E3o Normativa', 'in' ] , [ 'Provimento', 'prov' ] ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'N\u00FAmero da Norma',
            			width: '200px',
                        labelLayout: 'horizontal',
                        id: 'numeroInfraNorma'
 					}
                  ]
               },{
                  id : 'tab3',
                  label : 'Lista de Normas',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'nomeNorma',
             			label: 'Nome da Legisla\u00E7\u00E3o',
             			items: [ 
                                [''], 
                                ['C\u00F3digo Brasileiro de Aeron\u00E1utica','Cba'], 
                                ['C\u00F3digo Brasileiro de Telecomunica\u00E7\u00F5es','Cbt'], 
                                ['C\u00F3digo Civil','Cc'], 
                                ['C\u00F3digo Comercial','Ccm'], 
                                ['C\u00F3digo de Defesa do Consumidor','Cdc'], 
                                ['Constitui\u00E7\u00E3o Federal','Cf'], 
                                ['C\u00F3digo Florestal','Cflorestal'], 
                                ['Consolida\u00E7\u00E3o das Leis do Trabalho','Clt'], 
                                ['C\u00F3digo de \u00C1guas','Codigoaguas'], 
                                ['C\u00F3digo Eleitoral','Codigoeleitoral'], 
                                ['C\u00F3digo de Minas','Codigominas'], 
                                ['C\u00F3digo Penal','Cp'], 
                                ['C\u00F3digo de Processo Civil','Cpc'], 
                                ['C\u00F3digo Penal Militar','Cpm'], 
                                ['C\u00F3digo de Processo Penal','Cpp'], 
                                ['C\u00F3digo de Processo Penal Militar','Cppm'], 
                                ['C\u00F3digo de Tr\u00E2nsito Brasileiro','Ctb'], 
                                ['C\u00F3digo Tribut\u00E1rio Nacional','Ctn'], 
                                ['Estatuto da Crian\u00E7a e do Adolescente','Eca'], 
                                ['Estatuto da Cidade','Estatutocidade'], 
                                ['Estatuto do Desarmamento','Estatutodesarmamento'], 
                                ['Estatuto do Idoso','Estatutoidoso'], 
                                ['Estatuto da Igualdade Racial','Estatutoigualdaderacial'], 
                                ['Estatuto do \u00CDndio','Estatutoindio'], 
                                ['Estatuto da Juventude','Estatutojuventude'], 
                                ['Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte','Estatutomicroempresas'], 
                                ['Estatuto dos Militares','Estatutomilitares'], 
                                ['Estatuto dos Museus','Estatutomuseus'], 
                                ['Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)','Estatutooab'], 
                                ['Estatuto da Pessoa com Defici\u00EAncia','Estatutopcd'], 
                                ['Estatuto dos Refugiados','Estatutorefugiados'], 
                                ['Estatuto da Terra','Estatutoterra'], 
                                ['Estatuto de Defesa do Torcedor','Estatutotorcedor']
                                 ],
             			'default': ''
             		}
                  ]
               }

            ]
         };
      } );
}

function getDialogNatJusSEI() {
    CKEDITOR.dialog.add( 'NatJusSEI', function ( editor )
    {
       return {
          title : 'Pesquisa e-NatJus',
          minWidth : 520,
          minHeight : 150,
          buttons: [],
          onShow : function() {
              $('.cke_dialog_page_contents').find('select').css('width','100%');
              $('#searchNatJus_load').hide();
              if ($('#searchNatJus_result').is(':visible')) {
                  this.move(this.getPosition().x, (this.getPosition().y+125));
                  $('#searchNatJus_result').html('').hide();
              }
          },
          contents :
          [
             {
                id : 'tab1',
                label : 'Pesquisa P\u00FAblica',
                elements :
                [
                  {
                      type: 'text',
                      label: 'Conte\u00FAdo da Nota T\u00E9cnica (palavras-chave)',
                      id: 'buscaTexto',
                      width: '200px',
                      labelLayout: 'horizontal'
                   },{
                      type: 'html',
                      html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                            ' <tbody>'+
                            '     <tr class="cke_dialog_ui_hbox">'+
                            '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                            '         </td>'+
                            '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                            '             <a style="user-select: none;" onclick="getSearchNatJus(this)" title="Pesquisar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="searchNatJus_label" id="searchNatJus_uiElement">'+
                            '                 <span id="searchNatJus_label" class="cke_dialog_ui_button">Pesquisar</span>'+
                            '             </a>'+
                            '             <i id="searchNatJus_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>'+
                            '         </td>'+
                            '     </tr>'+
                            ' </tbody>'+
                            '</table>'+
                            '<div id="searchNatJus_result" style="display:none; height: 250px; overflow-y: scroll; margin-top: 15px;"></div>'
                   }
                ]
             },{
                id : 'tab2',
                label : 'Links \u00DAteis',
                elements :
                [
                  {
                       type: 'html',
                       html:    '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://brazil.cochrane.org/" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Cochrane.org</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://www.cochranelibrary.com/" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>CochraneLibrary.com/</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://www.gov.br/anvisa/pt-br/assuntos/medicamentos" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Anvisa: Medicamentos</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://consultas.anvisa.gov.br/#/medicamentos/" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Anvisa: Consulta Medicamentos</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="http://conitec.gov.br/index.php/protocolos-e-diretrizes" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Conitec: Protocolos e Diretrizes</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="http://conitec.gov.br/images/Rename-2020.pdf" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Conitec: Rename</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas-pcdt" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Minist\u00E9rio da Sa\u00FAde: Protocolos Cl\u00EDnicos e Diretrizes Terap\u00EAuticas - PCDT</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="https://cid10.com.br/" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Busca CID10</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="http://sigtap.datasus.gov.br/tabela-unificada/app/sec/inicio.jsp" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Tabela de Procedimentos, Medicamentos e OPM do SUS</a></div>'+
                                '<div><a style="margin: 6px; display: inline-block; font-size: 10pt;" href="http://bvsms.saude.gov.br/bvs/publicacoes/relacao_nacional_acoes_saude.pdf" target="blank" class="linkDialog"><i class="fas fa-link" style="cursor: pointer;color: blue; margin-right: 5px;"></i>Rela\u00E7\u00E3o Nacional de A\u00E7\u00F5es e Servi\u00E7os de Sa\u00FAde</a></div>'
                   }
                ]
             }

          ]
       };
    } );
}
function capitalizeFirstLetter(string) {
    var excetWords = ['a', 'à', 'algo', 'alguém', 'algum', 'alguma', 'algumas', 'alguns', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'às', 'cada', 'certa', 'certas', 'certo', 'certos', 'com', 'comigo', 'como', 'conosco', 'consigo', 'contigo', 'convosco', 'cuja', 'cujas', 'cujo', 'cujos', 'da', 'das', 'de', 'dessa', 'dessas', 'desse', 'desses', 'desta', 'destas', 'do', 'dos', 'dum', 'duma', 'dumas', 'duns', 'e', 'é', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'essa', 'essas', 'esse', 'esses', 'esta', 'estas', 'este', 'estes', 'eu', 'isso', 'isto', 'la', 'las', 'lhe', 'lhes', 'lo', 'los', 'me', 'mesma', 'mesmas', 'mesmo', 'mesmos', 'meu', 'meus', 'mim', 'minha', 'minhas', 'muita', 'muitas', 'muito', 'muitos', 'na', 'nada', 'não', 'nas', 'nenhum', 'nenhuma', 'nenhumas', 'nenhuns', 'ninguém', 'no', 'nos', 'nós', 'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'numas', 'nuns', 'o', 'onde', 'os', 'ou', 'outra', 'outras', 'outrem', 'outro', 'outros', 'para', 'pela', 'pelas', 'pelo', 'por', 'pouca', 'poucas', 'pouco', 'poucos', 'quais', 'quaisquer', 'qual', 'qualquer', 'quando', 'quanta', 'quantas', 'quanto', 'quantos', 'que', 'quem', 'são', 'se', 'seja', 'sem', 'seu', 'seus', 'si', 'sob', 'sobre', 'sua', 'suas', 'tanta', 'tantas', 'tanto', 'tantos', 'te', 'teu', 'teus', 'ti', 'toda', 'todas', 'todo', 'todos', 'tu', 'tua', 'tuas', 'tudo', 'um', 'uma', 'umas', 'uns', 'vária', 'várias', 'vário', 'vários', 'você', 'vocês', 'vos', 'vós', 'vossa', 'vossas', 'vosso', 'vossos']
    return ( string.indexOf(' ') === -1 ) ? string[0].toUpperCase() + string.substring(1).toLowerCase() : string.split(' ').map((s, index) => {
            if (excetWords.includes(s.toLowerCase()) && index != 0 ) {
                return s.toLowerCase()
            } else {
                return s[0].toUpperCase() + s.substring(1).toLowerCase()
            }
        }).join(' ') ;
}
function convertFirstLetter(this_) {
    setParamEditor(this_);
    var selectTxt = oEditor.getSelection().getSelectedText();
    if ( selectTxt != '' ) {
        var text = capitalizeFirstLetter(selectTxt);
        oEditor.insertHtml(text);
    } else {
        alert('Selecione um texto para convers\u00E3o');
    }
}

function getCitacaoDocumento(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof dadosProcessoPro.listDocumentos !== 'undefined') { 
        setParamEditor(this_);
        oEditor.openDialog('CitaSEI');
    } else {
        setTimeout(function(){ 
            getCitacaoDocumento(this_, TimeOut - 100); 
            $(this_).fadeOut(200).fadeIn(200);
            console.log('Reload getCitacaoDocumento'); 
        }, 500);
    }
}
function getDialogCitacaoDocumento() {
    var listDocumentos = [['']];
     $.each(dadosProcessoPro.listDocumentos, function (index, value) {
         var select_value = value.id_protocolo;
         var select_text = ( value.nr_sei != '' ) ? value.documento+' ('+value.nr_sei+')' : value.documento;
         if ( value.documento != '' ) { listDocumentos.push([select_text, select_value]) }
     });

      CKEDITOR.dialog.add( 'CitaSEI', function ( editor )
      {
         return {
            title : 'Inserir refer\u00EAncia de documento do processo',
            minWidth : 500,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onShow: function() {
                setChosenInCke();
            },
            onOk: function(event, a, b) {
                var id_protocolo = this.getContentElement( 'tab1', 'listDocumento' ).getValue();
                if ( id_protocolo != '' ) {
                    insertCitacaoDocumento(id_protocolo);
                    event.data.hide = true;
                }
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Refer\u00EAncia de documento do processo',
                  elements :
                  [
                    {
                        type: 'select',
                        id: 'listDocumento',
                        label: 'Documento do Processo',
                        items: listDocumentos,
                        'default': ''
                    }
                  ]
               }
            ]
         };
      } );
}
function insertCitacaoDocumento(id_protocolo) {
    var dataValue = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+id_protocolo+"'] | [0]");
    if ( typeof dataValue !== 'undefined' && dataValue.documento ) {
        var nrSei = ( dataValue.nr_sei != '' ) ? dataValue.nr_sei : dataValue.documento;
        var citacaoDoc = getCitacaoDoc();
        var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+dataValue.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
        var citacaoDocumento = ( dataValue.nr_sei != '' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? dataValue.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.insertHtml(citacaoDocumento);
        oEditor.fire('saveSnapshot');
    }
}

// INSERE NOTAS DE RODAPE
function getNotaRodape(this_) {
    setParamEditor(this_);
    oEditor.openDialog('NtRodapeSEI');
}
function getDialogNotaRodape() {
      CKEDITOR.dialog.add( 'NtRodapeSEI', function ( editor )
      {
         return {
            title : 'Inserir nota de rodap\u00E9',
            minWidth : 500,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var txt_NotaRodapeLivre = this.getContentElement( 'tab_nr', 'textNotaRodape' ).getValue();
                var txt_NotaRodapeABNT = $('#nrABNTResult').html();
				var txt_NotaRodape = ( txt_NotaRodapeABNT != '' ) ? txt_NotaRodapeABNT : txt_NotaRodapeLivre;
                if ( txt_NotaRodape != '' ) {
                    insertNtRodape(txt_NotaRodape);
                    event.data.hide = true;
                }
            },
            onShow : function() {
				var nr_IDInput = this.getContentElement( 'tab_abnt', 'nr_Nome' )._.inputId;
				var nr_Data = this.getContentElement( 'tab_abnt', 'nr_Data' )._.inputId;
				var nr_Data = this.getContentElement( 'tab_abnt', 'nr_Data' )._.inputId;
				var nr_Volume = this.getContentElement( 'tab_abnt', 'nr_Volume' )._.inputId;
				var nr_Ano = this.getContentElement( 'tab_abnt', 'nr_Ano' )._.inputId;
				var nr_Edicao = this.getContentElement( 'tab_abnt', 'nr_Edicao' )._.inputId;
					$('#nrABNTResult').hide().html('');
					$('#'+nr_Data).attr('type', 'date');
					$('#'+nr_Volume).attr('type', 'number');
					$('#'+nr_Ano).attr('type', 'number');
					$('#'+nr_Edicao).attr('type', 'number');
				setTimeout(function(){ 
					$('#'+nr_IDInput).closest('.cke_dialog_page_contents').find('input, textarea, select').on('input change', function() {
						updateNrABNT($(this));
					});
				}, 100);
            },
            contents :
            [
               {
                  id : 'tab_nr',
                  label : 'Texto livre',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'textNotaRodape',
             			label: 'Texto da nota de rodap\u00E9',
             			'default': ''
             		}
                  ]
               },{
                  id : 'tab_abnt',
                  label : 'Padr\u00E3o ABNT',
                  elements :
                  [
					{
						type: 'hbox',
						widths: [ '50%', '50%' ],
						children: [
							{
								type: 'text',
								id: 'nr_Nome',
								label: 'Nome do autor',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Sobrenome',
								label: 'Sobrenome do Autor',
								'default': ''
							}
						]
					},{
						type: 'hbox',
						widths: [ '75%', '25%' ],
						children: [
							{
								type: 'text',
								id: 'nr_Titulo',
								label: 'T\u00EDtulo da publica\u00E7\u00E3o',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Edicao',
								label: 'N\u00FAmero da Edi\u00E7\u00E3o',
								'default': ''
							}
						]
					},{
						type: 'hbox',
						widths: [ '50%', '50%'],
						children: [
							{
								type: 'text',
								id: 'nr_Local',
								label: 'Local de publica\u00E7\u00E3o (cidade)',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Editora',
								label: 'Nome da Editora',
								'default': ''
							}
						]
					},{
						type: 'hbox',
						widths: [ '25%', '25%', '25%', '25%' ],
						children: [
							{
								type: 'text',
								id: 'nr_Ano',
								label: 'Ano da publica\u00E7\u00E3o',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Volume',
								label: 'N\u00FAmero do Volume',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Paginas',
								label: 'P\u00E1ginas inicial-final',
								'default': ''
							}
						]
					},{
						type: 'hbox',
						widths: [ '75%', '25%'],
						children: [
							{
								type: 'text',
								id: 'nr_Link',
								label: 'Link da publica\u00E7\u00E3o',
								'default': ''
							},{
								type: 'text',
								id: 'nr_Data',
								label: 'Data do acesso',
								'default': ''
							}
						]
					},{
						type: 'html',
						html: '<div id="nrABNTResult" style="padding: 5px 5px 8px 5px; background: #f9f9dc; border-radius: 5px; white-space: break-spaces;"></div>'
					}
                  ]
               }
            ]
         };
      } );
}
function updateNrABNT(this_) {
    setMomentPtBr();
	var input = this_.closest('.cke_dialog_page_contents').find('input, textarea, select');
	var nr_Nome = input.eq(0).val();
		nr_Nome = ( nr_Nome != '' ) ? ', '+capitalizeFirstLetter(nr_Nome.trim()) : nr_Nome;
	var nr_Sobrenome = input.eq(1).val();
		nr_Sobrenome = ( nr_Sobrenome != '' ) ? nr_Sobrenome.toUpperCase() : nr_Sobrenome;
	var nr_Titulo = input.eq(2).val();
		nr_Titulo = ( nr_Titulo != '' ) ? '. <strong>'+capitalizeFirstLetter(nr_Titulo.trim())+'</strong>' : nr_Titulo;
	var nr_Edicao = input.eq(3).val();
		nr_Edicao = ( nr_Edicao != '' ) ? '. '+nr_Edicao+'. ed.' : nr_Edicao;
	var nr_Local = input.eq(4).val();
		nr_Local = ( nr_Local != '' ) ? ', '+capitalizeFirstLetter(nr_Local.trim()) : nr_Local;
	var nr_Editora = input.eq(5).val();
		nr_Editora = ( nr_Editora != '' ) ? ': '+capitalizeFirstLetter(nr_Editora.trim()) : nr_Editora;
	var nr_Ano = input.eq(6).val();
		nr_Ano = ( nr_Ano != '' ) ? ', '+nr_Ano : nr_Ano;
	var nr_Volume = input.eq(7).val();
		nr_Volume = ( nr_Volume != '' ) ? ', v. '+nr_Volume : nr_Volume;
	var nr_Paginas = input.eq(8).val();
		nr_Paginas = ( nr_Paginas != '' ) ? '. p.'+nr_Paginas : nr_Paginas;
	var nr_Link = input.eq(9).val();
		nr_Link = ( nr_Link != '' && isValidHttpUrl(nr_Link) ) ? '. Dispon\u00EDvel em: <a href="'+nr_Link+'" target="_blank">&lt;'+nr_Link+'&gt;</a>' : '';
	var nr_Data = input.eq(10).val();
		nr_Data = ( nr_Data != '' ) ? '. Acesso em: '+moment(nr_Data).format('ll') : nr_Data;
	
	var htmlResult = nr_Sobrenome+nr_Nome+nr_Titulo+nr_Edicao+nr_Local+nr_Editora+nr_Ano+nr_Volume+nr_Paginas+nr_Link+nr_Data;
	if ( htmlResult != '' ) {
		$('#nrABNTResult').show().html(htmlResult+'.');
	}
}
function insertNtRodape(txt_NotaRodape) {
    var randRef = randomString(16);
    var ntRodapeId = parseInt(iframeEditor.find('.ntRodape_item').length)+1;
    var ntRodapeHtml_footer = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_'+randRef+'" href="#item_'+randRef+'"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="'+randRef+'" data-ntrodape="'+ntRodapeId+'"  contenteditable="false">['+ntRodapeId+']</span></a> '+txt_NotaRodape+'</p>';
    var ntRodapeHtml_item = '<sup><a href="#footer_'+randRef+'" name="item_'+randRef+'"><span class="ntRodape_item ancoraSei" data-ntrodape="'+ntRodapeId+'" data-ntrodape-ref="'+randRef+'" contenteditable="false">['+ntRodapeId+']</span></a></sup> ';
    
    oEditor.focus();
    oEditor.fire('saveSnapshot');
    if ( iframeEditor.find('.ntRodape_tr').length == 0 ) {
        iframeEditor.find('body').append('<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>');
    }
    iframeEditor.find('body').append(ntRodapeHtml_footer);
    oEditor.insertHtml(ntRodapeHtml_item);
    reorderNtRodape(iframeEditor);
    oEditor.fire('saveSnapshot');
}
function reorderNtRodape(iframeEditor) {
    iframeEditor.find('.ntRodape_item').each(function(index){
        var dataRef = $(this).attr('data-ntrodape-ref');
        var ntRodapeId = index+1;
        $(this).attr('data-ntrodape', ntRodapeId).text('['+ntRodapeId+']');
        iframeEditor.find('.ntRodape_footer[data-ntrodape-ref='+dataRef+']').attr('data-ntrodape', ntRodapeId).text('['+ntRodapeId+']');
    });
    
    var arrayFooters = [];
    iframeEditor.find('.ntRodape_footer').each(function(index){
        var dataRef = $(this).attr('data-ntrodape-ref');
        var ntRodapeId = parseInt($(this).attr('data-ntrodape'));
        var htmlFooter = $(this).closest('p')[0].outerHTML;
        if ( iframeEditor.find('.ntRodape_item[data-ntrodape-ref='+dataRef+']').length > 0 ) {
            arrayFooters.push({id:ntRodapeId, html: htmlFooter});
        }
        $(this).closest('p').remove();
    });

    arrayFooters.sort(function(a,b){ return a.id - b.id;});

    $.each(arrayFooters, function (index, value) {
        iframeEditor.find('body').append(value.html);
    });
}
function initAddButtonTarjaSigilo(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if ($('.getMarkSigiloButton').length > 0) { 
        addButtonTarjaSigilo()
    } else {
        setTimeout(function(){ 
            initAddButtonTarjaSigilo(TimeOut - 100); 
            console.log('Reload initAddButtonTarjaSigilo'); 
        }, 500);
    }
}
function addButtonTarjaSigilo() {
    var icon16baseTarjaSigilo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAeBQTFRFAAAApaWlo6OjoKCgnZ2dmpqal5eXlJSUkJCQpKSkoqKivLy8ysrKzMzMwsLCra2tjIyMiYmJpKSkoaGhxMTEvr6+oaGhlpaWk5OTl5eXrq6uhISEgYGBoaGhurq6v7+/mJiYlJSUkZGRjo6OioqKh4eHqKios6R72KVX27GF0J1G0ZUrnZ2dk5OTgoKCqZlk6L538NK0//Pl79Ksx4xJmZmZxsbGlJSUj4+P3bIm69N++eOy58CL9tOu/ODE059m4cNhqKCIkZGRjo6O3Lla37hV3rVR3bFN3rA/7tR8/fbE9t1s7cpt16Nj0ptdyZJP4cJg/PPJ/fPL/vbU//bX//TY//jg9eOp7tN5/ffH9dxf9+Jb8tZ63pg+zI1C4L9c/PPI+d91/eaJ/+eV/+Wa5sp56Mt39dxe9+Fa8dR73plI1o0o37tY/PHH+dxv7btW771h5sZx1rhy/fbC999j+OJd8NN525dD9dyo1Ige3rdT/PDG+Nlq/eJ82bdj1bZ60beQ5MlV9d9b7dB43JdB7bpE+ee204MY3bJO++/D+NZl7LZMqolD//Lg2JpUvnoaxZhJxYU23psz775C+eW00n4TAAAAhWcs+ceU+cmRyYVBQigMWkETiWEps4FFMicSJ8ijcQAAAKB0Uk5TAAyBuszMuoEMMN7//////94wDNv/////////2wl1///dHwUFH+X//////5muKSn///////3D//8IZP///////////////////////////TL//////////////////zf//////////////////////////////////////////////////////////////////////////////////////41iaEMAAADYSURBVHicY2BgYGBkYmZhZWPnYIACTi5uHl4ePn4BQQhfSFhEVExcQlJKSloGLCArJ6+gqKSsoqqmrqGppc3AoCMipguS0NM3MDQyNmFgMDUztwAJWFpZ29ja2TM4ODo5u7i6uXt4enn7+Pr5MwQEBgWHhIaFR0RGRcfExjEwxCckJiWnpKZFpmdkZmUDtebk5uUXFBYVl5SWlVdUAgWqqmtq6+obGpuaW1rb2oECHZ1d3T29ff0TJk6aPGUqUGAaEEyfMXPW7GkQABaYM3fe/GnIAsgAQwAAnahR/kU9cZYAAAAASUVORK5CYII=';
    var htmlButtonAfterLetters =    '   <a class="getTarjaSigiloButton cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar tarja de sigilo no texto" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseTarjaSigilo+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Adicionar tarja de sigilo no texto</span>'+
                                    '   </a>';
        $(txaEditor).each(function(index){ 
            var idEditor = $(this).attr('id').replace('cke_', '');
            if ( $('iframe[title*="'+idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                $(this).find('span.cke_toolgroup .getMarkSigiloButton').after(htmlButtonAfterLetters);
            }
        });
        $('.getTarjaSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getTarjaSigilo(this) } });
}
function setDocCertidao() {
    var dadosDocCertidao = sessionStorageRestorePro('dadosDocCertidao');
    var nomeDocCertidao = sessionStorageRestorePro('nomeDocCertidao');
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_certidao' && dadosDocCertidao && nomeDocCertidao) {
        setCKEDITOR_instances();
        initAddButtonTarjaSigilo();
        var modeloHtml =    '<p class="Texto_Centralizado_Maiusculas_Negrito">CERTID\u00C3O</p>'+
                            '<p class="Texto_Centralizado_Maiusculas_Negrito">C\u00D3PIA DE DOCUMENTO OFICIAL COM RESTRI\u00C7\u00C3O LEGAL DE PARTE(S) SOB SIGILO<br><br></p>'+
                            '<p class="Texto_Alinhado_Esquerda">Em observ\u00E2ncia \u00E0 <a class="ancoraSei legisSeiPro" data-norma="Lei12527" data-normafull="Lei n\u00BA 12.527, de 18 de novembro de 2011" data-index="0" data-cke-saved-href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" target="_blank" data-reflinkpro="HdNxK8xI">Lei n\u00BA 12.527, de 18 de novembro de 2011</a>, que estabelece, em seu artigo 7\u00BA, \u00A72\u00BA, que:</p>'+
                            '<p class="Citacao">Art. 7\u00BA O acesso \u00E0 informa\u00E7\u00E3o de que trata esta Lei compreende, entre outros, os direitos de obter:<br></p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Citacao">\u00A72\u00BA Quando n\u00E3o for autorizado acesso integral \u00E0 informa\u00E7\u00E3o, por ser ela parcialmente sigilosa, \u00E9 assegurado o acesso \u00E0 parte n\u00E3o sigilosa por meio de certid\u00E3o, extrato ou c\u00F3pia com oculta\u00E7\u00E3o da parte sob sigilo.</p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Texto_Alinhado_Esquerda">Como servidor(a) p\u00FAblico(a) em exerc\u00EDcio, aponho minha assinatura e confiro f\u00E9 p\u00FAblica ao documento abaixo, confirmando que esta vers\u00E3o se trata de c\u00F3pia fiel da documenta\u00E7\u00E3o original, havendo sido ocultadas (tarjadas) exclusivamente as informa\u00E7\u00F5es protegidas por sigilo legal, assegurando a fidelidade da informa\u00E7\u00E3o p\u00FAblica. Assim, esta vers\u00E3o passa a coexistir com o documento integral criado com o amparo da citada Lei.</p>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>'+
                            '<table border="0" cellspacing="1" cellpadding="1" style="border-collapse:collapse;border-color: rgb(206 206 206);margin-left:auto;margin-right:auto;width:100%;">'+
                            '   <tbody>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado" id="">In\u00EDcio do(a) '+nomeDocCertidao+'</p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td contenteditable="false">'+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '               '+dadosDocCertidao+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado">Fim do(a) '+nomeDocCertidao+'<br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '   </tbody>'+
                            '</table>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>';
                            
            var elemIframe = $('iframe').filter(function(){ return $(this).contents().find('body').attr('contenteditable') == 'true' }).eq(0)
            if (elemIframe.length > 0) {
                var iframe = elemIframe.contents();
                if (elemIframe.attr('title').indexOf(',') !== -1) {
                    var idEditor = elemIframe.attr('title').split(',')[1].trim();
                    $('#idEditor').val(idEditor);
                    oEditor = CKEDITOR.instances[idEditor];
                    if (typeof oEditor !== 'undefined') {
                        oEditor.focus();
                        oEditor.fire('saveSnapshot');
                        iframe.find('body').html(modeloHtml);
                        actionsMarkSigilo(undefined, 'apply');
                        enableButtonSavePro();
                        
                        var $form = oEditor.element.$.form;
                        if ($form) $form.submit();

                        sessionStorageRemovePro('dadosDocCertidao');
                        sessionStorageRemovePro('nomeDocCertidao');
                    }
                }
            }
        /*
        var maxIframeHeight = {value: 0, index: -1}
        $('iframe.cke_wysiwyg_frame').each(function(index){
            if ( $(this).contents().find('body').attr('contenteditable') == 'true' ) {
                var height = $(this).height();
                if (height > maxIframeHeight.value) { 
                    maxIframeHeight = {value: height, index: index};
                }
            }
        });
        if (maxIframeHeight.index != -1) {
            var elemIframe = $('iframe').eq(maxIframeHeight.index);
            var iframe = elemIframe.contents();
            if (elemIframe.attr('title').indexOf(',') !== -1) {
                var idEditor = elemIframe.attr('title').split(',')[1].trim();
                $('#idEditor').val(idEditor);
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    iframe.find('body').html(modeloHtml);
                    actionsMarkSigilo(undefined, 'apply');
                    enableButtonSavePro();
                    
                    var $form = oEditor.element.$.form;
                    if ($form) $form.submit();

                    sessionStorageRemovePro('dadosDocCertidao');
                    sessionStorageRemovePro('nomeDocCertidao');
                }
            }
        }
        */
    }
}
// SUBSTITUI CAMPOS PERSONALIZADOS
function sumTagValue(value) {
    var return_ = value;
    var prop = dadosProcessoPro.propProcesso;
    var docs = dadosProcessoPro.listDocumentos;
    var i = parseInt(value.replace(/[^0-9\.]+/g, ''));
        i = (value.indexOf('-') !== -1) ? (i*-1) : i;
        i = i-1;

    if (value.indexOf('hoje') !== -1) {
        return_ = '<span class="ancoraSei dynamicField">'+moment().add(i+1, 'd').format('LL')+'</span>';
    } else if (value.indexOf('assunto') !== -1) {
        var index = ((i+1) > prop.selAssuntos_select.length) ? (prop.selAssuntos_select.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.selAssuntos_select[index]+'</span>';
    } else if (value.indexOf('interessado') !== -1) {
        var index = ((i+1) > prop.selInteressadosProcedimento.length) ? (prop.selInteressadosProcedimento.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.selInteressadosProcedimento[index]+'</span>';
    } else if (value.indexOf('observacao') !== -1) {
        var index = ((i+1) > prop.txaObservacoes.length) ? (prop.txaObservacoes.length-1) : i;
        return_ = '<span class="ancoraSei dynamicField">'+prop.txaObservacoes[index].unidade+': '+prop.txaObservacoes[index].observacao+'</span>';
    } else if (value.indexOf('documento') !== -1) {
        var docValue = '';
        if (value.indexOf('+') !== -1 || value.indexOf('-') !== -1) {
            var indexDoc = 0;
            $.each(docs, function(i, v) { 
                if (v.id_protocolo == getParamsUrlPro(window.location.href).id_documento) { 
                    return indexDoc; 
                } indexDoc++; 
            });
            var iDoc = indexDoc+(i+1);
                iDoc = (docs.length <= iDoc) ? (docs.length-1) : iDoc;
                iDoc = (value.indexOf('-') !== -1 && value.split('-')[1] == 'ultimo') ? (docs.length-1) : iDoc;
            docValue = getHtmlListDocumentos(docs[iDoc]);
        } else if (hasNumber(value)) {
            docValue = getHtmlListDocumentos(docs[i]);
        }
        return_ = '<span class="ancoraSei dynamicField">'+docValue+'</span>';
    }
    return return_;
}
function getHtmlListDocumentos(value) {
    if (typeof value !== 'undefined') { 
        var nrSei = ( value.nr_sei != '' ) ? value.nr_sei : value.documento;
        var citacaoDoc = getCitacaoDoc();
        var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+value.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
        return ( value.nr_sei != '' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? value.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
    } else { return '' }
}
function replaceDadosEditor(this_) {
    var arrayTags = uniqPro(getHashTagsPro(iframeEditor.find('p').map(function(){ return $(this).text().replace(/\u00A0/gm, " ") }).get().join(' ')));
    var delimitLine = false;
    var prop = dadosProcessoPro.propProcesso;
    var docs = dadosProcessoPro.listDocumentos;

    var tagField = iframeEditor.find('body').find('span.hashField');
    if (tagField.length > 0) { tagField.after(tagField.html()).remove() }

    var processo = (typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
        processo = (typeof processo !== 'undefined') ? '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+prop.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+processo+'</a></span>' : null;
        processo = (processo !== null && $.inArray('processo_texto', arrayTags) !== -1) ? '<span class="ancoraSei dynamicField">'+(prop.hdnProtocoloFormatado || prop.txtProtocoloExibir)+'</span>' : processo;
    var autuacao = (typeof prop.txtDtaGeracaoExibir === 'undefined') ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
        autuacao = (typeof autuacao !== 'undefined') ? '<span class="ancoraSei dynamicField">'+autuacao+'</span>' : null;
    var tipo = (typeof prop.hdnNomeTipoProcedimento !== 'undefined') ? '<span class="ancoraSei dynamicField">'+prop.hdnNomeTipoProcedimento+'</span>' : null;
    var especificacao = (typeof prop.txtDescricao !== 'undefined') ? '<span class="ancoraSei dynamicField">'+prop.txtDescricao+'</span>' : null;
    var hoje = '<span class="ancoraSei dynamicField">'+moment().format('LL')+'</span>';
    var interessados = (typeof prop.selInteressadosProcedimento !== 'undefined') 
                            ? ($.inArray('interessados_lista', arrayTags) !== -1) 
                                    ? $.map(prop.selInteressadosProcedimento, function(substr, i){ return '<span class="ancoraSei dynamicField">'+substr+'</span><br>' }).join('')
                                    : '<span class="ancoraSei dynamicField">'+joinAnd(prop.selInteressadosProcedimento)+'</span>' 
                            : null;
    var assuntos = (typeof prop.selAssuntos_select !== 'undefined') 
                            ? ($.inArray('assuntos_lista', arrayTags) !== -1) 
                                    ? $.map(prop.selAssuntos_select, function(substr, i){ return '<span class="ancoraSei dynamicField">'+substr+'</span><br>' }).join('')
                                    : '<span class="ancoraSei dynamicField">'+joinAnd(prop.selAssuntos_select)+'</span>' 
                            : null;
    
    var unidadeObs = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+unidade+"'] | [0]");
    var observacao = (typeof prop.txaObservacoes !== 'undefined' && prop.txaObservacoes.length > 0 && unidadeObs !== null && unidadeObs.observacao != '')
                        ? '<span class="ancoraSei dynamicField">'+unidadeObs.unidade+': '+unidadeObs.observacao+'</span>' : null;

    var observacoes = (typeof prop.txaObservacoes !== 'undefined' && prop.txaObservacoes.length > 0) 
                        ? ($.inArray('observacoes_lista', arrayTags) !== -1) 
                            ? $.map(prop.txaObservacoes, function(value, i){
                                  return value.unidade+': '+value.observacao+'<br>';
                              }).join('')
                            : joinAnd($.map(prop.txaObservacoes, function(value, i){
                                  return value.unidade+': '+value.observacao;
                              }))
                        : null;
        observacoes = (observacoes !== null) ? '<span class="ancoraSei dynamicField">'+observacoes+'</span>' : observacoes;
    var acesso = (typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == 0) ? '<span class="ancoraSei dynamicField">&#127760;&nbsp; <span>P\u00FAblico</span></span>' : null;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 1) ? '<span class="ancoraSei dynamicField">&#128274;&nbsp; <span>Restrito</span></span>' : acesso;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 2) ? '<span class="ancoraSei dynamicField">&#9940;&nbsp; <span>Sigiloso</span></span>' : acesso;
        acesso = (acesso !== null && $.inArray('acesso_texto', arrayTags) !== -1) ? $(acesso).find('span').text() : acesso;
    var documentos = (typeof docs !== 'undefined') 
                            ? ($.inArray('documentos_lista', arrayTags) !== -1) 
                                    ? $.map(docs, function(value, i){
                                            return getHtmlListDocumentos(value)+'<br>';
                                      }).join('')
                                    : joinAnd($.map(docs, function(value, i){
                                            return getHtmlListDocumentos(value);
                                      }))
                            : null;
        documentos = (documentos !== null) ? '<span class="ancoraSei dynamicField">'+documentos+'</span>' : documentos;
    var totaldocumentos = (typeof docs !== 'undefined' && docs !== null && $.inArray('totaldocumentos', arrayTags) !== -1) ? '<span class="ancoraSei dynamicField">'+docs.length+'</span>' : null;

    var dadosProcesso = {processo: processo, autuacao: autuacao, tipo: tipo, especificacao: especificacao, hoje: hoje, interessados: interessados, assuntos: assuntos, acesso: acesso, documentos: documentos, totaldocumentos: totaldocumentos, observacoes: observacoes, observacao: observacao};
    var dadosTags = [];
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade != unidade) {
                $.each(valueTag.tags, function (i, v) {
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade == unidade) {
                $.each(valueTag.tags, function (i, v) {
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });
    
    var count = 0;
    oEditor.focus();
    oEditor.fire('saveSnapshot');
    $.each(arrayTags, function (i, value) {
        var _value = value;
        var underline = (value.indexOf('_') !== -1 && $.inArray(_value, dadosTags) === -1) ? '_'+value.split('_')[1] : '';
            value = (value.indexOf('_') !== -1) ? value.split('_')[0] : value;
            value = ($.inArray(_value, dadosTags) !== -1) ? _value : value;
        var hashTag = (value.indexOf('+') !== -1) ? '#'+(value.replace('+', '\\+')) : '#'+value;
        var hashSpan = '<span class="ancoraSei hashField" data-hash="'+value+'">#'+value+'</span>';
        var fieldSpan = (typeof dadosProcesso[value] !== 'undefined' && dadosProcesso[value] !== null) ? dadosProcesso[value] : hashSpan;
            fieldSpan = (value.indexOf('+') !== -1 || value.indexOf('-') !== -1 || (hasNumber(value) && $.inArray(_value, dadosTags) === -1) ) ? sumTagValue(value): fieldSpan;
            fieldSpan = fieldSpan+'&nbsp;';
            iframeEditor.find('p').each(function(){
                $(this).html($(this).html().replace(new RegExp(hashTag+underline, "i"), function(){ count++; return fieldSpan }));
            });
        console.log(arrayTags, value, hashTag, fieldSpan);
    });
    oEditor.fire('saveSnapshot');
    var count_error = iframeEditor.find('.hashField').length;
        count_error = (count_error == 0) ? '' : '  <i class="fas fa-exclamation-triangle laranjaColor"></i> '+count_error+' '+(count_error==1 ? 'campo din\u00E2mico n\u00E3o substitu\u00EDdo' : 'campos n\u00E3o din\u00E2micos substitu\u00EDdos')+'.';
    var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                    '  <i class="fas fa-check-circle verdeColor"></i> '+count+' '+(count==1 ? 'campo din\u00E2mico substitu\u00EDdo' : 'campos din\u00E2micos substitu\u00EDdos')+' com sucesso!<br>'+count_error+
                    '</label>';
    $('#tabReplaceTag_result').show().html(resultDiv);
}
function arrayDadosEditor() {
        setMomentPtBr();
    var listaDadosEditor = [['']];
    var prop = dadosProcessoPro.propProcesso;
    var processo = (typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
    var dataGeracao = (typeof prop.txtDtaGeracaoExibir === 'undefined') ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
    var htmlProcesso = '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+prop.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+processo+'</a></span>';
        listaDadosEditor.push(['Processo: '+processo,htmlProcesso]);
        listaDadosEditor.push(['Data de Autua\u00E7\u00E3o: '+dataGeracao,dataGeracao]);
        listaDadosEditor.push(['Tipo: '+prop.hdnNomeTipoProcedimento,prop.hdnNomeTipoProcedimento]);
        listaDadosEditor.push(['Especifica\u00E7\u00E3o: '+prop.txtDescricao,prop.txtDescricao]);
    
    var acesso = (typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == 0) ? 'P\u00FAblico' : null;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 1) ? 'Restrito' : acesso;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 2) ? 'Sigiloso' : acesso;
        listaDadosEditor.push(['N\u00EDvel de Acesso: '+acesso,acesso]);
    
        $.each(prop.selInteressadosProcedimento, function (index, value) {
            listaDadosEditor.push(['Interessado: '+value,value]);
        });
        $.each(prop.selAssuntos_select, function (index, value) {
			var valueAssunto = ( value.length > 100 ) ? value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value;
            listaDadosEditor.push(['Assunto: '+valueAssunto,value]);
        });
        $.each(prop.txaObservacoes, function (index, value) {
			var valueObs = ( value.observacao.length > 100 ) ? value.observacao.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value.observacao;
            listaDadosEditor.push(['Observa\u00E7\u00E3o ('+value.unidade+'): '+valueObs,value.observacao]);
        });
        listaDadosEditor.push(['Hoje: '+moment().format('LL'),moment().format('LL')]);
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            $.each(valueTag.tags, function (i, v) {
                var vObs = ( v.value.length > 100 ) ? v.value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : v.value;
                listaDadosEditor.push(['Personalizado ('+valueTag.unidade+') #'+v.name+': '+vObs,v.value]);
            });
        });
    return listaDadosEditor;
}
function getDadosEditor(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.listDocumentos !== 'undefined' && arrayDadosEditor().length > 0) { 
        setParamEditor(this_);
        oEditor.openDialog('DadosSEI');
    } else {
        setTimeout(function(){ 
            if (typeof dadosProcessoPro.propProcesso === 'undefined' && getDadosProcessoSession() ) {
                dadosProcessoPro = getDadosProcessoSession();
            }
            getDadosEditor(this_, TimeOut - 100); 
            $(this_).fadeOut(200).fadeIn(200);
            console.log('Reload getDadosEditor'); 
        }, 500);
    }
}
function getDialogDadosEditor() {
    var tableNewDynamicField = '';
    var dadosEditorArray = arrayDadosEditor();
    var tagsArray = jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade=='"+unidade+"'] | [0]");
        tableNewDynamicField =        '<table role="presentation" class="cke_dialog_ui_hbox tableZebra">'+
                                      ' <thead>'+
                                      '     <tr>'+
                                      '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\u00E2mico</th>'+
                                      '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                                      '     </tr>'+
                                      ' </thead>'+
                                      ' <tbody>';
    if (tagsArray !== null) {
        $.each(tagsArray.tags, function(index, v){
             tableNewDynamicField +=  '     <tr class="cke_dialog_ui_hbox" data-tag="'+v.name+'">'+
                                      '         <td class="" role="presentation" style="width:30%; padding:8px">'+
                                      '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+v.name+'</b></label>'+
                                      '         </td>'+
                                      '         <td class="" role="presentation" style="width:70%; padding:8px">'+
                                      '             <em>'+v.value+'</em>'+
                                      '             <a style="user-select: none; float: right;" onclick="removeDynamicField(this)" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-trash"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '             <a style="user-select: none; float: right; margin-right: 10px;" onclick="editDynamicField(this)" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '         </td>'+
                                      '     </tr>';
        });
    }
            tableNewDynamicField += ' </tbody>'+
                                    '</table>';
    
    CKEDITOR.dialog.add( 'DadosSEI', function ( editor )
      {
         return {
            title : 'Dados do Processo',
            minWidth : 750,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var value = this.getContentElement( 'tab1', 'listDados' ).getValue();
                if ( value != '' ) { 
                    insertDadosEditor(value);
                    event.data.hide = true;
                }
            },
            onShow : function() {
                var arrayTags_len = (getHashTagsPro(iframeEditor.find('p').map(function(){ return $(this).text() }).get().join(' '))).length;
                var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                                '  <i class="fas fa-info-circle" style="color: #007fff;"></i> '+arrayTags_len+' '+(arrayTags_len==1 ? 'campo din\u00E2mico detectado' : 'campos din\u00E2micos detectados')+'!<br>'+
                                '</label>';
                $('#tabReplaceTag_result').show().html(resultDiv);
                $('#tabNewDynamicField_alert').hide().html('');
                setChosenInCke();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Inserir Dados do Processo',
                  elements :
                  [
                    {
                        type: 'select',
                        id: 'listDados',
                        // labelLayout: 'horizontal',
                        inputStyle: 'max-width: 560px',
                        label: 'Dados do Processo',
                        items: dadosEditorArray,
                        'default': ''
                    }
                  ]
               },{
                  id : 'tab2',
                  label : 'Substituir Campos Din\u00E2micos',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label">Substituir campos din\u00E2micos no documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" onclick="replaceDadosEditor(this)" title="Substituir" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">'+
                              '                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Substituir</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabReplaceTag_result" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'
                    }
                  ]
               },{
                  id : 'tab3',
                  label : 'Campos Din\u00E2micos Personalizados',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputNameDynamicField_label" for="cke_inputNameDynamicField_textInput">Nome do campo din\u00E2mico:</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                              '             # <input style="max-width: 510px;" tabindex="2" placeholder="Insira um nome personalizado, sem acentos ou espa\u00E7os" class="cke_dialog_ui_input_text" id="cke_inputNameDynamicField_textInput" type="text" aria-labelledby="cke_inputNameDynamicField_label">'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputValueDynamicField_label" for="cke_inputValueDynamicField_textInput">Valor do campo din\u00E2mico:</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                              '             <input tabindex="3" placeholder="Insira o valor para o campo din\u00E2mico" class="cke_dialog_ui_input_text" id="cke_inputValueDynamicField_textInput" type="text" aria-labelledby="cke_inputValueDynamicField_label">'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'+
                              '             <a style="user-select: none;" onclick="newDynamicField(this)" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonNewDynamicField_label" id="buttonNewDynamicField_uiElement">'+
                              '                 <span id="buttonNewDynamicField_label" class="cke_dialog_ui_button">Salvar</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabNewDynamicField_alert" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'+
                              '<div id="tabNewDynamicField_result" class="tabReplaceTag_result" style="margin-top: 15px;">'+
                              '     '+tableNewDynamicField+
                              '</div>'+
                              '<div id="tabNewDynamicField_info" class="tabReplaceTag_result" style="margin-top: 15px;">'+
                              '     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                              '         <i class="fas fa-info-circle" style="color: #007fff;"></i> Os campos din\u00E2micos personalizados s\u00E3o salvos nas observa\u00E7\u00F5es da unidade para este processo.'+
                              '     </label>'+
                              '</div>'
                    }
                  ]
               },{
                  id : 'tab4',
                  label : 'Lista de Campos Din\u00E2micos',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox tableZebra">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="" role="presentation" style="width:100%; padding:0px">'+
                              '             <div id="tabReplaceTag_list" style="height: 285px; overflow-y: scroll;">'+
                              '                  <label class="cke_dialog_ui_labeled_label" style="display: block;"><span style="font-size: 10pt;"><i class="fas fa-hashtag" style="color: #007fff; font-size: 12pt;"></i> Lista de campos din\u00E2micos dispon\u00EDveis para utiliza\u00E7\u00E3o</span></label>'+
                              '                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTag_uiElement">'+
                              '                   <tbody>'+
                              '                       '+getDialogDadosEditor_htmlListTag('processo', 'N\u00FAmero do processo <em>(com link)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('processo_texto', 'N\u00FAmero do processo <em>(sem link)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('autuacao', 'Data de autua\u00E7\u00E3o do processo <em>(em formato DD/MM/AAAA)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('tipo', 'Tipo do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('especificacao', 'Especifica\u00E7\u00E3o do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('assuntos', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(separados por v\u00EDrgula)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('assuntos_lista', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(em formato de lista)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('interessados', 'Interessados do processo <em>(separados por v\u00EDrgula)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('interessados_lista', 'Interessados do processo <em>(em formato de lista)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('observacoes', 'Observa\u00E7\u00F5es do processo <em>(separados por v\u00EDrgula)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('observacoes_lista', 'Observa\u00E7\u00F5es do processo <em>(em formato de lista)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('observacao', 'Observa\u00E7\u00E3o da unidade atual</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('acesso', 'N\u00EDvel de acesso do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('acesso_texto', 'N\u00EDvel de acesso do processo <em>(sem \u00EDcone)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('documentos', 'Lista de todos os documentos do processo (separados por v\u00EDrgula)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('totaldocumentos', 'N\u00FAmero de documentos do processo</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('documentos_lista', 'Lista de todos os documentos do processo (em formato de lista)</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('hoje', 'Data de hoje <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                              '                   </tbody>'+
                              '                  </table>'+
                              '                  <label class="cke_dialog_ui_labeled_label" style="margin-top: 15px; display: block;"><span style="font-size: 10pt;"><i class="fas fa-user-ninja roxoColor" style="font-size: 12pt;"></i> Fun\u00E7\u00F5es Avan\u00E7adas</span></label>'+
                              '                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTagAdv_uiElement">'+
                              '                   <tbody>'+
                              '                       '+getDialogDadosEditor_htmlListTag('assunto1', 'Primeiro assunto do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('assunto3', 'Terceiro assunto do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('interessado1', 'Primeiro interessado do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('interessado4', 'Quarto interessado do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('observacao1', 'Primeira observa\u00E7\u00E3o do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('observacao2', 'Segunda observa\u00E7\u00E3o do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento1', 'Primeiro documento do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento5', 'Quinto documento do processo')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento+1', 'Pr\u00F3ximo documento do processo em rela\u00E7\u00E3o ao atual')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento+3', 'Terceiro documento do processo em rela\u00E7\u00E3o ao atual')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento-1', 'Primeiro documento do processo anterior ao atual')+
                              '                       '+getDialogDadosEditor_htmlListTag('documento-6', 'Sexto documento do processo anterior ao atual')+
                              '                       '+getDialogDadosEditor_htmlListTag('hoje+1', 'Amanh\u00E3 <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('hoje-1', 'Ontem <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('hoje+7', 'Data daqui 7 dias <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                              '                       '+getDialogDadosEditor_htmlListTag('hoje-5', 'Data \u00E0 5 dias atr\u00E1s <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')+
                              '                   </tbody>'+
                              '                  </table>'+
                              '             </div>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'
                    }
                  ]
               }
            ]
         };
      } );
}
function removeDynamicField(this_) {
    $(this_).closest('tr').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).slideUp('slow', function() {
        $(this).remove();
        updateDynamicField();
        var result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico exclu\u00EDdo com sucesso!<br>'+
                     '</label>';
        $('#tabNewDynamicField_alert').show().html(result);
    });
}
function editDynamicField(this_) {
    var _this = $(this_);
    var _parent = _this.closest('tr');
    var name = _parent.find('td').eq(0).find('b').text().replace('#', '');
    var value = _parent.find('td').eq(1).find('em').text();
        $('#cke_inputNameDynamicField_textInput').val(name);
        $('#cke_inputValueDynamicField_textInput').val(value);
}
function newDynamicField(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var nameInput = _parent.find('#cke_inputNameDynamicField_textInput');
    var valueInput = _parent.find('#cke_inputValueDynamicField_textInput');
    var arrayRestictTags = uniqPro($('#tabReplaceTag_list table').find('b').map(function(){ return $(this).text().replace(/[^a-zA-Z_]+/g, '') }).get());
    var name = (nameInput.val() != '') ? removeAcentos(nameInput.val().split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim() : nameInput.val();
    var value = valueInput.val().trim();
    var result = '';
    $('#tabNewDynamicField_alert').hide().html('');
    if (name != '' && value != '') {
        if ($.inArray(name, arrayRestictTags) === -1) {
            var htmlNewDynamicField = '     <tr class="cke_dialog_ui_hbox" data-tag="'+name+'">'+
                                      '         <td class="" role="presentation" style="width:30%; padding:8px">'+
                                      '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+name+'</b></label>'+
                                      '         </td>'+
                                      '         <td class="" role="presentation" style="width:70%; padding:8px">'+
                                      '             <em>'+value+'</em>'+
                                      '             <a style="user-select: none; float: right;" onclick="removeDynamicField(this)" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-trash"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '             <a style="user-select: none; float: right; margin-right: 10px;" onclick="editDynamicField(this)" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'+
                                      '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'+
                                      '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'+
                                      '                 </span>'+
                                      '             </a>'+
                                      '         </td>'+
                                      '     </tr>';
            var trTagEdit = $('#tabNewDynamicField_result').find('table tbody').find('tr[data-tag="'+name+'"]');
                if (trTagEdit.length == 0) {
                    $('#tabNewDynamicField_result').find('table tbody').prepend(htmlNewDynamicField);
                    $('#tabNewDynamicField_result').find('table tbody').find('tr').eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                } else {
                    trTagEdit.find('td').eq(0).find('b').text('#'+name);
                    trTagEdit.find('td').eq(1).find('em').text(value);
                    trTagEdit.eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico salvo com sucesso!<br>'+
                         '</label>';
                nameInput.val('');
                valueInput.val('');
                updateDynamicField();
        } else {
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nome restrito para utiliza&#x00E7;&#x00E3;o interna (Lista de campos din&#x00E2;micos). Insira outro nome!'+
                     '</label>';
        }
        $('#tabNewDynamicField_alert').show().html(result);
    }
}
function updateDynamicField() {
    var selectId = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'listDados')._.inputId;
        $('#'+selectId).find('option').each(function(){
            if ($(this).text().trim().split(' ')[0] == 'Personalizado') {
                $(this).remove();
            }
        });
    
    var txtObsDynamicField = '';
    var arrayNewDynamicField = [];
        $('#tabNewDynamicField_result').find('table tbody tr').each(function(index, value){
            var name = $(this).find('td').eq(0).find('b').text().trim().replace('#', '');
            var value = $(this).find('td').eq(1).find('em').text().trim();
            $('#'+selectId).append('<option value="'+value+'">Personalizado ('+unidade+') #'+name+': '+value+'</option>');
            arrayNewDynamicField.push({name: name, value: value});
            txtObsDynamicField += '#'+name+': '+value+'\n';
        });
    
        $.each(dadosProcessoPro.propProcesso.txaTagsObservacoes, function(index, value){
            if (value.unidade == unidade) {
                dadosProcessoPro.propProcesso.txaTagsObservacoes[index].tags = arrayNewDynamicField;
            }
        });
    var txaObservacoes = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+unidade+"'].observacao | [0]")
        txtObsDynamicField = (txaObservacoes !== null) ? txtObsDynamicField+txaObservacoes : txtObsDynamicField;
        updateDadosProcesso('txaObservacoes', txtObsDynamicField);
        console.log('arrayNewDynamicField', arrayNewDynamicField, txtObsDynamicField);
}
function getDialogDadosEditor_htmlListTag(tag, desc) {
    return '          <tr class="cke_dialog_ui_hbox">'+
           '              <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:8px">'+
           '                  <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#'+tag+'</b></label>'+
           '              </td>'+
           '              <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px; vertical-align: middle;">'+
           '                  '+desc+
           '              </td>'+
           '          </tr>';
}
function insertDadosEditor(value) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.insertHtml(value);
        oEditor.fire('saveSnapshot');
}
function getSumarioDocumento(this_) {
    setParamEditor(this_);
    oEditor.openDialog('SumarioSEI');
}
function getListStylesDocumento() {
    var arrayStylesDoc = [];
    $(txaEditor).each(function(index){ 
        var idEditor_ = $(this).attr('id').replace('cke_', '');
        var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
        if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
            iframe_.find('p').each(function(index){ 
                var style = ( typeof $(this).attr('class') !== 'undefined' && $(this).attr('class').indexOf(' ') !== -1 ) ? $(this).attr('class').split(' ')[0] : $(this).attr('class');
                arrayStylesDoc.push(style);
            });
        }
    });
    arrayStylesDoc = uniqPro(arrayStylesDoc);

    var arrayStyles = [['','']];
    $.each(arrayStylesDoc, function (index, value) {
        arrayStyles.push([value, '.'+value]);
    });
    return arrayStyles;
}
function updateSelectDialog(element, array) {
    if ( $('select#'+element).length ) {
        $('select#'+element).html('');
        $.each(array, function (index, value) {
            $('select#'+element).append('<option value="'+value[1]+'">'+value[0]+'</option>');
        });
    }
}
function getDialogSumarioDocumento() {
    var arrayStyles = getListStylesDocumento();
    CKEDITOR.dialog.add( 'SumarioSEI', function ( editor )
      {
         return {
            title : 'Inserir sum\u00E1rio',
            minWidth : 500,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var arrayStylesUser = [];
                var id_style1 = this.getContentElement( 'tab1', 'listStyle1' ).getValue();
                var id_style2 = this.getContentElement( 'tab1', 'listStyle2' ).getValue();
                var id_style3 = this.getContentElement( 'tab1', 'listStyle3' ).getValue();
                if ( id_style1 != '' ) { arrayStylesUser.push(id_style1); }
                if ( id_style2 != '' ) { arrayStylesUser.push(id_style2); }
                if ( id_style3 != '' ) { arrayStylesUser.push(id_style3); }
                if ( arrayStylesUser.length > 0 ) { 
                    insertSumarioDocumento(arrayStylesUser);
                    event.data.hide = true;
                }

            },
            onShow : function() {
                var arrayStyles = getListStylesDocumento();
                updateSelectDialog(this.getContentElement( 'tab1', 'listStyle1' )._.inputId, arrayStyles);
                updateSelectDialog(this.getContentElement( 'tab1', 'listStyle2' )._.inputId, arrayStyles);
                updateSelectDialog(this.getContentElement( 'tab1', 'listStyle3' )._.inputId, arrayStyles);
                setChosenInCke();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Estilo do T\u00EDtulo',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'listStyle1',
                        labelLayout: 'horizontal',
             			label: 'Estilo do T\u00EDtulo 1 (obrigat\u00F3rio)',
             			items: arrayStyles,
             			'default': ''
             		},{
             			type: 'select',
             			id: 'listStyle2',
                        labelLayout: 'horizontal',
             			label: 'Estilo do T\u00EDtulo 2',
             			items: arrayStyles,
             			'default': ''
             		},{
             			type: 'select',
             			id: 'listStyle3',
                        labelLayout: 'horizontal',
             			label: 'Estilo do T\u00EDtulo 3',
             			items: arrayStyles,
             			'default': ''
             		}
                  ]
               }
            ]
         };
      } );
}
function insertSumarioDocumento(arrayStylesUser) {
    var selectStyles = arrayStylesUser.join(', ');
    var htmlSumario = '<p class="Texto_Alinhado_Esquerda"><strong>SUM\u00C1RIO</strong></p>';
        iframeEditor.find(selectStyles).each(function(index){ 
            var randRef = randomString(16);
            var text = $(this).text().trim();
            htmlSumario+= '<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-'+randRef+'">'+$(this).text().trim()+'</a></p>';
            $(this).find('a.seipro-bookmark').remove();
            $(this).prepend('<a class="seipro-bookmark" name="bookmark-'+randRef+'"></a>');
        });
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        iframeEditor.find(pElement).after(htmlSumario);
        oEditor.fire('saveSnapshot');
    }
}

// GERA LINK CURTO
function getTinyUrl(this_) {
    setParamEditor(this_);
    oEditor.openDialog('TinyUrlSEI');
}
function getDialogTinyUrl() {
      CKEDITOR.dialog.add( 'TinyUrlSEI', function ( editor )
      {
         return {
            title : 'Gerar link curto do TinyURL',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
				var regex = /^[0-9A-Za-z\-]+$/;
                var url_Tiny = this.getContentElement( 'tab1', 'urlTiny' ).getValue();
                var alias_Tiny = this.getContentElement( 'tab1', 'aliasTiny' ).getValue();
                if ( url_Tiny != '' && isValidHttpUrl(url_Tiny) && ( ( alias_Tiny != '' && regex.test(alias_Tiny) ) || alias_Tiny == '' ) ) {
                    ajaxTinyUrl(url_Tiny, alias_Tiny, 'insert');
                    event.data.hide = false;
                } else {
					if ( url_Tiny == '' || !isValidHttpUrl(url_Tiny) ) {
						alert('Digite um link v\u00E1lido!');
					} else if ( alias_Tiny != '' && !regex.test(alias_Tiny) ) {
						alert('O nome personalizado deve conter apenas letras, n\u00FAmeros e travess\u00F5es!');
					} else if ( alias_Tiny.length < 5 ) {
                        alert('O nome personalizado deve ter mais de 4 (quatro) caracteres')
					} else {
						alert('Digite um link v\u00E1lido!');
					}
					event.data.hide = false;
				}
            },
            onShow : function() {
				var selectTxt = oEditor.getSelection().getSelectedText();
				var idInputUrl = this.getContentElement( 'tab1', 'urlTiny' )._.inputId;
				var idInputAlias = this.getContentElement( 'tab1', 'aliasTiny' )._.inputId;
				setTimeout(function(){ 
					$('#tinyResult').html('');							
					if ( selectTxt != '' && isValidHttpUrl(selectTxt) ) {
						$('.cke_dialog #'+idInputUrl).val(selectTxt);
					}
					$('.cke_dialog #'+idInputAlias).unbind('keyup').keyup(function() {
						$('#tinyResult').html('');
						var alias = $('.cke_dialog #'+idInputAlias).val();
						if ( alias != '' ) {
							var regex = /^[0-9A-Za-z\-]+$/;
							var htmlTinyResult = ( regex.test(alias) ) ? 'Resultado: <a class="linkDialog" style="cursor: auto;">https://tinyurl.com/'+alias+'</a>' : '<strong style="color:red;">O nome personalizado deve conter apenas letras, n\u00FAmeros e travess\u00F5es.</strong>';
								$('#tinyResult').html(htmlTinyResult);
						}
					});
				}, 100);
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Gerar link curto do TinyURL',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'urlTiny',
             			label: 'Insira o link que deseja encurtar',
						required : true,
             			'default': ''
             		},{
             			type: 'text',
             			id: 'aliasTiny',
             			label: 'Insira um Nome Personalizado para o link (opcional)',
						width: '150px',
             			'default': '',
						commit : function( element )
						{
							var regex = /^[0-9A-Za-z\-]+$/;
							var text = this.getValue();
							if (!regex.test(text)) {
								alert("O nome personalizado deve conter apenas letras, n\u00FAmeros e travess\u00F5es.");
								return false;
							}
						} 
             		},{
						type: 'html',
						html: '<div id="tinyResult"></div>'
					}
                  ]
               }
            ]
         };
      } );
}
function ajaxTinyUrl(url_Tiny, alias_Tiny, mode) {
	var url = "https://tinyurl.com/api-create.php";
	var data = ( alias_Tiny != '' ) ? { url: url_Tiny, alias: alias_Tiny } : { url: url_Tiny };	
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(dataUrl, textStatus, xhr){
			console.log(xhr.status);
            if (  dataUrl != '' && xhr.status == 200 ) {
				if ( mode == 'insert' ) {
					var htmlUrl = '<a href="'+dataUrl+'" class="ancoraSei" target="_blank">'+dataUrl+'</a>';
                        oEditor.focus();
                        oEditor.fire('saveSnapshot');
                        oEditor.insertHtml(htmlUrl);
                        oEditor.fire('saveSnapshot');
                        CKEDITOR.dialog.getCurrent().hide();
				} else if ( mode == 'setinput' ) {
					setInputTinyUrl(dataUrl);
				}
            }
		},
		complete: function(xhr, textStatus) {
			if ( xhr.status == 400 ) {
				alert('Erro: Nenhuma link gerado');
			} else if ( xhr.status == 422 ) {
				alert('Erro: O nome personalizado j\u00E1 existe. Insira outro.');
			}
		}
	});
}

// GERA QR CODE
function getQrCode(this_) {
    setParamEditor(this_);
    oEditor.openDialog('QrCodeSEI');
}
function getDialogQrCode() {
	var htmlQrCodeLab = '<div id="qrCodeLab">'+
						'	<table style="width: 100%;">'+
						'		<tr><td style="vertical-align: top; text-align: right;" colspan="2"><a id="toggleOptionsQR" onclick="toggleOptionsQR()" class="linkDialog">Op\u00E7\u00F5es avan\u00E7adas </a></td></tr>'+
						'		<tr><td style="vertical-align: top;">'+
						'		<div id="optionsQrAdvanced" style="display:none">'+
						'			<table>'+
						'			<tr><td>'+
						'				<label for="QrPro-size">Tamanho do QR: 140px</label><input id="QrPro-size" type="range" value="140" min="100" max="500" step="50">'+
						'			</td><td>'+
						'				<label for="QrPro-fill">Cor de Preenchimento</label><input id="QrPro-fill" type="color" value="#333333">'+
						'			</td><td>'+
						'				<label for="background">Cor de Fundo</label><input id="QrPro-background" type="color" value="#ffffff">'+
						'				<span style="display: inline-flex;margin-left: 20px;"><input id="QrPro-background-transparent" type="checkbox" style="margin: 0 5px;"> Transparente</span>'+
						'			</td></tr><tr><td>'+
						'				<label for="QrPro-minversion">Vers\u00E3o: 7</label><input id="QrPro-minversion" type="range" value="6" min="1" max="10" step="1">'+
						'			</td><td>'+
						'				<label for="QrPro-eclevel">N\u00EDvel de corre\u00E7\u00E3o de erros</label><select id="QrPro-eclevel"><option value="L" selected="selected">Baixo (7%)</option><option value="M">M\u00E9dio (15%)</option><option value="Q">1/4 (25%)</option><option value="H">Alto (30%)</option></select>'+
						'			</td><td>'+
						'				<label for="QrPro-quiet">Margens de folga: 1 m\u00F3dulos</label><input id="QrPro-quiet" type="range" value="1" min="0" max="4" step="1">'+
						'			</td></tr><tr><td>'+
						'				<label for="QrPro-radius">Raio de canto: 0%</label><input id="QrPro-radius" type="range" value="50" min="0" max="50" step="10">'+
						'			</td><td>'+
						'				<label for="QrPro-mode">Modo</label>'+
						'					<select id="QrPro-mode">'+
						'						<option value="0" selected="selected">Normal</option>'+
						'						<option value="1">Etiqueta em faixa</option>'+
						'						<option value="2">Etiqueta em caixa</option>'+
						'						<option value="3">Imagem em faixa</option>'+
						'						<option value="4">Imagem em caixa</option>'+
						'					</select>'+
						'			</td></tr><tr class="QrMode-etiqueta QrMode-imagem"><td>'+
						'				<label for="QrPro-msize">Tamanho da etiqueta: 20%</label><input id="QrPro-msize" type="range" value="20" min="0" max="40" step="1">'+
						'			</td><td>'+
						'				<label for="QrPro-mposx">Posi\u00E7\u00E3o X: 46%</label><input id="QrPro-mposx" type="range" value="50" min="0" max="100" step="1">'+
						'			</td><td>'+
						'				<label for="QrPro-mposy">Posi\u00E7\u00E3o Y: 51%</label><input id="QrPro-mposy" type="range" value="50" min="0" max="100" step="1">'+
						'			</td></tr><tr class="QrMode-etiqueta"><td>'+
						'				<label for="QrPro-font">Nome da fonte</label><select id="QrPro-font"><option value="Arial" selected="selected">Arial</option><option value="Helvetica">Helvetica</option><option value="Times">Times</option><option value="Times New Roman">Times New Roman</option><option value="Courier">Courier</option><option value="Courier New">Courier New</option><option value="Verdana">Verdana</option><option value="Tahoma">Tahoma</option><option value="Impact">Impact</option></select>'+
						'			</td><td>'+
						'				<label for="QrPro-fontcolor">Cor da fonte</label><input id="QrPro-fontcolor" type="color" value="#ff9818">'+
						'			</td><td>'+
						'				<label for="QrPro-label" class="QrMode-e">Etiqueta</label><input id="QrPro-label" type="text" value="'+NAMESPACE_SPRO+'">'+
						'			</td></tr>'+
						'			<tr class="QrMode-imagem"><td colspan="2">'+
						'				<label for="QrPro-image">Imagem</label><input id="QrPro-image" type="file">'+
						'				<img id="QrPro-img-buffer" style="display:none" src="'+iconSeiPro+'">'+
						'			</td><tr><td>'+
						'				<a onclick="resetOptionsQR()" class="linkDialog" style="margin-top: 20px; display: block;">Resetar configura\u00E7\u00F5es</a>'+
						'			</td></tr>'+
						'			</table>'+
						'		</div>'+
						'	</td><td>'+
						'		<div id="qrCodeResult" style="text-align: center; margin: 20px 0; min-width: 180px;"></div>'+
						'	</td></tr>'+
						'	</table>'+
						'</div>';
	
      CKEDITOR.dialog.add( 'QrCodeSEI', function ( editor )
      {
         return {
            title : 'Gerar C\u00F3digo QR',
            minWidth : 500,
            minHeight : 100,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
				var regex = /^[0-9A-Za-z\-]+$/;
                var qrCode_input = this.getContentElement( 'tab1', 'qrCodeText' ).getValue();
                if ( qrCode_input != '' ) {
                    setQrCode(qrCode_input);
                    event.data.hide = true;
                }
            },
            onShow : function() {
				var selectTxt = oEditor.getSelection().getSelectedText();
				var qrCode_input = this.getContentElement( 'tab1', 'qrCodeText' )._.inputId;
				setTimeout(function(){ 
					$('#qrCodeResult').html('');							
					if ( selectTxt != '' ) {
						$('.cke_dialog #'+qrCode_input).val(selectTxt);
						updateQrCode();
					}
					$('.cke_dialog #'+qrCode_input).unbind('change').on('input change',function() {
						updateQrCode();
					});
					$('#optionsQrAdvanced input, #optionsQrAdvanced textarea, #optionsQrAdvanced select').on('input change', function() {
						updateQrCode();
					});
					$('#QrPro-image').on('change', function() {
						var input = $('#QrPro-image')[0];
						if (input.files && input.files[0]) {
							var global = global || window;
							const reader = new global.FileReader();
							reader.onload = event => {
								$('#QrPro-img-buffer').attr('src', event.target.result);
								$('#QrPro-mode').val('4');
								setTimeout(updateQrCode(), 1000);
							};
							reader.readAsDataURL(input.files[0]);
						}
					});
				}, 100);
                setChosenInCke();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Gerar C\u00F3digo QR',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'qrCodeText',
             			label: 'Insira o texto que deseja codificar',
						required : true,
             			'default': '' 
             		},{
						type: 'html',
						html: htmlQrCodeLab
					}
                  ]
               }
            ]
         };
      } );
}
function resetOptionsQR() {
	var QrValues = [
		['QrPro-size', '140'],
		['QrPro-fill', '#333333'],
		['QrPro-background', '#ffffff'],
		['QrPro-minversion', '6'],
		['QrPro-eclevel', 'L'],
		['QrPro-quiet', '1'],
		['QrPro-radius', '50'],
		['QrPro-mode', '0'],
		['QrPro-label', NAMESPACE_SPRO],
		['QrPro-msize', '20'],
		['QrPro-mposx', '50'],
		['QrPro-mposy', '50'],
		['QrPro-fonte', 'Arial'],
		['QrPro-fontcolor', '#ff9818'],
		['QrPro-image', '']
	];

    $.each(QrValues, (idx, pair) => {
        $('#'+ pair[0]).val(pair[1]);
    });
	$("#QrPro-img-buffer").attr('src',iconSeiPro);
	updateQrCode();
}
function toggleOptionsQR() {
	$('#optionsQrAdvanced').toggle();
	var position = CKEDITOR.dialog.getCurrent().getPosition();
	var positionX = ( $('#optionsQrAdvanced').is(':visible') ) ? position.x-150 : position.x+150;
		CKEDITOR.dialog.getCurrent().move(positionX, position.y);
}
function tipQrCodeUrl(qrCodeTxt) {
	var iconTiny = $('.getTinyUrlButtom span').attr('style');
		$('#tipQrCodeUrl').remove();
	if ( qrCodeTxt != '' && isValidHttpUrl(qrCodeTxt) && qrCodeTxt.length > 50 ) {
		var htmlTip = 	'<span id="tipQrCodeUrl" style="float:left; padding: 5px 5px 8px 5px; background: #f9f9dc; border-radius: 5px;">Dica: Experimente <a onclick="convertTinyURL()" class="linkDialog"><span style="width: 16px; height: 16px; display: inline-block;'+iconTiny+'"></span>'+
						'Gerar link curto do TinyURL</a></span>';
		$('#toggleOptionsQR').before(htmlTip);
	}
}
function setInputTinyUrl(dataUrl) {
	CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'qrCodeText').setValue(dataUrl);
	updateQrCode();
}
function convertTinyURL() {
	var qrCodeTxt = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'qrCodeText').getValue();
	ajaxTinyUrl(qrCodeTxt, '', 'setinput');
}
function updateQrCode() {
	$('#qrCodeResult').empty();
	$('.QrMode-etiqueta').hide();
	$('.QrMode-imagem').hide();
	
	var QrValues = [
		['QrPro-size', 'px'],
		['QrPro-minversion', ''],
		['QrPro-quiet', ' m\u00F3dulos'],
		['QrPro-radius', '%'],
		['QrPro-msize', '%'],
		['QrPro-mposx', '%'],
		['QrPro-mposy', '%']
	];

    $.each(QrValues, (idx, pair) => {
        const $label = $('label[for="' + pair[0] + '"]');
        $label.text($label.text().replace(/:.*/, ': ' + $('#' + pair[0]).val() + pair[1]));
    });
	
	var qrCodeTxt = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'qrCodeText').getValue();
    var options = {
        render: 'image',
        ecLevel: $('#QrPro-eclevel').val(),
        minVersion: parseInt($('#QrPro-minversion').val(), 10),
        fill: $('#QrPro-fill').val(),
        background: ($('#QrPro-background-transparent').is(':checked')) ? null : $('#QrPro-background').val(),
        text: qrCodeTxt,
        size: parseInt($('#QrPro-size').val(), 10),
        radius: parseInt($('#QrPro-radius').val(), 10) * 0.01,
        quiet: parseInt($('#QrPro-quiet').val(), 10),
        mode: parseInt($('#QrPro-mode').val(), 10),
        mSize: parseInt($('#QrPro-msize').val(), 10) * 0.01,
        mPosX: parseInt($('#QrPro-mposx').val(), 10) * 0.01,
        mPosY: parseInt($('#QrPro-mposy').val(), 10) * 0.01,
        label: $('#QrPro-label').val(),
        fontname: $('#QrPro-font').val(),
        fontcolor: $('#QrPro-fontcolor').val(),
        image: $('#QrPro-img-buffer')[0]
    };

	if ( $('#QrPro-mode').val() == 1 || $('#QrPro-mode').val() == 2 ) {
		$('.QrMode-etiqueta').show();
	} else if ( $('#QrPro-mode').val() == 3 || $('#QrPro-mode').val() == 4 ) {
		$('.QrMode-imagem').show();
	}
	
	if ( qrCodeTxt != '' ) {
		$('#qrCodeResult').qrcode(options);
	}
	tipQrCodeUrl(qrCodeTxt);
}
function setQrCode(qrCode_text) {
	var imgBase = $('#qrCodeResult img').attr('src');
	var htmlQrCode = '<img src="'+imgBase+'">';
        oEditor.focus();
        oEditor.fire('saveSnapshot');
	    oEditor.insertHtml(htmlQrCode);
        oEditor.fire('saveSnapshot');
}
function loadResizeImg() {
	$(txaEditor).each(function(index){ 
		var idEditor_ = $(this).attr('id').replace('cke_', '');
		var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			var oEditor_ = CKEDITOR.instances[idEditor_];
				initResizeImg(oEditor_);
				loadCSSResize(iframe_);
		}
	});
}
//// Insere o texto selecionado no documento no campo 'Texto visível' do janela de propriedades do link
function insertTextTotLink(idEditor) {
    var selectTxt = oEditor.getSelection().getSelectedText();
    if ( isValidHttpUrl(selectTxt) ) {
        var link = '<a href="'+selectTxt+'" target="_blank">'+selectTxt+'</a>';
            CKEDITOR.dialog.getCurrent().hide();
            oEditor.insertHtml(link);
    } else {
        setTimeout(function(){ 
            if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) { 
                CKEDITOR.dialog.getCurrent().getContentElement('general', 'contents').setValue(selectTxt);
            }
        }, 100);
    }
}
//// Insere o texto selecionado no documento no campo 'Protocolo' do janela de adicionar protocolo SEI
function insertProtocoloOnBox(idEditor) {
    var selectTxt = oEditor.getSelection().getSelectedText();
    setTimeout(function(){ 
        if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) { 
            CKEDITOR.dialog.getCurrent().getContentElement('general', 'protocolo').setValue(selectTxt);
            document.getElementById(CKEDITOR.dialog.getCurrent().getButton('ok').domId).click();
        }
    }, 100);
}

function openLinkPro(linkRef, idEditor) {
    var url = iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').attr('href');
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
function removeLinkPro(linkRef, idEditor) {
    if ( iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').attr('contenteditable') == 'false' ) { 
        iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').removeAttr('contenteditable'); 
    }
    iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').after(iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').html()).remove();
    iframeEditor.find('.linkDisplayPro').remove();
}
function copyLinkPro(linkRef, idEditor) {
    var el = iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]');
    var url = el.attr('href');
    copyToClipboard(url);
    el.find('.info').text('Link copiado!').show();
    setTimeout(function () {
        el.find('.info').text('').hide();
    }, 2000)
}
function editLinkPro(idEditor) {
    oEditor.openDialog('editLinkPro');
}
function getDialogLinkPro() {
      CKEDITOR.dialog.add( 'editLinkPro', function ( editor )
      {
         return {
            title : 'Editar link',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var urlLink = this.getContentElement( 'tab1', 'urlLink' ).getValue();
                var nomeLink = this.getContentElement( 'tab1', 'nomeLink' ).getValue();
                if ( urlLink != '' ) {
                        nomeLink = ( nomeLink == '' ) ? urlLink : nomeLink;
                    var select = oEditor.getSelection().getStartElement();
                    var aElement = $(select.$);
                    var linkRef = $('#refLinkProForm').val();
                        iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').attr('href', urlLink).attr('data-cke-saved-href', urlLink).text(nomeLink);
                    event.data.hide = true;
                } else {
                    alert('Digite um link');
					event.data.hide = false;
				}
            },
            onShow : function() {
                var select = oEditor.getSelection().getStartElement();
                var aElement = $(select.$);
                var linkRef = aElement.attr('data-reflinkpro');
                var idInputUrl = this.getContentElement( 'tab1', 'urlLink' )._.inputId;
                var idInputNome = this.getContentElement( 'tab1', 'nomeLink' )._.inputId;
                if ( aElement.length > 0 ) {
                    setTimeout(function(){ 
                        $('.cke_dialog #'+idInputUrl).val(aElement.attr('href'));
                        $('.cke_dialog #'+idInputNome).val(aElement.text()).after('<input style="display:none" type="hidden" value="'+linkRef+'" id="refLinkProForm">');
                    }, 500);
                }
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Editar link',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'nomeLink',
             			label: 'Texto vis\u00EDvel',
             			'default': ''
             		},{
             			type: 'text',
             			id: 'urlLink',
             			label: 'URL',
						required : true,
             			'default': ''
             		}
                  ]
               }
            ]
         };
      } );
}
function openDialogBatchImgQuality(this_) {
    setParamEditor(this_);
    oEditor.openDialog('batchImgQuality');
}
function getDialogBatchImgQuality() {
      CKEDITOR.dialog.add( 'batchImgQuality', function ( editor )
      {
         return {
            title : 'Reduzir qualidade das imagens',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var qualityImg = this.getContentElement( 'tab1', 'quality' ).getValue();
                if ( qualityImg != '' ) {
                    iframeEditor.find('img').each(function(){
                        qualityImages(this, this, qualityImg*0.01);
                        
                    })
                    event.data.hide = true;
                } else {
                    alert('Digite um valor');
					event.data.hide = false;
				}
            },
            onShow : function() {
                this.getContentElement("tab1", "quality").getInputElement().setAttribute('type','range').setAttribute('max','100').setAttribute('min','1');
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Qualidade',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'quality',
             			label: 'Qualidade da Imagem',
             			'default': qualidadeImagens
             		}
                  ]
               }
            ]
         };
      } );
}
function initDialogUploadImgBase64() {
    if (checkConfigValue('editarimagens')) {
        getDialogUploadImgBase64();
    }
}
function openDialogUploadImgBase64(oEditor) {
    oEditor.openDialog('base64imageDialog');
}
function getDialogUploadImgBase64() {
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
                    if (!$(this).attr('data-width')) t.setValueOf("tab-properties", "width", this.width);
                    if (!$(this).attr('data-height')) t.setValueOf("tab-properties", "height", this.height);
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

                if (!$(this).attr('data-width')) $(this).attr('data-width', this.width);
                if (!$(this).attr('data-height')) $(this).attr('data-height', this.height);

                /* Insert preview image */
                try {
                    var boxPreview = CKEDITOR.dialog.getCurrent().getContentElement("tab-source", "preview").getElement().$;
                    var p = imgPreview.getElement().$;
                    if (p) {
                        p.appendChild(this);
                        // if (qualidadeImagens > 0 && !$(this).attr('quality')) qualityImages(this, this, quality);
                        if (boxPreview) {
                            $(boxPreview).sortable({
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
                getBase64Image($(i));
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
                if (n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
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
            var src = $(img).attr('src');
            var data = $(img).data();
            var quality = t.getValueOf("tab-properties", "quality");
                quality = (quality != "") ? parseInt(quality)*0.01 : qualidadeImagens*0.01;
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
            if (css.length > 0) newImg.setAttribute("style", css.join(""));
            if (newImg.getAttribute('maxwidth')) {
                newImg.removeAttribute('height');
            }
            if (newImg.getAttribute('maxheight')) {
                newImg.removeAttribute('width');
            }
            /* Insert new image */
            if (!selectedImg) editor.insertElement(newImg);
            if (qualidadeImagens > 0) {
                newImg.setAttribute("quality",quality);
                qualityImages(newImg.$, newImg.$, quality);
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
                    $(fileElem).css('height','90px').find('iframe').css('height','90px').contents()
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
                            'filter': (isDarkMode ? 'invert(1) brightness(1.5)' : 'none'),
                            'border':'1px dashed #ccc'
                        });
                }
                /* Remove preview */
                imgLoading.getElement().setHtml("");
                imgPreview.getElement().setHtml("");
                t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;
                /* selected image or null */
                selectedImg = editor.getSelection().getSelectedElement();;
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
                t.setValueOf("tab-properties", "quality", qualidadeImagens);
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
                if (typeof imgs !== 'undefined' && imgs.length > 0) {
                    $.each(imgs, function(i, img){
                        var src = $(img).attr('src');
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
                                    label: "Qualidade da Imagem"
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
function hideLinkTips(iframeDoc) {
    if (iframeDoc.find('.linkDisplayPro:hover').length == 0) {
        iframeDoc.find('.linkDisplayPro').closest('a');
        iframeDoc.find('.linkDisplayPro').remove();
    }
}
function showLinkTips(this_, iframeDoc) {
    iframeDoc.find('.linkDisplayPro').remove();
    var eLink = $(this_);
    var tLink = eLink.text();
        tLink = $("<div/>").text(tLink).html();
    var hrefLink = eLink.attr('href');
    var hLinkTiny = ( hrefLink.length > 50 ) ? hrefLink.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : hrefLink;
    var linkRef = randomString(8);
    var html =  '<div class="linkDisplayPro" unselectable="on">'+
                '    <span contenteditable="false">'+
                '        <a onclick="parent.openLinkPro(\''+linkRef+'\',\''+idEditor+'\')" title="Abrir link"><i class="fas fa-globe-americas" style="padding-right: 5px;"></i><span class="info"></span><strong style="font-size: 13pt;" class="title-linktip" title="'+tLink+'">'+hLinkTiny+'</strong> <i class="fas fa-external-link-alt" style="font-size: 11px; padding: 3px; vertical-align: top;"></i></a> '+
                '        <a onclick="parent.copyLinkPro(\''+linkRef+'\',\''+idEditor+'\')" title="Copiar link"><i class="far fa-copy" style="color: #777;"></i></a>'+
                '        <a onclick="parent.editLinkPro(\''+idEditor+'\')" title="Editar link"><i class="fas fa-pen" style="color: #777;"></i></a>'+
                '        <a onclick="parent.removeLinkPro(\''+linkRef+'\',\''+idEditor+'\')" title="Remover link"><i class="fas fa-unlink" style="color: #777;"></i></a>'+
                '    </span>'+
                '</div>';
        $(this_).attr('data-reflinkpro', linkRef).prepend(html);
    
        var boxDisplayLink = $(this_).find('.linkDisplayPro');
        var boxDisplayLink_left = boxDisplayLink.offset().left;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = $(window).width();
        var margin = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-(boxDisplayLink_left+boxDisplayLink_width+45) : 0;
            boxDisplayLink.css('margin-left', margin);
}
function openImageEditorPro(this_) {
    oEditor.openDialog('ImageEditorPro');
}
function initDialogImageEditorPro() {
    if (checkConfigValue('editarimagens')) {
        getDialogImageEditorPro();
    }
}
function getDialogImageEditorPro() {
    if (checkConfigValue('editarimagens')) {
        var htmlImageEditorPro =    '<div id="ImageEditorPro"></div>'; 
        var wScreen = $('body').width()-5;
            wScreen = wScreen > 900 ? 900 : wScreen;
        var hScreen = $('body').height()-10;
            hScreen = hScreen > 900 ? 900 : hScreen

        CKEDITOR.dialog.add( 'ImageEditorPro', function ( editor ) {
            return {
                title : 'Editar Imagem',
                minWidth : wScreen,
                minHeight : hScreen,
                buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
                onOk: function(event, a, b) {
                        event.data.hide = false;
                    var newImgBase64 = imgEditor.getCurrentImgData().imageData.imageBase64;
                    var selectedImg = oEditor.getSelection().getStartElement().$;
                    if (selectedImg) {
                        selectedImg.setAttribute("src", newImgBase64);
                        imgEditor.terminate();
                        CKEDITOR.dialog.getCurrent().hide();
                    }
                },
                onShow : function() {
                    checkLoadFileRobot(function(){
                        selectedImg = editor.getSelection();
                        if (selectedImg) {
                            selectedImg = selectedImg.getSelectedElement();
                        } else  if (!selectedImg || selectedImg.getName() !== "img") {
                            selectedImg = null;
                        }
                        if (typeof(selectedImg.getAttribute("src")) == "string") {
                            console.log('onShow', selectedImg);
                            var { TABS, TOOLS } = FilerobotImageEditor;
                            var config = {
                                source: selectedImg.getAttribute("src"),
                                onSave: function (editedImageObject, designState) { 
                                    selectedImg.setAttribute("src", editedImageObject.imageBase64);
                                    CKEDITOR.dialog.getCurrent().hide();
                                },
                                annotationsCommon: {
                                    fill: '#ff0000'
                                },
                                Text: { text: NAMESPACE_SPRO+'...' },
                                translations: {
                                    'toolbar.adjust': 'Ajustes'
                                },
                                language: 'pt',
                                tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.FINETUNE, TABS.FILTERS,  TABS.RESIZE, TABS.WATERMARK], // or ['Adjust', 'Annotate', 'Watermark']
                                defaultTabId: TABS.ADJUST, // or 'Annotate'
                                defaultToolId: TOOLS.TEXT, // or 'Text'
                                loadableDesignState: false,
                                observePluginContainerSize: true
                            };

                            // Assuming we have a div with id="editor_container"
                            var filerobotImageEditor = new FilerobotImageEditor(
                                document.querySelector('#ImageEditorPro'),
                                config
                            );

                            filerobotImageEditor.render({
                                onClose: (closingReason) => {
                                    console.log('Closing reason', closingReason);
                                    filerobotImageEditor.terminate();
                                }
                            });
                            imgEditor = filerobotImageEditor;
                            setTimeout(function(){ 
                                var ImageEditorPro_ = $('#ImageEditorPro');
                                    ImageEditorPro_.css('height',hScreen);
                                var wImageEditorPro = ImageEditorPro_.width();
                                var hImageEditorPro = ImageEditorPro_.height();
                                    // ImageEditorPro_.find('.FIE_main-container').css('height',hImageEditorPro-30);
                                    // ImageEditorPro_.find('.FIE_editor-content').css('height',hImageEditorPro-70);
                                    // ImageEditorPro_.find('.FIE_editor-content').css('width',wImageEditorPro-100);
                            }, 500);
                        }
                    });
                },
                contents :
                [
                {
                    id : 'tab1',
                    label : 'Editar Imagem',
                    elements :
                    [
                        {
                            type: 'html',
                            html: htmlImageEditorPro
                        }
                    ]
                }
                ]
            };
        });
    }
}
function importDocPro(this_) {
    setParamEditor(this_);
    oEditor.openDialog('importDocPro');
}
function getDialogImportDocPro() {
    var htmlImportFile =    '<label class="cke_dialog_ui_labeled_label">Importar documento HTML</label>'+
                            '<div class="cke_dialog_ui_labeled_content cke_dialog_ui_input_file">'+
                            '   <input style="width:95%" id="fileInputImportHTML" type="file">'+
                            '</div>';
    var tipsDocs = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se o documento est\u00E1 acess\u00EDvel por qualquer<br>pessoa na internet. <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a></label>'
    var tipsSheets = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se a planilha est\u00E1 publicada na web.<br> Aten\u00E7\u00E3o: O URL publicado na web \u00E9 diferente do URL da planilha. <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a></label>'
    
      CKEDITOR.dialog.add( 'importDocPro', function ( editor )
      {
         return {
            title : 'Inserir conte\u00FAdo externo',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var importHTML = document.getElementById('fileInputImportHTML').files
                var urlGDocs = this.getContentElement( 'tab2', 'urlGDocs' ).getValue();
                var urlGSheets = this.getContentElement( 'tab3', 'urlGSheets' ).getValue();
                if ( importHTML.length > 0 ) {
                    loadFileImport(importHTML);
                } else if ( urlGDocs != '' ) {
                    getGoogleDocs(urlGDocs);
                } else if ( urlGSheets != '' ) {
                    getGoogleSheets(urlGSheets);
                }
                event.data.hide = false;
            },
            onShow : function() {
                setTimeout(function () {
                    $('#fileInputImportHTML').val('');                    
                }, 500);
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Documento HTML',
                  elements :
                  [
                    {
						type: 'html',
						html: htmlImportFile
             		},{
                        type: 'checkbox',
                        id: 'importWord',
                        label: 'Corrigir erros de codifica\u00E7\u00E3o de documentos Word'
             		},{
                        type: 'checkbox',
                        id: 'replaceText',
                        'default': 'checked',
                        label: 'Substituir todo o documento pelo conte\u00FAdo externo'
             		},{
                        type: 'checkbox',
                        id: 'replaceTags',
                        'default': 'checked',
                        label: 'Substituir campos din\u00E2micos no documento (se dispon\u00EDvel)'
             		}
                  ]
               },{
                  id : 'tab2',
                  label : 'Google Docs',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'urlGDocs',
             			label: 'URL do Google Docs',
             			'default': ''
             		},{
						type: 'html',
						html: tipsDocs
             		},{
                        type: 'checkbox',
                        id: 'replaceTextDocs',
                        'default': 'checked',
                        label: 'Substituir todo o documento pelo conte\u00FAdo externo'
             		}
                  ]
               },{
                  id : 'tab3',
                  label : 'Google Planilhas',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'urlGSheets',
             			label: 'URL do Google Planilhas (Publicar na Web)',
             			'default': ''
             		},{
						type: 'html',
						html: tipsSheets
             		},{
                        type: 'checkbox',
                        id: 'replaceTextSheets',
                        'default': 'checked',
                        label: 'Substituir todo o documento pelo conte\u00FAdo externo'
             		}
                  ]
               }
            ]
         };
      } );
}
function getGoogleDocs(url) {
    var regex = "\\/d\\/(.*?)(\\/|$)";
    var regDocs = new RegExp(regex).exec(url);
    if ( regDocs !== null ) {
        var urlDocs = 'https://docs.google.com/feeds/download/documents/export/Export?id='+regDocs[1]+'&exportFormat=html';
        loadGoogleDocs(urlDocs, iframeEditor, 'docs');
    } else {
        alert('Url do documento inv\u00E1lido!');
    }
}
function getGoogleSheets(url) {
    var regex = "\\/e\\/(.*?)(\\/|$)";
    var regSheets = new RegExp(regex).exec(url);
    if ( regSheets !== null ) {
        var urlSheets = 'https://docs.google.com/spreadsheets/d/e/'+regSheets[1]+'/pubhtml';
        loadGoogleDocs(urlSheets, iframeEditor, 'sheets');
    } else {
        alert('Url do documento inv\u00E1lido!');
    }
}
function loadFileImport(files) {
    if (files.length <= 0) { return false; }
    
    var fr = new FileReader();
    fr.onload = function(e) { 
        var result = e.target.result;  
        if ( $('iframe[title*="'+idEditor+'"]').length > 0 ) {
            var r = (CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceText').getValue() == false) 
                    ? true
                    : confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
            if (r == true) { 
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    if ( $('#frmEditor').length > 0 ) {
                        if ( CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceText').getValue() == true ) {
                            iframeEditor.find('body').html(result);
                        } else {
                            var select = oEditor.getSelection().getStartElement();
                            var pElement = $(select.$).closest('p');
                            if ( pElement.length > 0 ) {
                                iframeEditor.find(pElement).before(result);
                            }
                        }
                    } else {
                        if ( CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceText').getValue() == true ) {
                            iframeEditor.html(result);
                        } else {
                            var select = oEditor.getSelection().getStartElement();
                            var pElement = $(select.$).closest('p');
                            if ( pElement.length > 0 ) {
                                pElement.before(result);
                            }
                        }
                    }
                    wordToSEI(iframeEditor);
                    oEditor.fire('saveSnapshot');
                    enableButtonSavePro();
            }
        }
    }
    if ( CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'importWord').getValue() == true ) {
        fr.readAsText(files.item(0), "cP1252");
    } else {
        fr.readAsText(files.item(0));
    }
    // console.log(CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceTags').getValue());
    if ( CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceTags').getValue() == true ) {
        setTimeout(function(){ replaceDadosEditor() }, 500);
    }
}
function wordToSEI(iframe) {
    iframe.find('body link').remove();
    iframe.find('body script').remove();
    iframe.find('body style').remove();
    iframe.find('body meta').remove();
    iframe.find('o\\:p').remove();
    iframe.find('a.msocomanchor').remove();
    iframe.find('div[style="mso-element:comment-list"]').remove();
    iframe.find('*').contents().each(function() {
        if (this.nodeType === Node.COMMENT_NODE) {
            $(this).remove();
        }
    });

    iframe.find('p.MsoNormal').each(function(){
        var align = $(this).attr('align');
        var style = ( align == 'center' ) ? 'Texto_Centralizado': 'Texto_Justificado_Recuo_Primeira_Linha';

        $(this).removeClass('MsoNormal').removeAttr('align').removeAttr('style').addClass(style);

        $(this).find('span').replaceWith(function() {
         return $( this ).contents();
        });

        $(this).find('del').each(function(){ 
                var text = $(this).html();
                if (text != '' && text != '&nbsp;') { $(this).after('<span style="color:#FF0000;"><s>'+text+'</s></span> '); }
                $(this).remove();
        });
        $(this).find('ins').each(function(){ 
                var text = $(this).html();
                if (text != '' && text != '&nbsp;') { $(this).after('<span style="color:#0000FF;"><u>'+text+'</u></span> '); }
                $(this).remove();
        });
    });

    iframe.find('.WordSection1').replaceWith(function() {
         return $( this ).contents();
    });
}
function initPasteImgToBase64(editor) {
    if (editor.addFeature) {
        editor.addFeature({
            allowedContent: 'img[alt,id,!src]{width,height};'
        });
    }
    var editableElement = editor.editable ? editor.editable() : editor.document;
    editableElement.on("paste", onPastePro, null, {editor: editor});
}

function onPastePro(event) {
    var editor = event.listenerData && event.listenerData.editor;
    var $event = event.data.$;
    var clipboardData = $event.clipboardData;
    var found = false;
    var imageType = /^image/;
    if (!clipboardData) {
        return;
    }
    return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
        if (found) {
            return;
        }
        if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
            readImageAsBase64(clipboardData.items[i], editor);
            return found = true;
        }
    });
}

function readImageAsBase64(item, editor) {
    if (!item || typeof item.getAsFile !== 'function') {
        return;
    }
    var file = item.getAsFile();
    var reader = new FileReader();
    reader.onload = function (evt) {
        var element = editor.document.createElement('img', {
            attributes: {
                src: evt.target.result,
                class: 'img-base64'
            }
        });
        
        if (qualidadeImagens > 0) qualityImages(element.$, element.$);
        // We use a timeout callback to prevent a bug where insertElement inserts at first caret position
        setTimeout(function () {
            editor.insertElement(element);
            var select = editor.getSelection().getStartElement();
            $(select.$).closest('p').find('img[src*="http"]').not('.img-base64').remove();
        }, 10);
    };
    reader.readAsDataURL(file);
}
function loadPasteImgToBase64() {
	$(txaEditor).each(function(index){ 
		var idEditor_ = $(this).attr('id').replace('cke_', '');
		var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			var oEditor = CKEDITOR.instances[idEditor_];
				initPasteImgToBase64(oEditor);
		}
	});
}
function updatePreviewLatex() {
    var mathTextValue = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'MathText').getValue();
    if ( mathTextValue != '' ) { 
        $('#latexPreview').html('<img src="https://latex.codecogs.com/png.latex?'+encodeURI(mathTextValue)+'">');
        getBase64Image($('#latexPreview').find('img'));
    } else {
        $('#latexPreview').html('');
    }
}
function openDialogLatex(this_) {
    setParamEditor(this_);
    oEditor.openDialog('latexDialog');
}
function getDialogLatex() {
    var htmlLatexPreview =  '<div id="latexPreview" style="text-align: center;margin: 20px;"></div>'+
                            '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Consulte o <a href="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX" target="_blank" class="linkDialog" style="font-style: italic;">Guia de edi\u00E7\u00E3o/F\u00F3rmulas TeX</a> para utilizar a liguagem LaTeX. <br>Se preferir, utilize um <a href="https://editor.codecogs.com/" target="_blank" class="linkDialog" style="font-style: italic;">editor visual de equa\u00E7\u00F5es LaTeX</a>. </label>';
    CKEDITOR.dialog.add( 'latexDialog', function ( editor )
      {
         return {
            title : 'Inserir Equa\u00E7\u00E3o',
            minWidth : 500,
            minHeight : 200,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var mathText_input = this.getContentElement( 'tab1', 'MathText' ).getValue();
                var imgMath = $('#latexPreview').find('img');
                if ( mathText_input != '' && imgMath.length > 0 ) {
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    oEditor.insertHtml($('#latexPreview').html());
                    oEditor.fire('saveSnapshot');
                    event.data.hide = true;
                }
            },
            onShow : function() {
				var selectTxt = oEditor.getSelection().getSelectedText();
				var mathText_input = this.getContentElement( 'tab1', 'MathText' )._.inputId;
				setTimeout(function(){ 
					$('#latexPreview').html('');							
					if ( mathText_input != '' ) {
						$('.cke_dialog #'+mathText_input).val(selectTxt);
						updatePreviewLatex();
					}
					$('.cke_dialog #'+mathText_input).unbind('change').on('input change',function() {
						updatePreviewLatex();
					});
				}, 100);
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Inserir Equa\u00E7\u00E3o',
                  elements :
                  [
                    {
             			type: 'textarea',
             			id: 'MathText',
             			label: 'Digite a equa\u00E7\u00E3o no formato LaTeX/Mathematics',
						required : true,
             			'default': '' 
             		},{
						type: 'html',
						html: htmlLatexPreview
					}
                  ]
               }
            ]
         };
      } );
}
function tableSorterPro( editor ) {
    if ( editor.contextMenu && typeof editor.getMenuItem('sortasc') === 'undefined' ) {
        editor.addMenuGroup( 'tableproGroup' );
        editor.addMenuGroup( 'tablesorterGroup' );
        editor.addMenuItem( 'addestilo', {
            label: 'Adicionar Estilo',
            icon: URL_SPRO+'icons/addestilotabela.png',
            command: 'addestilo',
            group: 'tableproGroup'
        });
        editor.addMenuItem( 'clonetable', {
            label: 'Duplicar Tabela',
            icon: URL_SPRO+'icons/duplicartabela.png',
            command: 'clonetable',
            group: 'tableproGroup'
        });
        editor.addMenuItem( 'sortasc', {
            label: 'Classificar A \u2192 Z',
            command: 'sortasc',
            group: 'tablesorterGroup'
        });
        editor.addMenuItem( 'sortdesc', {
            label: 'Classificar Z \u2192 A',
            command: 'sortdesc',
            group: 'tablesorterGroup'
        });

        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { addestilo: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { clonetable: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { sortasc: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { sortdesc: CKEDITOR.TRISTATE_OFF};
            }
        });

        editor.addCommand( 'addestilo', {
            exec: function( editor ) {
                editor.openDialog('TabelaSEI');
            }
        });
        editor.addCommand( 'sortasc', {
            exec: function( editor ) {
                tablesort('asc');
            }
        });
        editor.addCommand( 'sortdesc', {
            exec: function( editor ) {
                tablesort('desc');
            }
        });
        editor.addCommand( 'clonetable', {
            exec: function( editor ) {
                cloneTablePro();
            }
        });

        var cloneTablePro = function(){
            var selection = editor.getSelection();
            var select = selection.getStartElement();
            if ( select ){
                editor.focus();
                editor.fire('saveSnapshot');
                var tableElement = $(select.$).closest('table'); 
                var htmlTable = tableElement[0].outerHTML;
                var newLine = '<p class="Texto_Justificado_Recuo_Primeira_Linha"><br></p>';
                tableElement.after(newLine+htmlTable);
                editor.fire('saveSnapshot');
            }
        }
        var tablesort = function( order ){
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            if ( element ){
                editor.focus();
                editor.fire('saveSnapshot');
                var column_nr = element.getAscendant( { td:1, th:1 }, true ).getIndex();
                var table = element.getAscendant({table:1});
                var tbody = table.getElementsByTag('tbody').getItem(0);
                if (tbody == undefined) tbody = table;
                var items = tbody.$.childNodes;
                var itemsArr = [];
                for (var i in items) {
                    if (items[i].nodeType == 1) // get rid of the whitespace text nodes
                        itemsArr.push(items[i]);		
                }

                itemsArr.sort(function(a, b) {
                    var aText = a.childNodes[column_nr].innerText.trim();
                    var bText = b.childNodes[column_nr].innerText.trim();
                    if (!aText || 0 === aText.length) 
                        if (!bText || 0 === bText.length) return 0;
                        else return 1;
                    if (!bText || 0 === bText.length) return -1;
                    if (order == 'desc') return bText.localeCompare(aText, undefined, {numeric:true});
                    return aText.localeCompare(bText, undefined, {numeric:true});
                });

                for (i = 0; i < itemsArr.length; ++i) {
                  tbody.$.appendChild(itemsArr[i]);
                }
                editor.fire('saveSnapshot');
            }
        }
    }
}
function initContextMenuPro() { 
    setTimeout(function () {
        $(txaEditor).each(function(index){ 
            var idEditor_ = $(this).attr('id').replace('cke_', '');
            var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
            if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
                var oEditor_ = CKEDITOR.instances[idEditor_];
                    tableSorterPro(oEditor_);
                    menuCopyStyle(oEditor_);
                    if (checkConfigValue('editarimagens')) {
                        editImgPro(oEditor_);
                    }
            }
        });
    }, 2000);
}
// INSERE FUNCAO ARRASTA E SOLTA PARA IMAGENS
function initDropImages() {
    if (checkConfigValue('editarimagens')) {
        setTimeout(function () {
            $('iframe.cke_wysiwyg_frame').each(function(index){
                var iframe = $(this).contents();
                var instanceIframe = $(this).attr('title');
                    instanceIframe = (typeof instanceIframe !== 'undefined') ? instanceIframe.split(',')[1].trim() : '';
                if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                    iframe.find('body').attr('data-editor', instanceIframe).unbind().on('drop dragdrop',function(e){
                        var items = e.originalEvent.dataTransfer.items;
                        if (typeof items !== 'undefined') {
                            var currentEditor = CKEDITOR.instances[$(e.currentTarget).data('editor')];
                            if (typeof currentEditor !== 'undefined') {
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].type.indexOf("image") !== -1) {
                                        readImageAsBase64(items[i], currentEditor);
                                    }
                                }
                            }
                        }
                    });
                    setOnBodyActs(iframe);
                }
            });
        }, 1000);
    }
}
function qualityImages( src, dst, quality, type) {
    var tmp = new Image(),
        canvas, context, cW, cH;

        type = type || 'image/jpeg';
        quality = quality || qualidadeImagens*0.01;

        cW = src.naturalWidth;
        cH = src.naturalHeight;

        tmp.src = src.src;
        tmp.onload = function() {
            canvas = document.createElement( 'canvas' );

            cW /= 2;
            cH /= 2;

            if ( cW < src.width ) cW = src.width;
            if ( cH < src.height ) cH = src.height;

            canvas.width = cW;
            canvas.height = cH;
            context = canvas.getContext( '2d' );
            context.drawImage( tmp, 0, 0, cW, cH );

            dst.src = canvas.toDataURL( type, quality );

            if ( cW <= src.width || cH <= src.height )
                return;

            tmp.src = dst.src;
        }
}
// INSERE LINK DE DOCUMENTO PUBLICO
function getCheckerProcessoPublicoPro() {
    $('<iframe>', {
        id:  'frmCheckerProcessoPublicoPro',
        frameborder: 0,
        style: 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;',
        tableindex: '-1',
        scrolling: 'no'
    }).appendTo('body');
}
function openDialogProcessoPublicoPro(this_) {
    setParamEditor(this_);
    oEditor.openDialog('processoPublico');
}
function getDialogProcessoPublicoPro() {
    CKEDITOR.dialog.add( 'processoPublico', function ( editor )
      {
         return {
            title : 'Adicionar Link de Documento P\u00FAblico',
            minWidth : 400,
            minHeight : 215,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var selectDocPublico = $('#selectDocPublico option:selected');
                var url = selectDocPublico.attr('data-url');
                var doc = selectDocPublico.attr('data-documento');
                var htmlUrl = (url=='') ? doc : '<a class="ancoraSei" href="'+url+'" target="_blank">'+doc+'</a>';
                if ( typeof selectDocPublico !== 'undefined' != '' && selectDocPublico.length > 0 ) {
                    editor.focus();
                    editor.fire('saveSnapshot');
                    editor.insertHtml(htmlUrl); 
                    editor.fire('saveSnapshot');
                    event.data.hide = true;
                }
            },
            onShow : function() {
                $('#searchPub_result').html('').hide();
                $('#searchPub_load').hide();
                getDadosIframeProcessoPublicoPro();
                var processo = (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.processo !== 'undefined') ? dadosProcessoPro.listAndamento.processo : '';
                var processoPub_input = this.getContentElement( 'tab1', 'processoPub' )._.inputId;
                var captchaPub_input = this.getContentElement( 'tab1', 'captchaPub' )._.inputId;
                $('.cke_dialog #'+processoPub_input).val(processo); 
                $('.cke_dialog #'+captchaPub_input).focus().attr('autocomplete','off');
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Adicionar Link de Documento P\u00FAblico',
                  elements :
                  [
             		{
                        type: 'text',
                        label: 'Processo*',
                        id: 'processoPub',
            			width: '190px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'text',
                        label: 'Digite o c\u00F3digo*',
                        id: 'captchaPub',
            			width: '190px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <div id="searchPub_captcha" style="margin-bottom: 8px;"></div>'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" onclick="loadListaProcessoPublicoPro(this)" title="Pesquisar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="searchPub_label" id="searchPub_uiElement">'+
                              '                 <span id="searchPub_label" class="cke_dialog_ui_button">Pesquisar</span>'+
                              '             </a>'+
                              '             <i id="searchPub_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="searchPub_result" style="display:none; margin-top: 10px;"></div>'
					}
                  ]
               }
            ]
         };
      } );
}
function getDadosIframeProcessoPublicoPro() {
    if ( $('#frmCheckerProcessoPublicoPro').length == 0 ) { getCheckerProcessoPublicoPro(); }
    var url = window.location.origin+'/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0';
    $('#frmCheckerProcessoPublicoPro').attr('src', url).unbind().on('load', function(){
        checkDadosIframeProcessoPublicoPro();
    });
}
function checkDadosIframeProcessoPublicoPro(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    var ifrPublico = $('#frmCheckerProcessoPublicoPro').contents();
    if ( ifrPublico.find('#seiSearch').length > 0 ) {
        var captcha = ifrPublico.find('#lblCaptcha').find('img').attr('src');
        var htmlCaptcha =   '<img src="'+captcha+'"> <i onclick="getDadosIframeProcessoPublicoPro()" class="fas fa-redo" style="color: #969696; cursor: pointer; padding: 3px 8px;"></i>';
        $('#searchPub_captcha').html(htmlCaptcha);
        $('#searchPub_load').hide();
        var captchaPub_input = CKEDITOR.dialog.getCurrent().getContentElement( 'tab1', 'captchaPub' )._.inputId;
            $('.cke_dialog #'+captchaPub_input).val('').focus(); 
    } else {
        setTimeout(function () { 
            checkDadosIframeProcessoPublicoPro(TimeOut - 100);
            console.log('**RELOAD checkDadosIframeProcessoPublicoPro');
        }, 500);
    }
}
function loadListaProcessoPublicoPro() {
        var processoPub_input = CKEDITOR.dialog.getCurrent().getContentElement( 'tab1', 'processoPub' )._.inputId;
        var captchaPub_input = CKEDITOR.dialog.getCurrent().getContentElement( 'tab1', 'captchaPub' )._.inputId;
        var processo = $('.cke_dialog #'+processoPub_input).val(); 
        var captcha = $('.cke_dialog #'+captchaPub_input).val(); 
    if (processo != '' && captcha != '') {
        $('#searchPub_load').show();
        var ifrPublico = $('#frmCheckerProcessoPublicoPro').contents();
            ifrPublico.find('#txtProtocoloPesquisa').val(processo);
            ifrPublico.find('#txtCaptcha').val(captcha);
            ifrPublico.find('#sbmPesquisar').trigger('click');
            setTimeout(function () {
                waitLoadPro($('#frmCheckerProcessoPublicoPro').contents(), '#conteudo', "a.protocoloNormal", getListaProcessoPublicoPro);
            }, 800);
    } else {
        alert('Digite os campos obrigat\u00F3rios!');
    }
}
function getListaProcessoPublicoPro(){
    var ifrPublicoResult = $('#frmCheckerProcessoPublicoPro').contents();
    var htmlResult = ifrPublicoResult.find('#conteudo');
    var htmlValida = ifrPublicoResult.find('#txaInfraValidacao');
        $('#searchPub_load').hide();
        $('#frmCheckerProcessoPublicoPro').unbind();
        if (typeof htmlResult !== 'undefined' && htmlResult.html() != '') { 
            var linkProcesso = htmlResult.find('a.protocoloNormal').eq(0).attr('href');
            var urlProcesso = window.location.origin+'/sei/modulos/pesquisa/'+linkProcesso;
            if (typeof linkProcesso !== 'undefined' && linkProcesso != '') { 
                getLinksProcessoPublicoPro(urlProcesso);
            } else { 
                getDadosIframeProcessoPublicoPro();
                $('#searchPub_load').hide();
            }
        }
}
function getLinksProcessoPublicoPro(href) {
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        var listDocumentos = [];
            $html.find("#tblDocumentos").find('tr.infraTrClara').each(function(index){
                var link = $(this).find('a.ancoraPadraoAzul').attr('onclick');
                    link = (typeof link !== 'undefined' && link != '') ? link.match(/'([^']+)'/)[1] : link;
                    link = (typeof link !== 'undefined' && link != '') ? window.location.origin+'/sei/modulos/pesquisa/'+link : link;
                var data = $(this).find("td").map(function () { return $(this).text(); }).get();
                    listDocumentos.push({link: link, data: data}); 
            });
        var processoDoc = $html.find('#tblCabecalho').find('tr.infraTrClara').eq(0).find('td').eq(1).text();
        var optionSelectDocumentos = '';
        var citacaoDoc = getCitacaoDoc();
            $.each(listDocumentos, function (index, value) {
                var urlDocumento = (typeof value.link !== 'undefined') ? value.link : '';
                var descDocumento = (typeof value.link === 'undefined') ? ' [DOCUMENTO RESTRITO]' : '';
                optionSelectDocumentos += '<option data-url="'+urlDocumento+'" data-documento="'+value.data[2]+'&nbsp;('+citacaoDoc+value.data[1]+')">'+value.data[2]+' ('+citacaoDoc+value.data[1]+') '+descDocumento+'</option>';
            });
            optionSelectDocumentos += '<option data-url="'+href+'" data-documento="'+processoDoc+'">'+processoDoc+'</option>';
        var htmlSelectDocumentos = '<select style="width: 95%; height: auto; margin: 0 !important; padding: 5px !important;" class="cke_dialog_ui_input_select" id="selectDocPublico">'+optionSelectDocumentos+'</select>';
        var htmlDialog =  '<table role="presentation" class="cke_dialog_ui_hbox">'+
                          ' <tbody>'+
                          '     <tr class="cke_dialog_ui_hbox">'+
                          '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px; vertical-align: middle;">'+
                          '             <label class="cke_dialog_ui_labeled_label" id="selectDocPublico_label" for="selectDocPublico">Documentos</label>'+
                          '         </td>'+
                          '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                          '             <span class="cke_dialog_ui_labeled_content" id="selectDocPublico">'+
                          '                 <div class="cke_dialog_ui_input_select" role="presentation" style="width:200px">'+
                          '                     '+htmlSelectDocumentos+
                          '                 </div>'+
                          '             </span>'+
                          '         </td>'+
                          '     </tr>'+
                          ' </tbody>'+
                          '</table>';
        $('#searchPub_result').show().html(htmlDialog);
        setTimeout(function(){ 
            $('#selectDocPublico').focus();
        }, 800);
    });
}
function insertAutomaticMinutaWatermark() {
    var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+getParamsUrlPro(window.location.href).id_documento+"'].documento | [0]");
    if (nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf('minuta')  !== -1) {
        var maxIframeHeight = {value: 0, index: -1}
        $('iframe.cke_wysiwyg_frame').each(function(index){
            if ( $(this).contents().find('body').attr('contenteditable') == 'true' ) {
                var height = $(this).height();
                if (height > maxIframeHeight.value) { 
                    maxIframeHeight = {value: height, index: index};
                }
            }
        });
        if (maxIframeHeight.index != -1) {
            var elemIframe = $('iframe').eq(maxIframeHeight.index);
            var iframe = elemIframe.contents();
            if (iframe.find('.minutaAncora').length == 0) {
                if (elemIframe.attr('title').indexOf(',') !== -1) {
                    $('#idEditor').val(elemIframe.attr('title').split(',')[1].trim());
                    insertMinutaWatermark(iframe, 'auto');
                    console.log($('#idEditor').val());
                }
            }
        }
    } else {
        $('iframe.cke_wysiwyg_frame').each(function(index){
            var iframe = $(this).contents();
            if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                iframe.find('.minutaAncora[data-type="auto"]').remove();
            }
        });
    }
}
function insertMinutaWatermark(iframe, type, mode = 'minuta') {
    if (typeof oEditor !== 'undefined') {
        var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+getParamsUrlPro(window.location.href).id_documento+"'].documento | [0]");
        var textMinuta = ((nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf('modelo')  !== -1) || mode == 'modelo') ? 'MODELO' : 'MINUTA';
    
        var htmlMinuta =    '<p class="Texto_Alinhado_Esquerda">\n'+
                        '   <span contenteditable="false" class="minutaAncora" data-type="'+type+'">\n'+
                        '      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">\n'+
                        '          <style type="text/css" data-style="seipro-watermark">\n'+
                        '              body:after { content: "'+textMinuta+'"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }\n'+
                        '              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }\n'+
                        '              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }\n'+
                        '              body.cke_editable .minutaAncora:after { content: " [delete isto para remover a marca d\'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }\n'+
                        '              body.cke_editable:after { width: fit-content; margin: 0 33%; overflow: hidden; }\n'+
                        '          </style>\n'+
                        '          * '+textMinuta+' DE DOCUMENTO'+
                        '      </a>'+
                        '   </span>&nbsp;&nbsp;\n'+
                        '</p>\n';
        oEditor.focus();
        oEditor.fire('saveSnapshot');
        iframe.find('body').prepend(htmlMinuta);
        oEditor.fire('saveSnapshot');
        enableButtonSavePro();
    }
}
function getMinutaWatermark(this_) {
    setParamEditor(this_);
    var minutaAncora = iframeEditor.find('.minutaAncora');
    if (minutaAncora.length == 0) {
        insertMinutaWatermark(iframeEditor, 'manual');
    } else {
        if (minutaAncora.text().indexOf('MINUTA') !== -1) {
            minutaAncora.closest('p').remove();
            insertMinutaWatermark(iframeEditor, 'manual', 'modelo');
        } else {
            minutaAncora.closest('p').remove();
            insertMinutaWatermark(iframeEditor, 'manual');
        }
        var minutaAncora_new = iframeEditor.find('.minutaAncora');
            minutaAncora_new.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            minutaAncora_new.get(0).scrollIntoView();
    }
}
function repairSaveButtonBug() {
    if ($('.cke_button.cke_button__save').hasClass('cke_button_off')) {
        for (var i in CKEDITOR.instances) {
            var edit = CKEDITOR.instances[i];
            if (!edit.readOnly) {
                edit.on('saveSnapshot', habilitaSalvar);
                edit.on('key', habilitaSalvar);
                edit.on('afterCommandExec', habilitaSalvar);
                edit.on('tableResize', habilitaSalvar);
            } else {
                edit.document.$.body.style.background=readOnlyColor;
            }
        }
        redimensionar();
        console.log('reparSaveButtonBug');
    }
}
function initFunctions() {
    getDialogLegisSEI();
    getDialogNatJusSEI();
    getDialogNotaRodape();
    getDialogSumarioDocumento();
    getDialogSyleTable();
	getDialogTinyUrl();
	getDialogQrCode();
    getDialogLinkPro();
    getDialogImportDocPro();
    initDialogUploadImgBase64();
    getDialogLatex();
    getDialogProcessoPublicoPro();
    getDialogSigilo();
    getDialogBatchImgQuality();
    initDialogImageEditorPro();
	loadResizeImg();
    updateDialogDefinitionPro();
    loadPasteImgToBase64();
    initContextMenuPro();
    insertFontIcon('head');
    reloadModalLink();
    setDocCertidao();
    checkAutoSave();
    initDropImages();
    getStylesOnEditor();
    repairSaveButtonBug();
	
	// RETORNA DADOS DO PROCESSO
	var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
	getDadosIframeProcessoPro(idProcedimento, 'editor');
}
addButton();