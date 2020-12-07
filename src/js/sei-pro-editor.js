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
    var icon16baseLatex = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACzSURBVCjPY/jPgB8yEKmg0aHxf93/6jPlR4vP5P/I+p9yFMOEuvP7/pedKerJ7cmYnNwTOx9DQaVB9/8J/3McILyw/VjcUFA//3/a/QQBPI5MOT/7f2QBHgWxCRHvg2bhVBAjEHY/8DaecAhd73/GswfCNvmPoSA4we+8x2kQywLoTP33aAqCDHzeu79xrLepN+83uq/3Xwvdm94Jrvsd9lvtN91vuF93v+Z+tX5S44ICBQA4egHkwuNCKQAAAABJRU5ErkJggg==';
    var icon16baseQuickTable = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJySURBVBgZpcFNbNN1HMDhT//9d926NWRb65BtB8MWAZGwZIGRcNAZD2qA6E6cOKDhAjFmBzwYYzQeOXHHiwfFAOHAZScUEmeUAPFlWzMDyOtm27XdoF1/3xdZ0iYcvBCeJ+HuvIiYlm+vVD535yN1GzIz1EDMUDXUHFFD1BA1RBUVR81+jWkx9xNTe7I5nsMX3y/uimnpjW7mGn+fYa1RxtQwMUwFF2VdI37s2kvVU4gJosKn+74mBE3HPFW6MZncnHybdGaAzKadeBA8CNqsU1+Zp2f0KK8PvguJiLbHDSGIEvOUqw0PRZdJdR1Aqr8RdY6hWqJRKfBnOMTS7T1wu8izDo730RQlLl57o8PVPuzuHQWSWP0RxOuU78zQ9+rHTL5ymA3nZpeYmhigrVhrEESJTXXMxY6ls6O41CH5MoSASJK/CvNY4SsiWSfv3Vy6+h6SGiAVw/bBDM2gxC52urN/PFcvzWNidGRGwGLyQ2/RUyqgoUlt6Qb3XjrJO3tHiFIZNiw+qCFixCZ69vH9n3/6vX5oevdwmpXCRXLDbyKNCs0nRR7KNmrbP6Oa2MKFa6vEiVUM2LGlE8fA3XF3vjx7y8srZV88N+YPZt73ue/2eWXhB2+bub7stSfB2+b/qfiRU7Me0yJmrF3/hHRnH8uNPKXRU9yrZ+FmkSgBweDK3AptW/MdqBoxLZvtF0LtDsv9x5nYP8XlP4pM7szRdn72Xz6YyNO2cLdKMoKYlqr0kh0/TbZnhIflOlsHurj1aA1VQ815bbCDhbtVnmXmlnB3Nkx/M3dVgu5uqnUHUYIoKkZQQ1T4P5XVxsWEu/Mi/gPrlHrAGd9XNQAAAABJRU5ErkJggg==';
    var icon16baseFonteSizeUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAaRQTFRFAAAAJWQhJWQhKmkkJmUiJmUiSoxFTY9IM3UuPoI4KVcpJmYjS41GfL92fsB5V5lRPoI4VIIsKGgjLG0nUJJLgMF6gsJ9bK1lRYw9SZJDQIfYQ4vYSY7aQ4nZQITYQYTYOnPTMmLMKGgjMXQsNnoxhcN+h8WBVZpOSZZEPoPXbKfikbzpj7rni7fncaTiQn7WL1zLPYI2icaCjMeFTJVFO33WVpbdc6njc6jhcaThPnfTMF/LQ4o8jsmHkcqKU55KPHnUcKbiR4jaQ37Wgq7kOm3PSpJCk8uLlcyOWaZQOHHRY5veXpbcNWnPNWnPfKniOmzRNWrQQoDXap/fNGbNL13JM2HMeabhRHrVJ0rCNmrPaJ3fUovaMV/LLlnHN2fNeqbhU4bYJUa/MmPMXpPbeafiSoPYOmrPOWjORXrVgajjVobZI0G+MF3LP3TTN2bMN2PMd6DfWonaIj67L1zKMF/LdaThWIzaLFLGJEW/J0jDa5bcYI/bIT+9Hji2OGjOXY/aYJDbUIPXK1DEI0K9Ij+8K03DQnHQUX7WTXzVMVXGHTm2xQFYYgAAAIx0Uk5TAAHJwwHR///OAQfb/////9gHu/f/////9rdAhZSPkJqKDQEB/////zhT3v////u2Cv////8cuvL195gI/////3f3raD/mf////8i4t9UgP+lA6r3ZgqI/9IGXPbRTiqg//INFer/07K12P/5GwGbmbH//yIKRP/sPRN///9UAq7+/+2NECqi6v//vTG9O0R8AAAAu0lEQVR4nGNgwASMTMwofBZWNnYOTgSfi5uHl49fQBAuICQsIiomLiEpJS0jKyevoMigpKyiqqauwaCppa2jq6dvAFRjaGRswsBgamZuYWllDdJkY2tnz8Dg4Ojk7OIKNsXN3cOTwcvbx9fPPwBudGBQcEhoWHhEJEwgKjomNi4+ITEJyk9OSU1Lz8jMys6B8HPz/POBVEFhUTGYX1JaVl7BwFBZVV1TWwcSqG9obGpuaW1r7+js6sbwOwC2BCZS1lMuNQAAAABJRU5ErkJggg==';
    var icon16baseFonteSizeDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAaRQTFRFAAAAWaZQlcyOk8uLSpJCU55KkcqKjsmHQ4o8TJVFjMeFicaCPYI2SZZEVZpOh8WBhcN+NnoxMXQsKGgjQIfYQ4vYSY7aQ4nZQITYQYTYOnPTMmLMSZJDRYw9bK1lgsJ9gMF6UJJLLG0nKGgjPoPVbKfikbzpj7rni7fncaTiQn7WL1zLVIIsPoI4V5lRfsB5fL92S41GJmYjKVcpO33WVpbdc6njc6jhcaThPnfTMF/LPoI4M3UuTY9ISoxFJmUiJmUiPHnUcKbiR4jaQ37Wgq7kOm3PKmkkJWQhJWQhOHHRY5veXpbcNWnPNWnPfKniOmzRNWrQQoDXap/fNGbNL13JM2HMeabhRHrVJ0rCNmrPaJ3fUovaMV/LLlnHN2fNeqbhU4bYJUa/MmPMXpPbeafiSoPYOmrPOWjORXrVgajjVobZI0G+MF3LP3TTN2bMN2PMd6DfWonaIj67L1zKMF/LdaThWIzaLFLGJEW/J0jDa5bcYI/bIT+9Hji2OGjOXY/aYJDbUIPXK1DEI0K9Ij+8K03DQnHQUX7WTXzVMVXGHTm2bwG3mAAAAIx0Uk5TAP///////////////zj/////AQFAhZSPkJqKDbf2//////e7VN7////7tgoH2P/////bBxy68vX3mAgBzv//0QF3962g/5nDyQEi4t9UgP+lA6r3ZgqI/9IGXPbRTiqg//INFer/07K12P/5GwGbmbH//yIKRP/sPRN///9UAq7+/+2NECqi6v//vTFnsFgDAAAAtklEQVR4nGNgwASMTMwsKAKsbOwcKAKcXNw8yHxePn4BQSFhEVExcQlJKWkGGVk5eQVFJWUVVTV1DU0tbQYdXT19A0MjYxNTM3MLSyugFmsbWzt7BwZHJ2cXVzeIKe4engxe3j6+fv4BcJMDg4JDQsPCIyJhAlHRMbFx8QmJSVB+ckpqWnpGZlZ2DoSfm+efD6QKCouKwfyS0rLyCgaGyqrqmto6kEB9Q2NTc0trW3tHZ1c3ht8Bl6QmUrIsKYAAAAAASUVORK5CYII=';
    var icon16baseCopyStyle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5QUE3RkUxQ0QwMTFFQjg3OUI4MEI5REMzQzc4NjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5QUE3RkQxQ0QwMTFFQjg3OUI4MEI5REMzQzc4NjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBhNGQwZjAyLTE3NmEtOWY0Zi1iMDdjLWM5YzlmZGU1YjAyNSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBhNGQwZjAyLTE3NmEtOWY0Zi1iMDdjLWM5YzlmZGU1YjAyNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvwNkokAAAKdSURBVHjahJPNSxRhHMe/zzPzzIu7627m22LbO/lSoGJBhwg6eOgPiA51KE9BZKfAIbyVzrEo6dahg4cIooggiFgihA4lWIikWeiarmvsms7usvPWb8ZcCM1+8J1hYD7f3/N7ediP9HkEYRe/ofbAJcwmL6Pn/SJQcRFhEizZBxosgGMjfmrXD5bFzdkYK2Ky0Cdjh7ACyCOtqmRARg4/11IRd7I6AzJ5oLTygu9kAJ8gj36Wgg92tLUsHjOVwcoSvJQjQ6bL2zEbj4CBEr4rPAmfpQM4E8CZZYSuSb1/i4ELgiv+VaL7wVgidLOluv0KF1PLf2CFsKJ/AY1itFqC79koIYJUVAwMpmrvo+Qcges1grOmBpWL75uZFSUDWTpOyCgcoHoCLtfCKXwe4J4/PNhZD5sSm18JiivIBfBCAItfkFg3HXKFyqP++NXhQNZaDD+fHnY/3UbOcTDc3YhbrbuBL0vAPMGqoLL5GjxvhQTohM6VAoPQw6Dqh6RYCtL0S4i397BMJlfaEzjWEgl6QjUGKREF81XSxljLNjh3xQh8PuRJNpT1GKLiBPy55/BejWDCquDJ2Vac6UrRUlSCnSAXxUY4HJLQwK3ITEzydahru6BYNXCFA13tQmRiDO2vH2KRTvKg9xB6O/cEGW/AdTx4LjYl9V2bfyrbcS2RbTvlaiXIlgphRcDiMWhT06hfqGC1ow1dzXHj0WTmLuwSZaf2+3aocAqFeNpgLkfTzOkBUEZXL0JQObLWAfljGof3Jo2x7h4TLOgXiUnVvalOIV/3xsg3jZtciUKUEpALGtVIjYrWGKK8ZoZ3Ypv46y5k9z0z1vHB5HO0gBqncbsGbaPpyso/r8uWVXamxo3yO96sXzxZhOWa+E/8FmAACfoIcOrzUHkAAAAASUVORK5CYII=';
    var icon16baseAlignCenter = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB8SURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYwMORk/54C0w2FOcemgmSIMyH1P7LNCHiLBDcEZ/+agqwXaFbOIxLc4P0f1e7fUPiZGDcw/AdD02z9/5r/Vf7L/Zf8L/Kf/z/3f/ZsiAwjxbEJAKUIVgAswNGVAAAAAElFTkSuQmCC';
    var icon16baseAlignRight = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSZAQNL/31CdMHiGaBNS/yPbjIC3SHSD+3+EXoh5z4k2wfs/qt2/ofAziW7Q+v8brhsSrn+IMYFgZAEAE0hMH/VkcbsAAAAASUVORK5CYII=';
    var icon16baseAlignLeft = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYU/Ifphej8xbCLEaaAOBNS/yPbjIC3iHZD5P9faHqvk+gGbzQTYD76TLQbbP//hOqE6f5AvBsIRhYAysRMHy5Vf6kAAAAASUVORK5CYII=';
    var icon16baseAlignJustify = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYU/IfpheiEwTNEm5D6H9lmBLxFtAmR/3+h6YWY95xoE7z/o+uHwM9Em2D7/yeSzSAICdc/xJhAMLIA+V1VH3Z4v2kAAAAASUVORK5CYII=';
    
    var htmlButtonTable =   '   <div class="divQuickTable" style="display:none;"></div>'+
                            '   <a class="getQuickTableButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Tabela R\u00E1pida" hidefocus="true">'+
                            '      <span class="cke_button_icon" style="background: url(\''+icon16baseQuickTable+'\');">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Tabela R\u00E1pida</span>'+
                            '   </a>'+
                            '   <a class="getTablestylesButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Adicionar estilo \u00E0 tabela" hidefocus="true">'+
                            '      <span class="cke_button_icon" style="background: url(\''+icon16baseTable+'\');">&nbsp;</span>'+
                            '      <span class="cke_button_label" aria-hidden="false">Adicionar estilo a tabela</span>'+
                            '   </a>';

    var htmlButtonBeforeCut =   '   <a class="getCopyStyleButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Copiar formata\u00E7\u00E3o" hidefocus="true">'+
                                '      <span class="cke_button_icon" style="background: url(\''+icon16baseCopyStyle+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Copiar formata\u00E7\u00E3o</span>'+
                                '   </a>';
    
    var htmlButtonBeforeList =  '   <div class="divAlignText" style="display:none;">'+
                                '       <a class="getAlignLeftButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto \u00E0 esquerda" hidefocus="true">'+
                                '           <span class="cke_button_icon" style="background: url(\''+icon16baseAlignLeft+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto \u00E0 esquerda</span>'+
                                '       </a>'+
                                '       <a class="getAlignCenterButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto ao centro" hidefocus="true">'+
                                '           <span class="cke_button_icon" style="background: url(\''+icon16baseAlignCenter+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto ao centro</span>'+
                                '       </a>'+
                                '       <a class="getAlignRightButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto \u00E0 direita" hidefocus="true">'+
                                '           <span class="cke_button_icon" style="background: url(\''+icon16baseAlignRight+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto \u00E0 direita</span>'+
                                '       </a>'+
                                '       <a class="getAlignJustifyButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto justificadamente" hidefocus="true">'+
                                '           <span class="cke_button_icon" style="background: url(\''+icon16baseAlignJustify+'\');">&nbsp;</span>'+
                                '           <span class="cke_button_label" aria-hidden="false">Alinhar texto justificadamente</span>'+
                                '       </a>'+
                                '   </div>'+
                                '   <a class="getAlignButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Alinhar texto" hidefocus="true">'+
                                '      <span class="cke_button_icon" style="background: url(\''+icon16baseAlignCenter+'\');">&nbsp;</span>'+
                                '      <span class="cke_button_label" aria-hidden="false">Alinhar texto</span>'+
                                '   </a>';
    
    var htmlButtonAfterLetters =    '   <a class="getCapLetterButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseCapLetter+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)</span>'+
                                    '   </a>'+
                                    '   <a class="getFontSizeUpButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Aumentar tamanho da fonte" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseFonteSizeUp+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Aumentar tamanho da fonte</span>'+
                                    '   </a>'+
                                    '   <a class="getFontSizeDownButtom cke_iconPro cke_button cke_buttonPro cke_button_off '+classStatus+'" href="#" title="Diminuir tamanho da fonte" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseFonteSizeDown+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Diminuir tamanho da fonte</span>'+
                                    '   </a>';
    
    var htmlButton =    '<span class="cke_iconPro cke_toolgroup '+classStatus+'" role="presentation">'+
                        '   <a class="importDocButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir conte&uacute;do externo" hidefocus="true">'+
                        '       <span class="cke_button_icon" style="background: url(\''+icon16baseImport+'\');">&nbsp;</span>'+
                        '       <span class="cke_button_label" aria-hidden="false">Inserir conte&uacute;do externo</span>'+
                        '   </a>'+
                        '   <a class="getLinkLegisButtom cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar link de legisla\u00E7\u00E3o" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseLegis+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Adicionar link de legisla\u00E7\u00E3o</span>'+
                        '   </a>'+
                        '   <a class="getCitacaoDocumentoButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir refer\u00EAncia de documento do processo" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseCitaDocumento+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir refer\u00EAncia de documento do processo</span>'+
                        '   </a>'+
                        '   <a class="getNotaRodapeButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir nota de rodap\u00E9" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseNotaRodape+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir nota de rodap\u00E9</span>'+
                        '   </a>'+
                        '   <a class="getSumarioButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir sum\u00E1rio" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseSumario+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir sum\u00E1rio</span>'+
                        '   </a>'+
                        '   <a class="getDadosProcessoButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir dados do processo" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseDadosProcesso+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir dados do processo</span>'+
                        '   </a>'+
                        '   <a class="getTinyUrlButtom cke_button cke_buttonPro cke_button_off" href="#" title="Gerar link curto do TinyURL" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseTinyUrl+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Gerar link curto do TinyURL</span>'+
                        '   </a>'+
                        '   <a class="getQrCodeButtom cke_button cke_buttonPro cke_button_off" href="#" title="Gerar C\u00F3digo QR" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseQrCode+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Gerar C\u00F3digo QR</span>'+
                        '   </a>'+
                        '   <a class="getPageBreakButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir Quebra de P\u00E1gina" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16basePageBreak+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir Quebra de P\u00E1gina</span>'+
                        '   </a>'+
                        '   <a class="getLatexButtom cke_button cke_buttonPro cke_button_off" href="#" title="Inserir Equa\u00E7\u00E3o" hidefocus="true">'+
                        '      <span class="cke_button_icon" style="background: url(\''+icon16baseLatex+'\');">&nbsp;</span>'+
                        '      <span class="cke_button_label" aria-hidden="false">Inserir Equa\u00E7\u00E3o</span>'+
                        '   </a>'+
                        '</span>';
    return {default: htmlButton, tables: htmlButtonTable, beforeCut: htmlButtonBeforeCut, afterletters: htmlButtonAfterLetters, beforeList: htmlButtonBeforeList};
}
function addButton(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){ 
        if ( $('div[id^=cke_txaEditor_]').length && !$('.cke_buttonPro').length ) {
                if ( !$('#idEditor').length ) { $('#divComandos').append('<input style="display:none" type="hidden" id="idEditor">'); }
                $('div[id^=cke_txaEditor_]').each(function(index){ 
                    var idEditor = $(this).attr('id').replace('cke_', '');
                    if ( $('iframe[title*="'+idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                        $(this).find('span.cke_toolbox').append(htmlButton('').default);
                        $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('').tables);
                        $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('').afterletters);
                        $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('').beforeCut);
                        $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('').beforeList);
                        insertFontIcon($('iframe[title*="'+idEditor+'"]').contents());
                    } else {
                        $(this).find('span.cke_toolbox').append(htmlButton('disable').default);
                        $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('disable').tables);
                        $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('disable').afterletters);
                        $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('disable').beforeCut);
                        $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('disable').beforeList);
                    }
                });
                $('.getTablestylesButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { getSyleSelectedTable(this) } });
                $('.getQuickTableButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { getQuickTable(this) } });
                $('.importDocButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { importDocPro(this) } });
                $('.getLinkLegisButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getLegisSEI(this) } });
                $('.getCapLetterButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { convertFirstLetter(this) } });
                $('.getFontSizeUpButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'up') } });
                $('.getFontSizeDownButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'down') } });
                $('.getCopyStyleButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { setCopyStyle(this) } });
                $('.getAlignButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { openAlignText(this) } });
                $('.getAlignLeftButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'left') } });
                $('.getAlignCenterButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'center') } });
                $('.getAlignRightButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'right') } });
                $('.getAlignJustifyButtom').click(function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'justify') } });
                $('.getCitacaoDocumentoButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getCitacaoDocumento(this) } });
                $('.getNotaRodapeButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getNotaRodape(this) } });
                $('.getSumarioButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getSumarioDocumento(this) } });
                $('.getDadosProcessoButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getDadosEditor(this) } });
                $('.getTinyUrlButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getTinyUrl(this) } });
                $('.getQrCodeButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getQrCode(this) } });
                $('.getPageBreakButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getPageBreak(this) } });
                $('.getLatexButtom').click(function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogLatex(this) } });
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
        if ( $('iframe[title*="txaEditor_"]').eq(0).contents().find('head').find('style[data-style="seipro"]').length == 0 ) {
            $('iframe[title*="txaEditor_"]').each(function(){
                var iframe = $(this).contents();
                if ( iframe.find('head').find('style[data-style="seipro"]').length == 0 ) {
                    iframe.find('head').append("<style type='text/css' data-style='seipro'> "
                                               +"   p .ancoraSei { background: #e4e4e4; } "
                                               +"   .pageBreakPro { background: #f1f1f1; height: 15px; }"
                                               +"   .pageBreakPro::before { border-bottom: 2px dashed #bfbfbf; display: block; content: \"\"; height: 7px; }"
                                               +"   .pageBreakPro::after { content: \"\u21B3 Quebra de p\u00E1gina\"; font-family: Calibri; text-align: center; display: block; margin-top: -10px; color: #585858; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; font-size: 10pt; font-style: italic; }"
                                               +"   .linkDisplayPro { user-select: none; position: absolute; display: inline-block; padding: 8px; box-shadow: 0 1px 3px 1px rgba(60,64,67,.35); background: #fff; border-color: #dadce0; border-radius: 8px; margin-top: 16px; text-align: left; text-indent: initial; font-size: 12pt; text-transform: initial; font-weight: initial; letter-spacing: initial; text-decoration: initial; white-space: nowrap; }"
                                               +"   .linkDisplayPro a { padding: 0 8px; cursor: pointer; text-decoration: underline; color:#1155cc; }"
                                               +"   .linkDisplayPro a .info { display: none; position: absolute; background: #fff; width: calc( 100% - 150px); }"
                                               +"   .cke_copyformatting_active { cursor: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDIwNSAyNTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZXNjPjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDkuMDAwMDAwLCAtMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9ImN1cnNvciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3MCwxNCBMMjAwLjAwNzUzNywxNCBDMjAyLjc2OTA1NywxNCAyMDUsMTEuNzYzNjQ5MyAyMDUsOS4wMDQ5NzA5MiBMMjA1LDQuOTk1MDI5MDggQzIwNSwyLjIzMzgyMjEyIDIwMi43NjQ3OTgsMCAyMDAuMDA3NTM3LDAgTDEwMS45OTI0NjMsMCBDOTkuMjMwOTQzMSwwIDk3LDIuMjM2MzUwNjkgOTcsNC45OTUwMjkwOCBMOTcsOS4wMDQ5NzA5MiBDOTcsMTEuNzY2MTc3OSA5OS4yMzUyMDE3LDE0IDEwMS45OTI0NjMsMTQgTDEzMywxNCBMMTMzLDIzOCBMMTAxLjk5MjQ2MywyMzggQzk5LjIzMDk0MzEsMjM4IDk3LDI0MC4yMzYzNTEgOTcsMjQyLjk5NTAyOSBMOTcsMjQ3LjAwNDk3MSBDOTcsMjQ5Ljc2NjE3OCA5OS4yMzUyMDE3LDI1MiAxMDEuOTkyNDYzLDI1MiBMMjAwLjAwNzUzNywyNTIgQzIwMi43NjkwNTcsMjUyIDIwNSwyNDkuNzYzNjQ5IDIwNSwyNDcuMDA0OTcxIEwyMDUsMjQyLjk5NTAyOSBDMjA1LDI0MC4yMzM4MjIgMjAyLjc2NDc5OCwyMzggMjAwLjAwNzUzNywyMzggTDE3MCwyMzggTDE3MCwxNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NSwyMjIuMjgwODI5IEM2MC42MTMxMTc2LDIyMi4yODA4MjkgNTYuMzc0MjE2MiwyMjIuMjgwODI4IDUyLjk5OTk5OTUsMjIyLjI4MDgyOCBMNTMsMTcwIEw0MiwxNzAgTDQyLDIyMi41NjA1OTMgQzM4LjYxMzAyNDYsMjIyLjU2MDU5MyAzNC4zNzYzMzA4LDIyMi41NjA1OTMgMzAuMDAwMDAwNSwyMjIuNTYwNTk0IEwzMCwxNzAgTDE5LDE3MCBMMTksMjIyLjU2MDU5NSBDMTYuMzI0ODY1LDIyMi41NjA1OTUgMTMuODQ2MzM2OSwyMjIuNTYwNTk1IDExLjc2MTI3MjUsMjIyLjU2MDU5NiBDLTAuMzY5NTg2NDM4LDIyMi41NjA1OTkgMS4yODM4MTc0NiwyMTEuNTA5MzEzIDEuMjgzODE3NDYsMjExLjUwOTMxMyBDMS4yODM4MTc0NiwyMTEuNTA5MzEzIDAuMzg5Njg5OTQ0LDE3Ny43NTYgMC4zOTY1NzEyNzcsMTU4IEw5NC43NDA4MjMyLDE1OCBDOTQuNzM5MjczNiwxNzcuNzkzMDg5IDkzLjg1MzUzOTYsMjExLjIyOTU0OCA5My44NTM1Mzk2LDIxMS4yMjk1NDggQzkzLjg1MzUzOTYsMjExLjIyOTU0OCA5NS41MDY5NDM1LDIyMi4yODA4MzQgODMuMzc2MDg0NSwyMjIuMjgwODMxIEM4MS4yNTUzNzgyLDIyMi4yODA4MyA3OC43Mjc2NDE1LDIyMi4yODA4MyA3Ni4wMDAwMDAyLDIyMi4yODA4MyBMNzYsMTcwIEw2NSwxNzAgTDY1LDIyMi4yODA4MjkgWiBNMC41NzQ1MzQwMzYsMTQ3IEMwLjU3OTc2ODM4NywxNDYuODk2MTQ5IDAuNTg1MTMxNjM4LDE0Ni43OTQ3NTUgMC41OTA2MjU1MTQsMTQ2LjY5NTg2NiBDMS4yODM4MTc0OCwxMzQuMjE4NDA5IC0wLjc5NzExMjI4NiwxMjIuNDM0MTQ2IDE2Ljg3OTI4MTYsMTE2LjE5NTQyMiBDMzQuNTU1Njc1NSwxMDkuOTU2Njk4IDI4LjY2NjI1MzYsMTA3LjUzMDUyMiAzMC4zOTc4NzkyLDk1Ljc0NjI1NzYgQzMyLjEyOTUwNDgsODMuOTYxOTkzIDI1Ljg5MjEyOTgsNzguMDY5ODYzIDI1Ljg5MjEzMTUsNDQuNzk2NjQ5NiBDMjUuODkyMTMzLDE3Ljk2MDcyMDYgMzguNTE2OTQ2NywxMy45MjIwMTczIDQ1LjUyMjA5MzksMTMuMzYzNzYxNyBDNDUuNjA4OTgxNCwxMy4xMzQwNzI3IDQ1LjcwMDI1MDYsMTMuMDE2NDM5MSA0NS43OTYwNjMxLDEzLjAxNjQzOTEgQzQ5LjgzNzIwNTYsMTMuMDE2NDM4OSA2OS4yNDUyMjM3LDExLjI0MzY3MTMgNjkuMjQ1MjI1NSw0NC41MTY4ODQ3IEM2OS4yNDUyMjczLDc3Ljc5MDA5ODIgNjMuMDA3ODUyMyw4My42ODIyMjgxIDY0LjczOTQ3NzgsOTUuNDY2NDkyOCBDNjYuNDcxMTAzNCwxMDcuMjUwNzU3IDYwLjU4MTY4MTUsMTA5LjY3NjkzMyA3OC4yNTgwNzU0LDExNS45MTU2NTcgQzk1LjkzNDQ2OTMsMTIyLjE1NDM4MSA5My44NTM1Mzk1LDEzMy45Mzg2NDQgOTQuNTQ2NzMxNSwxNDYuNDE2MTAxIEM5NC41NTcwNTg2LDE0Ni42MDE5ODkgOTQuNTY2OTI0MiwxNDYuNzk2NzI0IDk0LjU3NjMzOTcsMTQ3IEwwLjU3NDUzNDAzNiwxNDcgWiBNNDcuNSw0MSBDNTIuMTk0NDIwNCw0MSA1NiwzNy4xOTQ0MjA0IDU2LDMyLjUgQzU2LDI3LjgwNTU3OTYgNTIuMTk0NDIwNCwyNCA0Ny41LDI0IEM0Mi44MDU1Nzk2LDI0IDM5LDI3LjgwNTU3OTYgMzksMzIuNSBDMzksMzcuMTk0NDIwNCA0Mi44MDU1Nzk2LDQxIDQ3LjUsNDEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=') 12 1, auto !important; }"
                                               +"</style>");
                }
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
            });
            for(var id in CKEDITOR.instances) {
                CKEDITOR.instances[id].on('focus', function(e) {
                    // Fill some global var here
                    currentEditor = e.editor.name;
                    var iframe = $('iframe[title*="'+currentEditor+'"]').contents();
                    $('#idEditor').val(currentEditor);
                    if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                        $('#cke_'+currentEditor).find('.cke_iconPro').removeClass('cke_button_disabled');
                    }
                });
            }
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
// Adiciona quebra de pagina
function getPageBreak(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        $('#idEditor').val(idEditor);
    var iframe = $('iframe[title*="'+idEditor+'"]').contents();
    var htmlBreakPage = '<div class="pageBreakPro" style="page-break-after: always"></div>';
    var editor = CKEDITOR.instances[idEditor];
    var select = editor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        editor.focus();
        editor.fire('saveSnapshot');
        iframe.find(pElement).before(htmlBreakPage);
        editor.fire('saveSnapshot');
    }
}

// Altera o alinhamento do texto
function setAlignText(this_, mode) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        $('#idEditor').val(idEditor);
    var editor = CKEDITOR.instances[idEditor];
    var select = editor.getSelection().getStartElement();
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
    editor.focus();
    editor.fire('saveSnapshot');
    if ( newClass != '' ) { 
        element.closest('p').removeAttr('style').attr('class', newClass); 
    } else {
        element.closest('p').removeAttr('style').css('text-align', mode);
    }
    editor.fire('saveSnapshot');
}
function openAlignText(this_) {
    if ($(this_).hasClass('cke_button_on')) {
        $(this_).addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.divAlignText').hide();
    } else {
        $(this_).addClass('cke_button_on').removeClass('cke_button_off').closest('.cke_top').find('.divAlignText').show();
    }
}
function closeAlignText() {  
    var idEditor = $('#idEditor').val();
    $('#cke_'+idEditor).find('.getAlignButtom').addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.divAlignText').hide();
}

// Modifica o tamanho da fonte
function changeFontSize(this_, mode) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        $('#idEditor').val(idEditor);
    var editor = CKEDITOR.instances[idEditor];
    var select = editor.getSelection().getStartElement();
    var fontSize = parseFloat($(select.$).css('font-size'));
    var newFontSize = (mode=='up') ? fontSize+2 : fontSize-2;

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'style': 'font-size: '+newFontSize+'px'
        }
    });
    if (newFontSize > 7 && newFontSize < 70 && hasSelection(editor)) {
        editor.focus();
        editor.fire('saveSnapshot');
        editor.applyStyle(style);
        editor.fire('saveSnapshot');
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
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        $('#idEditor').val(idEditor);
    var editor = CKEDITOR.instances[idEditor];
        actionCopyStyle(editor);
}
function actionCopyStyle(editor) {
    var idEditor = $('#idEditor').val();
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var select = editor.getSelection().getStartElement();
    var element = $(select.$);
    var p = element.closest('p').attr('class');
    var style = getCopyStyle();
    if (hasSelection(editor) || element.closest('body').hasClass('cke_copyformatting_active')) {
        $('#cke_'+idEditor).find('.getCopyStyleButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getCopyStyleButtom').addClass('cke_button_disabled');
    }
    if (typeof style !== 'undefined' && hasSelection(editor) && element.closest('body').hasClass('cke_copyformatting_active')) {
        editor.focus();
        editor.fire('saveSnapshot');
        editor.fire('lockSnapshot');
        editor.execCommand('removeFormat');
        if (typeof style !== 'undefined' && style.backgroundColor && style.backgroundColor != '') { 
            var styleBackgroundColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'background-color: '+style.backgroundColor
                }
            });
            editor.applyStyle(styleBackgroundColor); 
        }
        if (typeof style !== 'undefined' && style.fontSize > 0 ) { 
            var styleFontSize = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'font-size: '+style.fontSize+'px'
                }
            });
            editor.applyStyle(styleFontSize); 
        }
        if (typeof style !== 'undefined' && style.bold) { editor.execCommand('bold'); }
        if (typeof style !== 'undefined' && style.underline) { editor.execCommand('underline'); }
        if (typeof style !== 'undefined' && style.italic) { editor.execCommand('italic'); }
        if (typeof style !== 'undefined' && style.strike) { editor.execCommand('strike'); }
        if (typeof style !== 'undefined' && style.subscript) { editor.execCommand('subscript'); }
        if (typeof style !== 'undefined' && style.superscript) { editor.execCommand('superscript'); }
        if (typeof style !== 'undefined' && style.color && style.color != '') { 
            var styleColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'color: '+style.color
                }
            });
            editor.applyStyle(styleColor); 
        }
        if (!window.event.altKey) { removeCopyStyle(); }
        element.closest('p').attr('class', p);
        editor.fire('unlockSnapshot');
        editor.fire('saveSnapshot');
    }
}
function removeCopyStyle() {
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var select = editor.getSelection().getStartElement();
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
            icon: URL_SEIPRO+'icons/copiarformatacao.png',
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
    var idEditor = $('#idEditor').val();
    var iframe = $('iframe[title*="'+idEditor+'"]').contents();
    var editor = CKEDITOR.instances[idEditor];
    var row = $(this_).attr('data-row');
    var col = $(this_).attr('data-col');
    var idFirstTD = 'quickTablePos_'+randomString(8);
    var htmlTable = '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:60%;">';
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
    var select = editor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        editor.focus();
        editor.fire('saveSnapshot');
        iframe.find(pElement).after(htmlTable);
        hideQuickTable();
        $('#cke_'+idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
        
        // Move o cursor para a primeira celula da tabela
        var sel = editor.getSelection();
        var element_ = sel.getStartElement();
        var element = editor.document.getById(idFirstTD);
        var ranges = editor.getSelection().getRanges();
            ranges[0].setStart(element.getFirst(), 0);
            ranges[0].setEnd(element.getFirst(), 0);
            sel.selectRanges([ranges[0]]);
            iframe.find('#'+idFirstTD).attr('id', '');
            editor.fire('saveSnapshot');
    }
}

