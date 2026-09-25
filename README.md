# validacionfacturaelectronicasatgob.mx

Prototipo independiente de una interfaz de consulta de CFDI, con fines educativos y profesionales. **No es un servicio oficial y no tiene afiliación ni respaldo del SAT o del Gobierno de México. Los resultados son simulados y no tienen validez fiscal.**

## Uso

Sitio estático sin proceso de compilación. Abre `index.html` o sirve esta carpeta con un servidor HTTP local, por ejemplo:

```sh
python -m http.server 5500
```

Visita `http://localhost:5500/index.html?demo=cfdi-01` para precargar los datos del ejemplo. Escribe el código alfanumérico mostrado y pulsa **Verificar CFDI**. La tabla contiene exclusivamente los datos de prueba proporcionados para la demostración, sin consultar al SAT.

El código de imagen es una simulación en el navegador, no un mecanismo de seguridad para producción. Los archivos XML seleccionados no se suben ni se validan.

## QR imprimible

`qr-prueba.html` permite imprimir el QR o guardarlo como PDF. El QR incluido apunta a una IP de la red local de desarrollo, no a una página pública permanente.

Una vez publicada la demostración, regenera el QR con su URL HTTPS definitiva:

```sh
python -m pip install "qrcode[pil]"
python generate_qr.py https://TU-DOMINIO/index.html
```

Conserva esa URL y el alojamiento activos para que las copias impresas sigan funcionando. Subir el repositorio a GitHub no publica automáticamente el sitio.

## Recursos visuales

El diseño utiliza logotipos, iconos y tipografías obtenidos de los sitios gubernamentales de referencia, únicamente para reproducir la interfaz en esta demostración. No se reclama su autoría ni se implica una licencia o respaldo gubernamental. Los enlaces del encabezado y pie de página dirigen a sitios externos de referencia.
