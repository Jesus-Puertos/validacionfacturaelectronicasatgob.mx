(() => {
  'use strict';
  const fixture = {
    folio: '311B693F-282C-429D-B8B2-90E69370579B',
    emisor: 'MERR981119614',
    receptor: 'DOPO8006205Y2'
  };
  const form = document.querySelector('#verification-form');
  const result = document.querySelector('#result');
  const table = document.querySelector('#fixture-table');
  const detail = document.querySelector('#result-detail');
  const folioFields = document.querySelector('#folio-fields');
  const xmlFields = document.querySelector('#xml-fields');
  const example = document.querySelector('#example');
  let mode = 'folio';
  let challenge = '';
  const captcha = form.elements.captcha;

  function newChallenge() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const digits = '23456789';
    const alphabet = letters + digits;
    let next;
    do {
      const random = crypto.getRandomValues(new Uint32Array(6));
      const chars = [letters[random[0] % letters.length], digits[random[1] % digits.length]];
      for (let i = 2; i < 5; i++) chars.push(alphabet[random[i] % alphabet.length]);
      const offset = random[5] % chars.length;
      next = chars.slice(offset).concat(chars.slice(0, offset)).join('');
    } while (next === challenge);
    challenge = next;
    document.querySelector('#captcha-code').textContent = challenge;
    document.querySelector('#captcha-title').textContent = 'Código de demostración: ' + challenge;
    captcha.value = '';
    captcha.setCustomValidity('');
    result.hidden = true;
  }
  document.querySelector('#refresh-captcha').addEventListener('click', newChallenge);
  captcha.addEventListener('input', () => captcha.setCustomValidity(''));

  function fillExample() {
    for (const [key, value] of Object.entries(fixture)) form.elements[key].value = value;
    newChallenge();
    result.hidden = true;
  }

  document.querySelectorAll('[name="query-mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      mode = radio.value;
      folioFields.hidden = folioFields.disabled = mode !== 'folio';
      xmlFields.hidden = xmlFields.disabled = mode !== 'xml';
      example.hidden = mode !== 'folio';
      result.hidden = true;
      newChallenge();
    });
  });
  example.addEventListener('click', fillExample);
  form.addEventListener('submit', event => {
    event.preventDefault();
    captcha.setCustomValidity(captcha.value.trim().toUpperCase() === challenge
      ? '' : 'El código no coincide con la imagen. Inténtalo de nuevo.');
    if (!form.reportValidity()) return;
    const matches = mode === 'folio' && Object.entries(fixture).every(
      ([key, value]) => form.elements[key].value.trim().toUpperCase() === value
    );
    table.hidden = !matches;
    detail.hidden = matches;
    detail.textContent = mode === 'xml'
      ? 'Archivo seleccionado localmente. Su contenido no ha sido leído ni validado.'
      : 'Estos datos no corresponden al ejemplo de esta demostración. Usa “Cargar ejemplo” para probar el resultado simulado.';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  for (const event of ['reset', 'input', 'change']) {
    form.addEventListener(event, () => { result.hidden = true; });
  }
  form.addEventListener('reset', newChallenge);
  newChallenge();
  // The QR identifies a local fixture, without including RFCs or names in the URL.
  if (new URLSearchParams(window.location.search).get('demo') === 'cfdi-01') fillExample();
})();