//// Insere estilo clean a tabela selecionada do documento
function detectSyleSelectedTable() {
    var idEditor = $('#idEditor').val();
    var oEditor = CKEDITOR.instances[idEditor];
    var select = oEditor.getSelection().getStartElement();
    var tableElement = $(select.$).closest('table');
    return tableElement;
}
function activeIconsSelectedText() {
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    if ( detectSyleSelectedTable().length > 0 ) {
        $('#cke_'+idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getTablestylesButtom').addClass('cke_button_disabled');
    }
    if (hasSelection(editor)) {
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
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        $('#idEditor').val(idEditor);
    if ( detectSyleSelectedTable().length > 0 ) {
            CKEDITOR.instances[idEditor].openDialog('TabelaSEI');
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
                if ( valueT != '' && valueC != '' ) { 
                    setSyleTable([valueT, valueC]);
                    event.data.hide = true;
                }
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
	var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
	    $('#idEditor').val(idEditor);
    var editor = CKEDITOR.instances[idEditor];
        editor.focus();
        editor.fire('saveSnapshot');
        setSyleTable();
        editor.fire('saveSnapshot');
}
function setSyleTable(value) {

	var tableID = value[0];
	var colorID = value[1];
	var color = getColorID()[colorID];
	var arrayStyle = getStyleTable(color)[tableID];
	
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
}

//// INSERE LINK DE NORMAS
function sendLegisSEI(nomeLegis) {
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
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
                editor.focus();
                editor.fire('saveSnapshot');
                CKEDITOR.instances[idEditor].insertHtml(htmlLegis);
                uniqLinkLegisSEI(idEditor);
                editor.fire('saveSnapshot');
            }
		}
	});
}
function insertLegisSEI(this_) {
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var htmlLegis = $('<div>').append($(this_).closest('p').find('.legisSeiPro').clone().removeAttr('style').removeClass('linkDialog')).html();
        editor.focus();
        editor.fire('saveSnapshot');
        CKEDITOR.instances[idEditor].insertHtml(htmlLegis);
        uniqLinkLegisSEI(idEditor);
        editor.fire('saveSnapshot');
        CKEDITOR.dialog.getCurrent().hide();
}
function uniqLinkLegisSEI(idEditor) {
    var iframe = $('iframe[title*="'+idEditor+'"]').contents();
    var arrayRef = [];
        iframe.find('.legisSeiPro').each(function(){ 
             var refNorma = $(this).attr('data-norma');
             if ( iframe.find('a[data-norma="'+refNorma+'"]').length > 1 ) {
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
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('LegisSEI');
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
    //console.log(tipo, termo, numero, ano, periodo);
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
            //console.log(legisData);
            if (  legisData.status == 0 ) {
                $('#searchLegis_load').hide();
                alert('Erro interno do servidor :( Tente novamente mais tarde');
            } else {
                var htmlResult =      '<table>'+
                                      ' <tbody>';

                    $.each(legisData.docs, function (i, val) {
                        var ementa = val.dsc_ementa.replace(/(\r\n|\n|\r)/gm, "");
                            ementa = (ementa.indexOf(' ') !== -1 && ementa.split(' ')[0] === ementa.split(' ')[0].toUpperCase()) ? ementa.charAt(0).toUpperCase() + ementa.toLocaleLowerCase().slice(1) : ementa;
                        var ementa_limited = ( ementa.length > 170 ) ? ementa.substring(0,170)+'...' : ementa;
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
                    //alert('Preencha todos os campos antes de prosseguir!');
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
             			items: [ [''], [ 'ANTAQ', 'Antaq' ], [ 'Cade', 'Cade' ] ],
             			'default': ''
             		},{
             			type: 'select',
             			id: 'tipoInfraNorma',
             			label: 'Tipo de Legisla\u00E7\u00E3o',
                        labelLayout: 'horizontal',
                        width: '200px',
             			items: [ [''], [ 'Resolu\u00E7\u00E3o Normativa', 'rn' ], [ 'Resolu\u00E7\u00E3o', 'res' ], [ 'Resolu\u00E7\u00E3o Conjunta', 'resconj' ], [ 'S\u00FAmula Administrativa', 'sum' ], [ 'Portaria', 'port' ], [ 'Portaria Conjunta', 'portconj' ], [ 'Portaria Interministerial', 'portinter' ], [ 'Instru\u00E7\u00E3o Normativa', 'in' ] ],
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
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    var oEditor = CKEDITOR.instances[idEditor];
    var selectTxt = oEditor.getSelection().getSelectedText();
    if ( selectTxt != '' ) {
        var text = capitalizeFirstLetter(selectTxt);
        CKEDITOR.instances[idEditor].insertHtml(text);
    } else {
        alert('Selecione um texto para convers\u00E3o')
    }
}

function getCitacaoDocumento(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('CitaSEI');
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var dataValue = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+id_protocolo+"'] | [0]");
    if ( typeof dataValue !== 'undefined' && dataValue.documento ) {
        var nrSei = ( dataValue.nr_sei != '' ) ? dataValue.nr_sei : dataValue.documento;
        var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+dataValue.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
        var citacaoDocumento = ( dataValue.nr_sei != '' ) ? dataValue.documento.trim()+'&nbsp;(SEI n\u00BA '+nrSeiHtml+')' : nrSeiHtml;
        editor.focus();
        editor.fire('saveSnapshot');
        CKEDITOR.instances[idEditor].insertHtml(citacaoDocumento);
        editor.fire('saveSnapshot');
    }
}

// INSERE NOTAS DE RODAPE
function getNotaRodape(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('NtRodapeSEI');
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
				var idEditor = $('#idEditor').val();
				var oEditor = CKEDITOR.instances[idEditor];
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var iframeEditor = $('iframe[title*="'+idEditor+'"]').contents();
    var randRef = randomString(16);
    var ntRodapeId = parseInt(iframeEditor.find('.ntRodape_item').length)+1;
    var ntRodapeHtml_footer = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_'+randRef+'" href="#item_'+randRef+'"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="'+randRef+'" data-ntrodape="'+ntRodapeId+'"  contenteditable="false">['+ntRodapeId+']</span></a> '+txt_NotaRodape+'</p>';
    var ntRodapeHtml_item = '<sup><a href="#footer_'+randRef+'" name="item_'+randRef+'"><span class="ntRodape_item ancoraSei" data-ntrodape="'+ntRodapeId+'" data-ntrodape-ref="'+randRef+'" contenteditable="false">['+ntRodapeId+']</span></a></sup> ';
    
    editor.focus();
    editor.fire('saveSnapshot');
    if ( iframeEditor.find('.ntRodape_tr').length == 0 ) {
        iframeEditor.find('body').append('<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>');
    }
    iframeEditor.find('body').append(ntRodapeHtml_footer);
    CKEDITOR.instances[idEditor].insertHtml(ntRodapeHtml_item);
    reorderNtRodape(iframeEditor);
    editor.fire('saveSnapshot');
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
function arrayDadosEditor() {
        setMomentPtBr();
    var listaDadosEditor = [['']];
    var htmlProcesso = '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+dadosProcessoPro.propProcesso.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+dadosProcessoPro.propProcesso.txtProtocoloExibir+'</a></span>';
        listaDadosEditor.push(['Processo: '+dadosProcessoPro.propProcesso.txtProtocoloExibir,htmlProcesso]);
        listaDadosEditor.push(['Tipo: '+dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento,dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento]);
        listaDadosEditor.push(['Descri\u00E7\u00E3o: '+dadosProcessoPro.propProcesso.txtDescricao,dadosProcessoPro.propProcesso.txtDescricao]);
        $.each(dadosProcessoPro.propProcesso.selInteressadosProcedimento, function (index, value) {
            listaDadosEditor.push(['Interessado: '+value,value]);
        });
        $.each(dadosProcessoPro.propProcesso.selAssuntos_select, function (index, value) {
			var valueAssunto = ( value.length > 100 ) ? value.substring(0,100)+'...' : value;
            listaDadosEditor.push(['Assunto: '+valueAssunto,value]);
        });
        listaDadosEditor.push(['Hoje: '+moment().format('LL'),moment().format('LL')]);
    return listaDadosEditor;
}
function getDadosEditor(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('DadosSEI');
}
function getDialogDadosEditor() {
    var dadosEditorArray = arrayDadosEditor();
    CKEDITOR.dialog.add( 'DadosSEI', function ( editor )
      {
         return {
            title : 'Inserir Dados do Processo',
            minWidth : 700,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var value = this.getContentElement( 'tab1', 'listDados' ).getValue();
                if ( value != '' ) { 
                    insertDadosEditor(value);
                    event.data.hide = true;
                }
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Dados do Processo',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'listDados',
             			label: 'Dados do Processo',
             			items: dadosEditorArray,
             			'default': ''
             		}
                  ]
               }
            ]
         };
      } );
}
function insertDadosEditor(value) {
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
        editor.focus();
        editor.fire('saveSnapshot');
        CKEDITOR.instances[idEditor].insertHtml(value);
        editor.fire('saveSnapshot');
}
function getSumarioDocumento(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('SumarioSEI');
}
function getListStylesDocumento() {
    var arrayStylesDoc = [];
    $('div[id^=cke_txaEditor_]').each(function(index){ 
        var idEditor = $(this).attr('id').replace('cke_', '');
        var iframe = $('iframe[title*="'+idEditor+'"]').contents();
        if ( iframe.find('body').attr('contenteditable') == 'true' ) {
            iframe.find('p').each(function(index){ 
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
    var iframe = $('iframe[title*="'+idEditor+'"]').contents();
    var htmlSumario = '<p class="Texto_Alinhado_Esquerda"><strong>SUM\u00C1RIO</strong></p>';
        iframe.find(selectStyles).each(function(index){ 
            var randRef = randomString(16);
            var text = $(this).text().trim();
            htmlSumario+= '<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-'+randRef+'">'+$(this).text().trim()+'</a></p>';
            $(this).find('a.seipro-bookmark').remove();
            $(this).prepend('<a class="seipro-bookmark" name="bookmark-'+randRef+'"></a>');
            console.log($(this).text().trim(), randRef);
        });
    var oEditor = CKEDITOR.instances[idEditor];
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
    if ( pElement.length > 0 ) {
        editor.focus();
        editor.fire('saveSnapshot');
        iframe.find(pElement).after(htmlSumario);
        editor.fire('saveSnapshot');
    }
}

// GERA LINK CURTO
function getTinyUrl(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('TinyUrlSEI');
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
				var idEditor = $('#idEditor').val();
				var oEditor = CKEDITOR.instances[idEditor];
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
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
                        editor.focus();
                        editor.fire('saveSnapshot');
                        CKEDITOR.instances[idEditor].insertHtml(htmlUrl);
                        editor.fire('saveSnapshot');
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
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('QrCodeSEI');
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
						'				<label for="QrPro-label" class="QrMode-e">Etiqueta</label><input id="QrPro-label" type="text" value="Sei Pro">'+
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
				var idEditor = $('#idEditor').val();
				var oEditor = CKEDITOR.instances[idEditor];
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
		['QrPro-label', 'Sei Pro'],
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
        background: $('#QrPro-background').val(),
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
    var idEditor = $('#idEditor').val();
    var editor = CKEDITOR.instances[idEditor];
	var imgBase = $('#qrCodeResult img').attr('src');
	var htmlQrCode = '<img src="'+imgBase+'">';
        editor.focus();
        editor.fire('saveSnapshot');
	   CKEDITOR.instances[idEditor].insertHtml(htmlQrCode);
        editor.fire('saveSnapshot');
}
function loadResizeImg() {
	$('div[id^=cke_txaEditor_]').each(function(index){ 
		var idEditor = $(this).attr('id').replace('cke_', '');
		var iframe = $('iframe[title*="'+idEditor+'"]').contents();
		if ( iframe.find('body').attr('contenteditable') == 'true' ) {
			var oEditor = CKEDITOR.instances[idEditor];
				initResizeImg(oEditor);
				loadCSSResize(iframe);
		}
	});
}
//// Insere o texto selecionado no documento no campo 'Texto visível' do janela de propriedades do link
function insertTextTotLink(idEditor) {
    var oEditor = CKEDITOR.instances[idEditor];
    var selectTxt = oEditor.getSelection().getSelectedText();
    if ( isValidHttpUrl(selectTxt) ) {
        var link = '<a href="'+selectTxt+'" target="_blank">'+selectTxt+'</a>';
            CKEDITOR.dialog.getCurrent().hide();
            oEditor.insertHtml(link);
    } else {
        setTimeout(function(){ 
            if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) { 
                CKEDITOR.dialog.getCurrent().getContentElement('general', 'contents').setValue(selectTxt);
                //if ( isValidHttpUrl(selectTxt) ) { CKEDITOR.dialog.getCurrent().getContentElement('general', 'url').setValue(selectTxt); }
            }
        }, 100);
    }
}

function openLinkPro(linkRef, idEditor) {
    var iframeDoc = $('iframe[title*="'+idEditor+'"]').contents();    
    var url = iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').attr('href');
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
function removeLinkPro(linkRef, idEditor) {
    var iframeDoc = $('iframe[title*="'+idEditor+'"]').contents();    
    if ( iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').attr('contenteditable') == 'false' ) { 
        iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').removeAttr('contenteditable'); 
    }
    iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').after(iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').html()).remove();
    iframeDoc.find('.linkDisplayPro').remove();
}
function copyLinkPro(linkRef, idEditor) {
    var iframeDoc = $('iframe[title*="'+idEditor+'"]').contents();    
    var el = iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]');
    var url = el.attr('href');
    copyToClipboard(url);
    el.find('.info').text('Link copiado!').show();
    setTimeout(function () {
        el.find('.info').text('').hide();
    }, 2000)
}
function editLinkPro(idEditor) {
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('editLinkPro');
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
                    var idEditor = $('#idEditor').val();
                    var iframeDoc = $('iframe[title*="'+idEditor+'"]').contents();
                    var oEditor = CKEDITOR.instances[idEditor];
                    var select = oEditor.getSelection().getStartElement();
                    var aElement = $(select.$);
                    var linkRef = $('#refLinkProForm').val();
                        iframeDoc.find('a[data-reflinkpro="'+linkRef+'"]').attr('href', urlLink).attr('data-cke-saved-href', urlLink).text(nomeLink);
                    event.data.hide = true;
                } else {
                    alert('Digite um link');
					event.data.hide = false;
				}
            },
            onShow : function() {
				var idEditor = $('#idEditor').val();
                var oEditor = CKEDITOR.instances[idEditor];
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
function hideLinkTips(iframeDoc) {
    if (iframeDoc.find('.linkDisplayPro:hover').length == 0) {
        iframeDoc.find('.linkDisplayPro').closest('a');
        iframeDoc.find('.linkDisplayPro').remove();
    }
}
function showLinkTips(this_, iframeDoc) {
    iframeDoc.find('.linkDisplayPro').remove();
    var eLink = $(this_);
    var idEditor = $('#idEditor').val();
    var tLink = eLink.text();
        tLink = $("<div/>").text(tLink).html();
    var hrefLink = eLink.attr('href');
    var hLinkTiny = ( hrefLink.length > 50 ) ? hrefLink.substring(0,50)+'...' : hrefLink;
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
function importDocPro(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('importDocPro');
}
function getDialogImportDocPro() {
    var htmlImportFile =    '<label class="cke_dialog_ui_labeled_label">Importar documento HTML</label>'+
                            '<div class="cke_dialog_ui_labeled_content cke_dialog_ui_input_file">'+
                            '   <input style="width:100%" id="fileInputImportHTML" type="file">'+
                            '</div>';
    var tipsDocs = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se o documento est\u00E1 acess\u00EDvel por qualquer<br>pessoa na internet. <a href="https://pedrohsoaresadv.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a></label>'
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
                if ( importHTML.length > 0 ) {
                    loadFileImport(importHTML);
                } else if ( urlGDocs != '' ) {
                    getGoogleDocs(urlGDocs);
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
                        id: 'inportWord',
                        label: 'Corrigir erros de codifica\u00E7\u00E3o de documentos Word'
             		}
                  ]
               },{
                  id : 'tab2',
                  label : 'Google Docs [BETA]',
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
             		}
                  ]
               }
            ]
         };
      } );
}
function getGoogleDocs(url) {
    var idEditor = $('#idEditor').val();
    var iframe = $('iframe[title*="'+idEditor+'"]').contents();
    var regex = "\\/d\\/(.*?)(\\/|$)";
    var regDocs = new RegExp(regex).exec(url);
    var urlDocs = 'https://docs.google.com/feeds/download/documents/export/Export?id='+regDocs[1]+'&exportFormat=html';
    if ( regDocs !== null ) {
        loadGoogleDocs(urlDocs, iframe);
    } else {
        alert('Url do documento inv\u00E1lido!');
    }
}
function loadFileImport(files) {
    if (files.length <= 0) { return false; }
    
    var fr = new FileReader();
    fr.onload = function(e) { 
        var result = e.target.result;  
        var idEditor = $('#idEditor').val();
        var editor = CKEDITOR.instances[idEditor];
        if ( $('iframe[title*="'+idEditor+'"]').length > 0 ) {
            var r = confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
            if (r == true) { 
                var iframe = $('iframe[title*="'+idEditor+'"]').contents();
                    editor.focus();
                    editor.fire('saveSnapshot');
                    iframe.find('body').html(result);
                    wordToSEI(iframe);
                    editor.fire('saveSnapshot');
                    enableButtonSavePro();
            }
        }
    }
    if ( CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'inportWord').getValue() == true ) {
        fr.readAsText(files.item(0), "cP1252");
    } else {
        fr.readAsText(files.item(0));
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
        if(this.nodeType === Node.COMMENT_NODE) {
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
	$('div[id^=cke_txaEditor_]').each(function(index){ 
		var idEditor = $(this).attr('id').replace('cke_', '');
		var iframe = $('iframe[title*="'+idEditor+'"]').contents();
		if ( iframe.find('body').attr('contenteditable') == 'true' ) {
			var oEditor = CKEDITOR.instances[idEditor];
				initPasteImgToBase64(oEditor);
		}
	});
}
function updatePreviewLatex() {
    var mathTextValue = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'MathText').getValue();
    // Clean previous preview
    if ( mathTextValue != '' ) { 
        $('#latexPreview').html('<img title="'+mathTextValue+'" class="" src="https://latex.codecogs.com/png.latex?'+encodeURI(mathTextValue)+'">');
        getBase64Image($('#latexPreview').find('img'));
    } else {
        $('#latexPreview').html('');
    }
}
function openDialogLatex(this_) {
    var idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
    $('#idEditor').val(idEditor);
    CKEDITOR.instances[idEditor].openDialog('latexDialog');
}
function getDialogLatex() {
    var htmlLatexPreview =  '<div id="latexPreview" style="text-align: center;margin: 20px;"></div>'+
                            '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Consulte o <a href="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238); font-style: italic;">Guia de edi\u00E7\u00E3o/F\u00F3rmulas TeX</a> para utilizar a liguagem LaTeX. <br>Se preferir, utilize um <a href="https://editor.codecogs.com/" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238); font-style: italic;">editor visual de equa\u00E7\u00F5es LaTeX</a>. </label>';
    CKEDITOR.dialog.add( 'latexDialog', function ( editor )
      {
         return {
            title : 'Inserir Equa\u00E7\u00E3o',
            minWidth : 500,
            minHeight : 200,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var idEditor = $('#idEditor').val();
                var editor = CKEDITOR.instances[idEditor];
                var mathText_input = this.getContentElement( 'tab1', 'MathText' ).getValue();
                var imgMath = $('#latexPreview').find('img');
                if ( mathText_input != '' && imgMath.length > 0 ) {
                    editor.focus();
                    editor.fire('saveSnapshot');
                    CKEDITOR.instances[idEditor].insertHtml($('#latexPreview').html());
                    editor.fire('saveSnapshot');
                    event.data.hide = true;
                }
            },
            onShow : function() {
				var idEditor = $('#idEditor').val();
				var oEditor = CKEDITOR.instances[idEditor];
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
            icon: URL_SEIPRO+'icons/addestilotabela.png',
            command: 'addestilo',
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

        var tablesort = function( order ){
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            if ( element ){
                editor.focus();
                editor.fire('saveSnapshot');
                var column_nr = element.getAscendant( { td:1, th:1 }, true ).getIndex();
                var table = element.getAscendant({table:1});
                var tbody = table.getElementsByTag('tbody').getItem(0);
                if(tbody == undefined) tbody = table;
                var items = tbody.$.childNodes;
                var itemsArr = [];
                for (var i in items) {
                    if (items[i].nodeType == 1) // get rid of the whitespace text nodes
                        itemsArr.push(items[i]);		
                }

                itemsArr.sort(function(a, b) {
                    var aText = a.childNodes[column_nr].innerText.trim();
                    var bText = b.childNodes[column_nr].innerText.trim();
                    if(!aText || 0 === aText.length) 
                        if(!bText || 0 === bText.length) return 0;
                        else return 1;
                    if(!bText || 0 === bText.length) return -1;
                    if(order == 'desc') return bText.localeCompare(aText, undefined, {numeric:true});
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
	$('div[id^=cke_txaEditor_]').each(function(index){ 
		var idEditor = $(this).attr('id').replace('cke_', '');
		var iframe = $('iframe[title*="'+idEditor+'"]').contents();
		if ( iframe.find('body').attr('contenteditable') == 'true' ) {
			var oEditor = CKEDITOR.instances[idEditor];
				tableSorterPro(oEditor);
                menuCopyStyle(oEditor);
		}
	});
}

function initFunctions() {
    getDialogLegisSEI();
    getDialogNotaRodape();
    getDialogSumarioDocumento();
    getDialogSyleTable();
	getDialogTinyUrl();
	getDialogQrCode();
    getDialogLinkPro();
    getDialogImportDocPro();
    getDialogLatex();
	loadResizeImg();
    updateDialogDefinitionPro();
    loadPasteImgToBase64();
    initContextMenuPro();
    insertFontIcon($('html'));
	
	// RETORNA DADOS DO PROCESSO
	var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
	getDadosIframeProcessoPro(idProcedimento, 'editor');
}
addButton();
