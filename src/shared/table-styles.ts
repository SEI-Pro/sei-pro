// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Pure table color/style presets used by the editor style dialog. */

export function getColorID() {
	var colorID = {
		color1: { 
			light: '#dddddd', 
			dark: '#646464'
		},
		color2: { 
			light: '#e2daf1', 
			dark: '#7b54c0'
		},
		color3: { 
			light: '#eed7e9', 
			dark: '#b1489c'
		},
		color4: { 
			light: '#f2d7dc', 
			dark: '#c2495e'
		},
		color5: { 
			light: '#ecdacf', 
			dark: '#a85723'
		},
		color6: { 
			light: '#dfdfc8', 
			dark: '#6e6b06'
		},
		color7: { 
			light: '#d1e2cc', 
			dark: '#2f7c16'
		},
		color8: { 
			light: '#c9e4d7', 
			dark: '#0a824a'
		},
		color9: { 
			light: '#cae2e6', 
			dark: '#0e7a8b'
		},
		color10: { 
			light: '#d4def0', 
			dark: '#3b68b9'
		}
	};
	return colorID;
}
export function getStyleTable(color, width = 80) {
	var styleTable = {
		tableStyle1: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: '',
			tr: '',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle2: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'background-color: '+color.light+';',
			tr: ['','background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle3: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle4: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle5: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%;border: none;',
			tr_head: 'border: none;',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle6: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'background-color: '+color.light+'; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle7: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle8: {
			table: 'border-collapse:collapse; border-bottom: 1px solid '+color.dark+'; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:'+width+'%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border-left: 1px solid '+color.dark+';',
			td_first: 'border-right: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle9: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:'+width+'%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle10: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle11: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important',
			tr: 'border: none;',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'background-color: '+color.light+'; border-bottom: 1px solid #fff; border-right: 1px solid #fff',
			td_first: 'color: #fff;background-color: '+color.dark+'; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle12: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle13: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto ;width:'+width+'%; border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle14: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle15: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:'+width+'%;border-left: none; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border-bottom: 1px solid '+color.dark+';',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle16: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle17: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto;width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle18: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%;border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 3px solid #fff !important',
			tr: ['border: none; background-color: '+color.light+';','color: #fff; border: none; background-color: '+color.dark+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border:none;',
			td_first: 'border: none; border-right: 3px solid #fff',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle19: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:'+width+'%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle20: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle21: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: '',
			tr: '',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		}
	};
	return styleTable;
}
