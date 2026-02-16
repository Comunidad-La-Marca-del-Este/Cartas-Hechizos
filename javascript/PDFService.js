class PDFService {
    /**
     * Genera un PDF fusionado con las tarjetas de los hechizos seleccionados.
     * @param {GameSystem} system - Instancia del sistema seleccionado.
     * @param {string[]} selectedSpells - Lista de nombres de hechizos seleccionados.
     * @returns {Promise<void>}
     */
    async generatePDF(system, selectedSpells) {
        if (!system) {
            console.error("No hay un sistema seleccionado.");
            return;
        }

        if (!selectedSpells || selectedSpells.length === 0) {
            alert("No hay hechizos seleccionados para generar.");
            return;
        }

        const numHechizosPorPagina = system.getSpellsPerCard();

        try {
            // Cargar la plantilla PDF una sola vez
            const response = await fetch(system.getPDFTemplate());
            if (!response.ok) throw new Error(`Error al cargar la plantilla PDF: ${response.statusText}`);

            const templateArrayBuffer = await response.arrayBuffer();

            // Crear el documento PDF final
            const mergedPdf = await PDFLib.PDFDocument.create();

            // Procesar los hechizos en lotes (páginas)
            for (let k = 0; k < selectedSpells.length; k += numHechizosPorPagina) {
                const batch = selectedSpells.slice(k, k + numHechizosPorPagina);

                // Obtener los datos para rellenar los campos de este lote
                const fieldsData = system.mapSpellsToPDF(batch);

                // Cargar una copia de la plantilla para esta página
                const batchDoc = await PDFLib.PDFDocument.load(templateArrayBuffer.slice(0));
                const form = batchDoc.getForm();

                // Rellenar los campos
                this._fillFormFields(form, fieldsData);

                // Aplanar el formulario para fijar el contenido
                form.flatten();

                // Copiar las páginas al documento final
                const copiedPages = await mergedPdf.copyPages(batchDoc, batchDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // Guardar y descargar el PDF final
            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, 'Tarjeta ' + system.name + '.pdf');

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un error al generar el PDF. Por favor consulta la consola para más detalles.");
        }
    }

    /**
     * Rellena los campos del formulario PDF con los datos proporcionados.
     * @private
     * @param {PDFLib.PDFForm} form 
     * @param {Object} fieldsData 
     */
    _fillFormFields(form, fieldsData) {
        for (const [key, valueArray] of Object.entries(fieldsData)) {
            if (!valueArray || valueArray.length === 0) continue;

            const textValue = String(valueArray[0]);

            try {
                const field = form.getField(key);
                if (field instanceof PDFLib.PDFTextField) {
                    // Eliminar límite de longitud si existe
                    field.setMaxLength(undefined);

                    // Asegurar que el campo es editable
                    if (field.isReadOnly()) {
                        field.enableReadOnly(false);
                    }

                    // APLICAR CORRECCIÓN DE ALINEACIÓN: Bajar ligeramente el texto
                    try {
                        if (field.acroField && field.acroField.getWidgets) {
                            const widgets = field.acroField.getWidgets();
                            widgets.forEach(widget => {
                                const rect = widget.getRectangle();
                                widget.setRectangle({
                                    x: rect.x,
                                    y: rect.y - 3, // Move down 3 points
                                    width: rect.width,
                                    height: rect.height
                                });
                            });
                        }
                    } catch (e) {
                        // Ignore positioning errors
                    }

                    field.setText(textValue);
                }
            } catch (err) {
                // Log warning but continue
                console.warn(`Campo '${key}' no encontrado o error al asignar texto:`, err);
            }
        }
    }
}
