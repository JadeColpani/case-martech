// Preencha este arquivo com qualquer código que você necessite para realizar a
// coleta, desde a biblioteca analytics.js, gtag.js ou o snippet do Google Tag 
// Manager. No último caso, não é necessário implementar a tag <noscript>.
// O ambiente dispõe da jQuery 3.5.1, então caso deseje, poderá utilizá-la
// para fazer a sua coleta.
// Caso tenha alguma dúvida sobre o case, não hesite em entrar em contato.

// ─────────────────────────────────────────────────────────────
// tagueamento.js - por Jade Colpani 
// Detecta eventos no DOM e publica no dataLayer
// O GTM consome esses pushes e envia para o GA4
// ─────────────────────────────────────────────────────────────

// Garante que o dataLayer existe mesmo antes do GTM carregar
window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {

  // ═══════════════════════════════════════════════════════════
  // BLOCO 1 — EVENTOS GLOBAIS 
  // ═══════════════════════════════════════════════════════════

// ── Entre em Contato ──
let btnContato = document.querySelector('.menu-lista-contato');
if (btnContato) {
  btnContato.addEventListener('click', function () { //"Ouve" se temos um click no elemento do menu
    window.dataLayer.push({
      event: 'click', 
      page_location: window.location.href, 
      element_name: 'entre_em_contato', 
      element_group: 'menu' 
    });
  });
}

  // ── Download PDF ──
  let btnPDF = document.querySelector('a[href$=".pdf"]');
  if (btnPDF) {
    btnPDF.addEventListener('click', function () {
      dataLayer.push({
        event: 'file_download',
        page_location: window.location.href,
        element_name:  'download_pdf',
        element_group: 'menu'
      });
    });
  }


// ═══════════════════════════════════════════════════════════
// BLOCO 2 — Página Análise
// ═══════════════════════════════════════════════════════════

let cardsMontadoras = document.querySelectorAll('.card-montadoras'); // Seleciona a classe dos botões VER MAIS
cardsMontadoras.forEach(function (card) { 
  card.addEventListener('click', function () {//Verifica se houve click nos botões
    let nomeConteudo = this.dataset.id; //Define a variável que vai capturar o nome do elemento clicado
    window.dataLayer.push({
      'event': 'click',                   
      'page_location': window.location.href, 
      'element_name': nomeConteudo, // Captura o valor com letra minúscula diretamente do data-id
      'element_group': 'ver_mais'      
    });
  });
});

// ═══════════════════════════════════════════════════════════
// BLOCO 3 — Página Sobre | Formulário
// ═══════════════════════════════════════════════════════════

let form = document.querySelector('form.contato');
let formStarted = false;
let isSubmitting = false;

if (form) {

  // ── form_start ──
  form.addEventListener('change', function (e) { //Change possibilita capturar a alteração de valor
    if (!formStarted) {
      formStarted = true;
      window.dataLayer.push({
        'event': 'form_start',
        'page_location': window.location.href,
        'form_id': form.getAttribute('id') || '', //Verifica se o form tem id, senão, envia vazio
        'form_name': form.getAttribute('name') || 'contato', //Verifica se o form tem nome, senão, envia 'contato'
        'form_destination': form.getAttribute('action') || '' //Verifica se o form tem action, senão, envia vazio
      });
    }
  }, { capture: true });

  // ── form_submit ──
  form.addEventListener('submit', function (e) {
    isSubmitting = true;

    let submitBtn = form.querySelector('button[type="submit"]');
    window.dataLayer.push({
      'event': 'form_submit',
      'page_location': window.location.href,
      'form_id': form.getAttribute('id') || '',
      'form_name': form.getAttribute('name') || 'contato',
      'form_destination': form.getAttribute('action') || '',
      'form_submit_text': submitBtn ? submitBtn.innerText.trim() : ''
    });
  });

}

// ── view_form_success ──
let lightboxElement = document.querySelector('.lightbox');

if (lightboxElement) {
  let successObserver = new MutationObserver(function(mutations) {
    // SÓ processa se o usuário tiver clicado em enviar (isSubmitting === true)
    if (!isSubmitting) return;

    // Verifica se a lightbox está visível na tela
    let isVisible = lightboxElement.offsetWidth > 0 || lightboxElement.offsetHeight > 0;

    // Verifica se o conteúdo interno da lightbox é o de sucesso (evita disparar no form)
    // O texto visualizado no popup é "Obrigado pelo seu contato"
    let contemTextoSucesso = lightboxElement.innerText.includes('Obrigado') || 
                             lightboxElement.innerText.includes('contato');

    if (isVisible && contemTextoSucesso) { //Se está visível e contém 'Obrigado', dispara o push
      window.dataLayer.push({
        'event': 'view_form_success',
        'page_location': window.location.href,
        'form_id': form.getAttribute('id') || '',
        'form_name': form.getAttribute('name') || 'contato'
      });
      
      isSubmitting = false; // Reseta a trava de segurança da etapa de envio do formulário
      successObserver.disconnect(); // Para de observar para não duplicar
    }
  });

  // Observa o body para capturar a troca de conteúdo dentro da lightbox
  successObserver.observe(document.body, { 
    attributes: true, 
    childList: true, // Detecta quando o texto muda de form para sucesso
    subtree: true, 
    attributeFilter: ['class', 'style'] 
  });
    }

  }); // fim DOMContentLoaded