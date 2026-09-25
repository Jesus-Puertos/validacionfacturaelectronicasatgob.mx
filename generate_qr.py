"""Regenerate the printable demo QR after choosing its permanent public URL.

Usage: python generate_qr.py https://demo.example.org/index.html
Requires: pip install "qrcode[pil]"
"""
import argparse
import html
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

import qrcode
from qrcode.image.svg import SvgPathImage

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('url', help='Public HTTPS URL of the demonstration page')
args = parser.parse_args()
parts = urlsplit(args.url)
if parts.scheme != 'https' or not parts.hostname or parts.username or parts.password:
    parser.error('Provide a public HTTPS URL without credentials.')
params = dict(parse_qsl(parts.query))
params['demo'] = 'cfdi-01'
url = urlunsplit((parts.scheme, parts.netloc, parts.path or '/', urlencode(params), ''))
root = Path(__file__).resolve().parent
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=4)
qr.add_data(url)
qr.make(fit=True)
qr.make_image(fill_color='black', back_color='white').save(root / 'assets/qr-prueba-cfdi.png')
qr.make_image(image_factory=SvgPathImage).save(root / 'assets/qr-prueba-cfdi.svg')
page = root / 'qr-prueba.html'
content = page.read_text(encoding='utf-8')
content = re.sub(r'<a href="[^"]+">Abrir consulta</a>',
                 lambda _: '<a href="' + html.escape(url, quote=True) + '">Abrir consulta</a>', content)
content = re.sub(r'<p class="print-note">.*?</p>',
                 lambda _: '<p class="print-note">Demostración pública · ' + html.escape(parts.hostname) + '</p>', content)
content = content.replace('Conecta el teléfono a la misma red Wi-Fi que esta computadora y escanea el QR.',
                          'Conecta el teléfono a internet y escanea el QR.')
content = content.replace('QR para abrir la consulta de prueba en la red Wi-Fi local',
                          'QR para abrir la demostración pública no oficial')
content = re.sub(r'<p>La computadora y el servidor.*?</p>',
                 '<p>Este QR seguirá funcionando mientras se conserve la URL pública y el sitio permanezca disponible. Puedes actualizar la demostración sin cambiar esa dirección.</p>', content)
page.write_text(content, encoding='utf-8')
print('QR updated: ' + url)
